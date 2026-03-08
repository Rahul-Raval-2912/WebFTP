angular.module('ftpClientApp').controller('MainController', ['$scope', 'FtpService', function ($scope, FtpService) {
  $scope.isConnected = false;
  $scope.credentials = { port: 21 };
  $scope.currentPath = '/';
  $scope.allItems = [];
  $scope.selectedFile = null;
  $scope.error = null;
  $scope.showHiddenFiles = false;
  let navigationHistory = [];
  let historyIndex = -1;

  // Check session status on load
  FtpService.checkStatus().then(function (response) {
    if (response.data.connected) {
      $scope.isConnected = true;
      $scope.credentials = response.data.credentials;
      $scope.loadFiles('/');
    }
  }).catch(function () {
    $scope.isConnected = false;
  });

  document.addEventListener('keydown', function (e) {
    if (!$scope.isConnected) return;

    if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      $scope.$apply(function () {
        $scope.goBack();
      });
    } else if (e.altKey && e.key === 'ArrowRight') {
      e.preventDefault();
      $scope.$apply(function () {
        $scope.goForward();
      });
    }
  });

  $scope.connect = function () {
    $scope.error = null;
    FtpService.connect($scope.credentials).then(function (response) {
      if (response.data.success) {
        $scope.isConnected = true;
        $scope.loadFiles('/');
      }
    }).catch(function (error) {
      $scope.error = error.data?.message || 'Connection failed';
    });
  };

  $scope.loadFiles = function (path, skipHistory) {
    FtpService.listFiles(path).then(function (response) {
      if (response.data.success) {
        $scope.currentPath = path;
        $scope.updateBreadcrumb();

        if (!skipHistory) {
          navigationHistory = navigationHistory.slice(0, historyIndex + 1);
          navigationHistory.push(path);
          historyIndex = navigationHistory.length - 1;
        }

        let directories = response.data.files.filter(f => f.type === 'directory');
        let files = response.data.files.filter(f => f.type === 'file');
        
        if (!$scope.showHiddenFiles) {
          directories = directories.filter(f => !f.name.startsWith('.'));
          files = files.filter(f => !f.name.startsWith('.'));
        }
        
        $scope.allItems = [...directories, ...files];
      }
    }).catch(function (error) {
      console.error('Failed to load files:', error);
      $scope.error = 'Failed to load directory';
    });
  };

  $scope.goBack = function () {
    if (historyIndex > 0) {
      historyIndex--;
      $scope.loadFiles(navigationHistory[historyIndex], true);
    }
  };

  $scope.goForward = function () {
    if (historyIndex < navigationHistory.length - 1) {
      historyIndex++;
      $scope.loadFiles(navigationHistory[historyIndex], true);
    }
  };

  $scope.canGoBack = function () {
    return historyIndex > 0;
  };

  $scope.canGoForward = function () {
    return historyIndex < navigationHistory.length - 1;
  };

  $scope.updateBreadcrumb = function () {
    if ($scope.currentPath === '/') {
      $scope.pathParts = [];
    } else {
      $scope.pathParts = $scope.currentPath.split('/').filter(p => p);
    }
  };

  $scope.navigateTo = function (path) {
    $scope.loadFiles(path);
  };

  $scope.navigateToIndex = function (index) {
    const parts = $scope.pathParts.slice(0, index + 1);
    const path = '/' + parts.join('/');
    $scope.loadFiles(path);
  };

  $scope.handleClick = function (item) {
    if (item.type === 'directory') {
      $scope.loadFiles(item.path);
    } else {
      $scope.downloadFile(item);
    }
  };

  $scope.selectFile = function (file) {
    $scope.selectedFile = file;
  };

  $scope.downloadFile = function (file) {
    FtpService.downloadFile(file.path);
  };

  $scope.renameFile = function (file) {
    const newName = prompt('Enter new name:', file.name);
    if (newName && newName !== file.name) {
      const newPath = file.path.replace(file.name, newName);
      FtpService.renameFile(file.path, newPath).then(function () {
        $scope.loadFiles($scope.currentPath);
      }).catch(function (error) {
        alert('Rename failed: ' + (error.data?.message || 'Unknown error'));
      });
    }
  };

  $scope.deleteFile = function (file) {
    if (confirm('Delete ' + file.name + '?')) {
      FtpService.deleteFile(file.path, file.type).then(function () {
        $scope.loadFiles($scope.currentPath);
      }).catch(function (error) {
        alert('Delete failed: ' + (error.data?.message || 'Unknown error'));
      });
    }
  };

  $scope.uploadFile = function () {
    document.getElementById('fileUpload').click();
  };

  $scope.handleFileSelect = function (files) {
    if (files.length > 0) {
      const file = files[0];
      FtpService.uploadFile($scope.currentPath, file).then(function (response) {
        if (response.data.success) {
          $scope.loadFiles($scope.currentPath, true);
          document.getElementById('fileUpload').value = '';
        }
      }).catch(function (error) {
        alert('Upload failed: ' + (error.data?.message || 'Unknown error'));
      });
    }
  };

  $scope.createDirectory = function () {
    const dirName = prompt('Enter directory name:');
    if (dirName) {
      FtpService.createDirectory($scope.currentPath, dirName).then(function (response) {
        if (response.data.success) {
          $scope.loadFiles($scope.currentPath, true);
        }
      }).catch(function (error) {
        alert('Create directory failed: ' + (error.data?.message || 'Unknown error'));
      });
    }
  };

  $scope.toggleHiddenFiles = function () {
    $scope.showHiddenFiles = !$scope.showHiddenFiles;
    $scope.loadFiles($scope.currentPath, true);
  };

  $scope.disconnect = function () {
    FtpService.disconnect().then(function () {
      $scope.isConnected = false;
      $scope.allItems = [];
      $scope.currentPath = '/';
    });
  };

  $scope.getFolderIcon = function (name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('download')) return 'mdi:folder-download';
    if (lowerName.includes('document')) return 'mdi:folder-text';
    if (lowerName.includes('image') || lowerName.includes('picture') || lowerName.includes('photo')) return 'mdi:folder-image';
    if (lowerName.includes('video') || lowerName.includes('movie')) return 'mdi:folder-video';
    if (lowerName.includes('music') || lowerName.includes('audio')) return 'mdi:folder-music';
    if (lowerName.includes('code') || lowerName.includes('src') || lowerName.includes('dev')) return 'mdi:folder-cog';
    if (lowerName.includes('archive') || lowerName.includes('backup')) return 'mdi:folder-zip';
    return 'mdi:folder';
  };

  $scope.getFileIcon = function (file) {
    if (file.type === 'directory') return $scope.getFolderIcon(file.name);

    const ext = file.name.split('.').pop().toLowerCase();
    const iconMap = {
      'c': 'mdi:language-c',
      'cpp': 'mdi:language-cpp',
      'java': 'mdi:language-java',
      'py': 'mdi:language-python',
      'js': 'mdi:language-javascript',
      'ts': 'mdi:language-typescript',
      'rb': 'mdi:language-ruby',
      'go': 'mdi:language-go',
      'php': 'mdi:language-php',
      'swift': 'mdi:language-swift',
      'rs': 'mdi:language-rust',
      'sh': 'mdi:bash',
      'pl': 'mdi:language-perl',
      'txt': 'mdi:file-document-outline',
      'md': 'mdi:language-markdown',
      'rtf': 'mdi:file-document',
      'pdf': 'mdi:file-pdf-box',
      'doc': 'mdi:file-word',
      'docx': 'mdi:file-word',
      'xls': 'mdi:file-excel',
      'xlsx': 'mdi:file-excel',
      'pptx': 'mdi:file-powerpoint',
      'html': 'mdi:language-html5',
      'css': 'mdi:language-css3',
      'json': 'mdi:code-json',
      'xml': 'mdi:xml',
      'yaml': 'mdi:file-code',
      'yml': 'mdi:file-code',
      'png': 'mdi:file-image',
      'jpg': 'mdi:file-image',
      'jpeg': 'mdi:file-image',
      'gif': 'mdi:file-image',
      'bmp': 'mdi:file-image',
      'mp3': 'mdi:file-music',
      'wav': 'mdi:file-music',
      'flac': 'mdi:file-music',
      'mp4': 'mdi:file-video',
      'avi': 'mdi:file-video',
      'mov': 'mdi:file-video',
      'mkv': 'mdi:file-video',
      'zip': 'mdi:folder-zip',
      'tar': 'mdi:folder-zip',
      'gz': 'mdi:folder-zip',
      'rar': 'mdi:folder-zip',
      'log': 'mdi:file-document-outline',
      'ini': 'mdi:cog',
      'conf': 'mdi:cog'
    };

    return iconMap[ext] || 'mdi:file-outline';
  };

  $scope.formatSize = function (bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
}]);
