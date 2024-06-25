const { ipcRenderer, contextBridge } = require("electron");
console.log("Preload script is running");

contextBridge.exposeInMainWorld("api", {
  //#region From backend to renderer

  HotkeysObj: (callback) => ipcRenderer.on("HotkeysObj", callback),
  //#endregion

  //#region  From renderer to backend
  UpdateHotkeys: (...args) => ipcRenderer.send("UpdateHotkeys", ...args),

  //#endregion
});
