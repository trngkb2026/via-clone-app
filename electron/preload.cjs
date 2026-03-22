const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('karabiner', {
  sync: (data) => ipcRenderer.invoke('sync-karabiner', data),
  readConfig: () => ipcRenderer.invoke('read-karabiner-config'),
  verify: (data) => ipcRenderer.invoke('verify-karabiner', data),
});
