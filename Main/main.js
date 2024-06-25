"use strict";

const path = require("path");
const { spawn } = require("child_process");
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  screen,
  globalShortcut,
} = require("electron");
/**
 * @type {BrowserWindow}
 */
let win;

let HotkeysObject;

/**
 *
 * @param {Object} MyObject
 */
function RegisterHotkeys(MyObject) {
  for (const key of Object.keys(MyObject)) {
    console.log("UpdatedHotkeysObject: ", MyObject[key]);
    console.log("Key: ", key);
    let NewFn = () => {
      win.webContents.send(key, MyObject[key]);
    };
    try {
      AddHotkey(MyObject[key], NewFn);
    } catch (error) {
      console.error("Error with hotkey registering: ", error);
      win.webContents.send(
        "Error",
        `There was an error setting your hotkey. ${error}`
      );
    }
  }
}
async function CreateWin(WinName, FilePath, PreloadPath) {
  WinName = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      preload: PreloadPath,
    },
  });

  await WinName.loadFile(`${FilePath}`);
  WinName.on("closed", () => {
    WinName = null;
  });
  return WinName;
}
function RemoveHotkeys() {
  globalShortcut.unregisterAll();
}
function AddHotkey(Hotkey, Function) {
  globalShortcut.register(Hotkey, Function);
}
function StartBot() {
  console.log("Bot running!");
  // win.webContents.send("StartBot", "Bot Started");
}
const createWindow = () => {
  const PreloadPath = path.join(__dirname, "..", "/Frontend/preload.js");
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      preload: PreloadPath,
    },
  });
  win.loadFile("Frontend/Index.html");
};

ipcMain.on("CreateHotkeyObj", (event, data) => {
  HotkeysObject = JSON.parse(data);
  console.log("HotkeysObj: ", JSON.stringify(HotkeysObject));
  RegisterHotkeys(HotkeysObject);
});
app.whenReady().then(() => {
  createWindow();

  const ToggleBot = globalShortcut.register("Control+Enter", () => {
    console.log("Bot is working!");
    win.webContents.send("ToggleBot", "Crafting Started");
  });

  ipcMain.on("OpenHotkeyEditor", async (event, args) => {
    let HotkeyWin;
    let PreloadPath = path.join(__dirname, "Hotkeys/HotkeysPreload.js");

    try {
      HotkeyWin = await CreateWin(
        HotkeyWin,
        "Main/Hotkeys/Hotkeys.html",
        PreloadPath
      );
      HotkeyWin.webContents.send("HotkeysObj", HotkeysObject);
    } catch (error) {
      console.error("Error creating hotkey window: ", error);
    }

    ipcMain.on("UpdateHotkeys", (event, data) => {
      RemoveHotkeys();
      win.webContents.send("UpdatedHotkeys", data);
      HotkeyWin.close();
      let UpdatedHotkeysObject = JSON.parse(data);
      console.log(UpdatedHotkeysObject);
      RegisterHotkeys(UpdatedHotkeysObject);
    });
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
