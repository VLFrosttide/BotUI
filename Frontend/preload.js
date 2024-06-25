const { ipcRenderer, contextBridge } = require("electron");
console.log("Preload script is running");

contextBridge.exposeInMainWorld("api", {
  //#region From backend to renderer
  StartBot: (callback) => ipcRenderer.on("StartBot", callback),
  EndBot: (callback) => ipcRenderer.on("EndBot", callback),

  HotkeysObj: (callback) => ipcRenderer.on("HotkeysObj", callback),
  UpdatedHotkeys: (callback) => ipcRenderer.on("UpdatedHotkeys", callback),
  Error: (callback) => ipcRenderer.on("Error", callback),
  //#endregion

  //#region From renderer to backend
  CreateHotkeyObj: (callback) => ipcRenderer.send("CreateHotkeyObj", callback),
  OpenHotkeyEditor: (callback) => {
    ipcRenderer.send("OpenHotkeyEditor", callback);
  },

  //#endregion
});
