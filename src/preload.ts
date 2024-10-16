// See the Electron documentation for details on how to use preload scripts:

import { contextBridge, ipcRenderer } from "electron";
import { BoringDTO } from "./dto/serviceModel/BoringDTO";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld('electronWindowControlAPI', {
    createNewWindow: () => ipcRenderer.invoke('window-control-new-window'),
})

contextBridge.exposeInMainWorld('electronBoringDataAPI', {
    insertBoring: (boringDto: BoringDTO) => ipcRenderer.invoke('boring-repository-insert', boringDto),
    fetchAllBorings: () => ipcRenderer.invoke('boring-repository-fetch-all'),
})