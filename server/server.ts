import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import multer from 'multer';
import { Client } from 'basic-ftp';
import path from 'path';
import { Readable } from 'stream';

const app = express();
const PORT = 3000;
const upload = multer({ storage: multer.memoryStorage() });

interface FTPCredentials {
  host: string;
  port: number;
  user: string;
  password: string;
}

interface FTPData {
  client: Client;
  credentials: FTPCredentials;
}

declare module 'express-session' {
  interface SessionData {
    ftpConnected?: boolean;
  }
}

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'ftp-client-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600000 }
}));

const ftpClients = new Map<string, FTPData>();

app.get('/api/status', async (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (!ftpData || !req.session.ftpConnected) {
    return res.json({ success: false, connected: false });
  }

  res.json({ success: true, connected: true, credentials: ftpData.credentials });
});

app.post('/api/connect', async (req: Request, res: Response) => {
  const { host, port, user, password } = req.body;
  const client = new Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host,
      port: port || 21,
      user,
      password,
      secure: false
    });

    const sessionId = req.sessionID;
    ftpClients.set(sessionId, { client, credentials: { host, port, user, password } });
    req.session.ftpConnected = true;

    res.json({ success: true, message: 'Connected successfully' });
  } catch (error) {
    res.status(401).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/list', async (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (!ftpData) {
    return res.status(401).json({ success: false, message: 'Not connected' });
  }

  const dirPath = (req.query.path as string) || '/';

  try {
    const list = await ftpData.client.list(dirPath);
    const files = list.map(item => ({
      name: item.name,
      type: item.isDirectory ? 'directory' : 'file',
      size: item.size,
      date: item.modifiedAt,
      path: path.posix.join(dirPath, item.name)
    }));

    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/download', async (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (!ftpData) {
    return res.status(401).json({ success: false, message: 'Not connected' });
  }

  const filePath = req.query.path as string;

  try {
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    await ftpData.client.downloadTo(res, filePath);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
});

app.post('/api/rename', async (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (!ftpData) {
    return res.status(401).json({ success: false, message: 'Not connected' });
  }

  const { oldPath, newPath } = req.body;

  try {
    await ftpData.client.rename(oldPath, newPath);
    res.json({ success: true, message: 'Renamed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/delete', async (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (!ftpData) {
    return res.status(401).json({ success: false, message: 'Not connected' });
  }

  const { path: filePath, type } = req.body;

  try {
    if (type === 'directory') {
      await ftpData.client.removeDir(filePath);
    } else {
      await ftpData.client.remove(filePath);
    }
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/move', async (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (!ftpData) {
    return res.status(401).json({ success: false, message: 'Not connected' });
  }

  const { sourcePath, destPath } = req.body;

  try {
    await ftpData.client.rename(sourcePath, destPath);
    res.json({ success: true, message: 'Moved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/preview', async (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (!ftpData) {
    return res.status(401).json({ success: false, message: 'Not connected' });
  }

  const filePath = req.query.path as string;

  try {
    const chunks: Buffer[] = [];
    
    await ftpData.client.downloadTo({
      write: (chunk: Buffer) => {
        chunks.push(chunk);
        return true;
      },
      end: () => {},
      on: () => {},
      once: () => {},
      emit: () => {}
    } as any, filePath);
    
    const buffer = Buffer.concat(chunks);
    const ext = path.extname(filePath).toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.txt': 'text/plain',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.html': 'text/html',
      '.css': 'text/css',
      '.xml': 'text/xml',
      '.py': 'text/plain',
      '.java': 'text/plain',
      '.c': 'text/plain',
      '.cpp': 'text/plain',
      '.md': 'text/plain'
    };
    
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error('Preview error:', (error as Error).message);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/thumbnail', async (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (!ftpData) {
    return res.status(401).json({ success: false, message: 'Not connected' });
  }

  const filePath = req.query.path as string;

  try {
    const chunks: Buffer[] = [];
    
    await ftpData.client.downloadTo({
      write: (chunk: Buffer) => {
        chunks.push(chunk);
        return true;
      },
      end: () => {},
      on: () => {},
      once: () => {},
      emit: () => {}
    } as any, filePath);
    
    const buffer = Buffer.concat(chunks);
    const ext = path.extname(filePath).toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.txt': 'text/plain',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.html': 'text/html',
      '.css': 'text/css',
      '.xml': 'text/xml',
      '.py': 'text/plain',
      '.java': 'text/plain',
      '.c': 'text/plain',
      '.cpp': 'text/plain',
      '.md': 'text/plain'
    };
    
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error('Thumbnail error:', (error as Error).message);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/upload', upload.single('file'), async (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (!ftpData) {
    return res.status(401).json({ success: false, message: 'Not connected' });
  }

  const { path: dirPath } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const remotePath = path.posix.join(dirPath, file.originalname);
    await ftpData.client.uploadFrom(Readable.from(file.buffer), remotePath);
    res.json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/mkdir', async (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (!ftpData) {
    return res.status(401).json({ success: false, message: 'Not connected' });
  }

  const { path: dirPath, name } = req.body;

  try {
    const newDirPath = path.posix.join(dirPath, name);
    await ftpData.client.ensureDir(newDirPath);
    res.json({ success: true, message: 'Directory created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/disconnect', (req: Request, res: Response) => {
  const sessionId = req.sessionID;
  const ftpData = ftpClients.get(sessionId);

  if (ftpData) {
    ftpData.client.close();
    ftpClients.delete(sessionId);
  }

  req.session.destroy(() => {});
  res.json({ success: true, message: 'Disconnected' });
});

app.listen(PORT, () => {
  console.log(`FTP Server running on http://localhost:${PORT}`);
});
