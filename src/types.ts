declare var angular: any;

interface FTPCredentials {
  host?: string;
  port: number;
  user?: string;
  password?: string;
}

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size: number;
  date: Date;
  path: string;
}

interface Scope {
  isConnected: boolean;
  credentials: FTPCredentials;
  currentPath: string;
  allItems: FileItem[];
  selectedFile: FileItem | null;
  error: string | null;
  showHiddenFiles: boolean;
  pathParts: string[];
  connect: () => void;
  loadFiles: (path: string, skipHistory?: boolean) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  updateBreadcrumb: () => void;
  navigateTo: (path: string) => void;
  navigateToIndex: (index: number) => void;
  handleClick: (item: FileItem) => void;
  selectFile: (file: FileItem) => void;
  downloadFile: (file: FileItem) => void;
  renameFile: (file: FileItem) => void;
  deleteFile: (file: FileItem) => void;
  uploadFile: () => void;
  handleFileSelect: (files: FileList) => void;
  createDirectory: () => void;
  toggleHiddenFiles: () => void;
  disconnect: () => void;
  getFolderIcon: (name: string) => string;
  getFileIcon: (file: FileItem) => string;
  formatSize: (bytes: number) => string;
  $apply: (fn: () => void) => void;
}
