const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  startCompile: (data) => ipcRenderer.invoke('start-compile', data),
  cancelCompile: () => ipcRenderer.invoke('cancel-compile'),
  onCompileOutput: (callback) => ipcRenderer.on('compile-output', (event, data) => callback(data)),
  removeCompileOutputListeners: () => ipcRenderer.removeAllListeners('compile-output'),
  // 更新相关方法
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  onUpdateError: (callback) => ipcRenderer.on('update-error', (event, message) => callback(message)),
  removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update-available');
    ipcRenderer.removeAllListeners('update-downloaded');
    ipcRenderer.removeAllListeners('update-error');
  }
}); 