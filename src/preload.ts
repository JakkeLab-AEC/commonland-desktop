// See the Electron documentation for details on how to use preload scripts:

import { contextBridge, ipcRenderer } from "electron";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld('electronWindowControlAPI', {
    createNewWindow: () => ipcRenderer.invoke('window-control-new-window'),
})