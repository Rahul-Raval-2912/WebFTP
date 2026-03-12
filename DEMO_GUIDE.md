# WebFTP Project Demo Guide

## Pre-Demo Setup (Do this BEFORE showing to sir)

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile TypeScript Frontend
```bash
npm run build:frontend
```

### 3. Setup Test FTP Server (Optional - if you have one)
- Have FTP credentials ready (host, port, username, password)
- Or use a public test FTP server like: `ftp.dlptest.com`
  - Host: ftp.dlptest.com
  - Port: 21
  - Username: dlpuser
  - Password: rNrKYTX9g7z3RgJRmxWuGHbeu

---

## Demo Presentation Steps

### Step 1: Introduction (30 seconds)
**Say:** "Sir, I've built a Web-based FTP Client that allows users to manage files on remote FTP servers directly from their browser, without installing any desktop software."

**Show:** README.md screenshots

---

### Step 2: Start the Application (1 minute)

**Terminal 1 - Backend Server:**
```bash
npm start
```
**Say:** "This starts the FTP backend API server on port 3000"

**Terminal 2 - Frontend Server:**
```bash
npm run frontend
```
**Say:** "This serves the web interface on port 8080"

**Open Browser:** http://localhost:8080

---

### Step 3: Connect to FTP Server (1 minute)

**Show the login screen and explain:**
- "Users enter their FTP server credentials here"
- Fill in the connection details
- Click "Connect"

**Say:** "The application establishes a secure session with the FTP server"

---

### Step 4: Demonstrate Core Features (3-4 minutes)

#### A. File Browsing
- **Show:** Navigate through directories by clicking folders
- **Say:** "Users can browse the entire directory structure"

#### B. Breadcrumb Navigation
- **Show:** Click on breadcrumb parts to jump to parent directories
- **Say:** "Quick navigation using breadcrumbs"

#### C. Back/Forward Navigation
- **Show:** Use Back and Forward buttons
- **Say:** "Browser-like navigation with keyboard shortcuts (Alt + Left/Right)"

#### D. Upload Files
- **Show:** Click "Upload" button, select a file
- **Say:** "Users can upload files directly from their computer"

#### E. Create Directory
- **Show:** Click "New Folder", enter name
- **Say:** "Create new directories on the server"

#### F. Download Files
- **Show:** Click on a file to download
- **Say:** "Download files with a single click"

#### G. File Operations
- **Show:** Rename and Delete buttons on files
- **Say:** "Full file management - rename, delete operations"

#### H. Hidden Files Toggle
- **Show:** Toggle hidden files button
- **Say:** "Show or hide system files starting with dot"

---

### Step 5: Technical Architecture (1 minute)

**Say:** "The architecture consists of:"

1. **Frontend:** 
   - AngularJS for UI
   - TypeScript for type safety
   - Responsive design with custom CSS

2. **Backend:**
   - Node.js + Express server
   - basic-ftp library for FTP operations
   - Session management for multiple users

3. **Key Features:**
   - Session-based FTP connections
   - File upload/download streaming
   - RESTful API design
   - Keyboard shortcuts for power users

---

### Step 6: Code Highlights (Optional - if time permits)

**Show in VS Code:**

1. **server/server.ts** - "Backend API endpoints"
2. **src/js/controllers.ts** - "Frontend controller logic"
3. **src/services/ftpService.ts** - "Service layer for API calls"

---

### Step 7: Disconnect & Conclusion (30 seconds)

- **Show:** Click "Disconnect" button
- **Say:** "Secure session cleanup when done"

**Conclude:** "This project demonstrates full-stack development with TypeScript, RESTful APIs, and real-world FTP protocol implementation. It's production-ready and can be deployed for actual use."

---

## Quick Troubleshooting

### If Backend Fails to Start:
```bash
# Check if port 3000 is in use
lsof -i :3000
# Kill the process if needed
kill -9 <PID>
```

### If Frontend Fails to Start:
```bash
# Check if port 8080 is in use
lsof -i :8080
# Kill the process if needed
kill -9 <PID>
```

### If TypeScript Compilation Fails:
```bash
npm run build:frontend
```

---

## Key Points to Emphasize

✅ **No Desktop Software Required** - Runs entirely in browser
✅ **Modern Tech Stack** - TypeScript, Node.js, Express
✅ **Full FTP Functionality** - Upload, download, rename, delete
✅ **User-Friendly Interface** - Intuitive navigation and keyboard shortcuts
✅ **Session Management** - Secure multi-user support
✅ **Responsive Design** - Works on different screen sizes

---

## Expected Questions & Answers

**Q: Why use AngularJS instead of React/Vue?**
A: AngularJS provides a complete framework with built-in features like two-way binding, which simplifies state management for this type of application.

**Q: Is it secure?**
A: Currently uses HTTP for demo purposes. In production, we'd add HTTPS, authentication, and encrypted FTP (FTPS/SFTP).

**Q: Can multiple users connect simultaneously?**
A: Yes, the backend uses session management to handle multiple concurrent FTP connections.

**Q: What happens if connection drops?**
A: The session expires after 1 hour of inactivity, and users need to reconnect.

---

## Time Allocation (Total: 7-8 minutes)

- Introduction: 30s
- Starting App: 1min
- Connection Demo: 1min
- Feature Demo: 3-4min
- Architecture: 1min
- Conclusion: 30s
