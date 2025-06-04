const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  startCompile: (data) => ipcRenderer.invoke('start-compile', data),
  cancelCompile: () => ipcRenderer.invoke('cancel-compile'),
  onCompileOutput: (callback) => ipcRenderer.on('compile-output', (event, data) => callback(data)),
  removeCompileOutputListeners: () => ipcRenderer.removeAllListeners('compile-output')
}); 