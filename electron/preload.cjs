const { contextBridge, ipcRenderer } = require('electron');

// Renderer process için güvenli API oluştur
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform bilgisi
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  
  // Pencere boyutu yönetimi
  setWindowSize: (sizeName) => ipcRenderer.send('set-window-size', sizeName),
  getWindowSizes: () => ipcRenderer.sendSync('get-window-sizes'),

  // Üstte tutma
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
  getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top'),
});
