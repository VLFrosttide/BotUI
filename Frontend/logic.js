"use strict";
let DefaultHotkeys;
let OpenHotkeyEditorButton = document.getElementById("OpenHotkeyEditorButton");
if (localStorage.length <= 0) {
  // Set default hotkeys as an object and store it in localstorage
  DefaultHotkeys = { StartBot: "Ctrl+Enter", EndBot: "Ctrl+Delete" };
  console.log("Default: ", DefaultHotkeys);
  localStorage.setItem("Hotkeys", JSON.stringify(DefaultHotkeys));
}
// Get hotkeys and send them to the backend to create an object there.
DefaultHotkeys = JSON.parse(localStorage.getItem("Hotkeys"));
window.api.CreateHotkeyObj(JSON.stringify(DefaultHotkeys));

OpenHotkeyEditorButton.addEventListener("click", function () {
  window.api.OpenHotkeyEditor();
  console.log("works");
});

window.api.UpdatedHotkeys((event, data) => {
  localStorage.setItem("Hotkeys", data);
});

window.api.Error((event, data) => {
  console.warn(data);
  alert(`${data}`);
});
