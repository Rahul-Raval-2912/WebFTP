/// <reference path="../types.ts" />

angular.module('ftpClientApp').service('FtpService', ['$http', '$q', function($http: any, $q: any) {
  const API_URL = 'http://localhost:3000/api';
  const cache = new Map<string, any>();

  this.checkStatus = function() {
    return $http.get(`${API_URL}/status`, { withCredentials: true });
  };

  this.connect = function(credentials: FTPCredentials) {
    return $http.post(`${API_URL}/connect`, credentials, { withCredentials: true });
  };

  this.listFiles = function(path: string) {
    return $http.get(`${API_URL}/list`, { 
      params: { path },
      withCredentials: true,
      timeout: 10000
    });
  };

  this.downloadFile = function(path: string) {
    window.open(`${API_URL}/download?path=${encodeURIComponent(path)}`, '_blank');
  };

  this.renameFile = function(oldPath: string, newPath: string) {
    return $http.post(`${API_URL}/rename`, { oldPath, newPath }, { withCredentials: true });
  };

  this.deleteFile = function(path: string, type: string) {
    return $http.post(`${API_URL}/delete`, { path, type }, { withCredentials: true });
  };

  this.moveFile = function(sourcePath: string, destPath: string) {
    return $http.post(`${API_URL}/move`, { sourcePath, destPath }, { withCredentials: true });
  };

  this.uploadFile = function(dirPath: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', dirPath);
    
    return $http.post(`${API_URL}/upload`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': undefined },
      transformRequest: angular.identity
    });
  };

  this.createDirectory = function(dirPath: string, name: string) {
    return $http.post(`${API_URL}/mkdir`, { path: dirPath, name }, { withCredentials: true });
  };

  this.getThumbnail = function(path: string) {
    if (cache.has(path)) {
      return $q.resolve(cache.get(path));
    }
    
    return $http.get(`${API_URL}/thumbnail`, {
      params: { path },
      withCredentials: true,
      responseType: 'arraybuffer',
      timeout: 15000
    }).then(function(response: any) {
      cache.set(path, response);
      return response;
    });
  };

  this.disconnect = function() {
    cache.clear();
    return $http.post(`${API_URL}/disconnect`, {}, { withCredentials: true });
  };
}]);
