"use strict";

const HotkeyContainer = document.getElementById("HotkeyContainer");
const HotkeyLabels = document.getElementsByClassName("Label");
const KeyLabels = document.getElementsByClassName("KeyLabel");
const SaveHotkeysButton = document.getElementById("SaveHotkeysButton");
let Duplicates = false;

SaveHotkeysButton.addEventListener("click", (e) => {
  const LabelArray = Array.from(HotkeyLabels);
  for (let i = 0; i < LabelArray.length; i++) {
    if (MatchingLabels(LabelArray[i])) {
      alert("Please ensure that all the hotkeys are unique");
      Duplicates = true;
      break;
    }
  }
  console.log("Duplicates: ", Duplicates);
  if (!Duplicates) {
    let NewHotkeyObj = {};
    let LiveLabelArray = document.getElementsByClassName("Label");
    for (let i = 0; i < LiveLabelArray.length; i++) {
      let KeyL = KeyLabels[i].id.replace("Label", "");
      console.log("KeyL: ", KeyL);

      console.log(LiveLabelArray[i]);
      let ValueL = LiveLabelArray[i].textContent;
      console.log("ValueL: ", ValueL);

      NewHotkeyObj[KeyL] = ValueL;
    }
    NewHotkeyObj = JSON.stringify(NewHotkeyObj);
    console.log(NewHotkeyObj);
    window.api.UpdateHotkeys(NewHotkeyObj);
  }
});

function MatchingLabels(Label) {
  for (let i = 0; i < HotkeyLabels.length; i++) {
    if (HotkeyLabels[i] === Label) {
      continue;
    }
    if (HotkeyLabels[i].textContent === Label.textContent) {
      return true;
    }
  }

  return false;
}
let HotkeyEvl = null;
/**
 * Creates a new element, sets its properties, and inserts it into the specified parent element.
 * @param {String} ElementType - The type of the element to create (e.g., 'div', 'label', 'span').
 * @param {String} [ElementID] - Optional The ID attribute of the new element.
 * @param {String|Array} ElementClass - The class attribute of the new element, must be a string or array of strings.
 * @param {String} ElementText - The text content of the new element.
 * @param {HTMLElement} ElementParent - The parent element where the new element will be inserted.
 */
function CreateHtmlElement(
  ElementType,
  ElementID = "",
  ElementClass,
  ElementText,
  ElementParent
) {
  let NewElement = document.createElement(ElementType);

  if (ElementID) {
    NewElement.id = ElementID;
  }
  if (ElementClass) {
    if (Array.isArray(ElementClass)) {
      for (let i = 0; i < ElementClass.length; i++) {
        NewElement.classList.add(ElementClass[i]);
      }
    } else {
      NewElement.classList.add(ElementClass);
    }
  }
  if (ElementText) {
    NewElement.textContent = ElementText;
  }
  if (ElementParent) {
    ElementParent.appendChild(NewElement, document.body.firstElementChild);
  }
  return NewElement;
}

window.api.HotkeysObj((event, data) => {
  console.log("Data: ", data);
  let HotkeyObj = data;
  for (const key of Object.keys(HotkeyObj)) {
    let CurrentHotkey = HotkeyObj[key];
    let ParentContainer = CreateHtmlElement(
      "div",
      `${HotkeyObj[key]}Parent`,
      ["HotkeyParent", "Child"],
      "",
      HotkeyContainer
    );
    let HotkeyButton = CreateHtmlElement(
      "div",
      `${HotkeyObj[key]}Button`,
      ["HotkeyButton", "Child"],
      "",
      ParentContainer
    );
    let KeyLabel = CreateHtmlElement(
      "div",
      `${key}Label`,
      ["KeyLabel", "Child"],
      `${key} hotkey: `,
      ParentContainer
    );
    let Label = CreateHtmlElement(
      "div",
      `${HotkeyObj[key]}Label`,
      ["Label"],
      CurrentHotkey,
      ParentContainer
    );
  }
});
let HotkeyArray = [];

//#region Ev. listener for hotkeys
/**
 * @param {HTMLElement} Item - The item to which the ev.listener should be attached.
 * @param {EventType} EvlType - The event type of the ev.listener(eg. Click, keydown, mouseout)
 * @param {Function} EvlFunction - The function which is being passed to the evl

 */
function AddEvListener(Item, EvlType, EvlFunction) {
  Item.addEventListener(EvlType, EvlFunction);
}
/**
 *@param {HTMLElement} EvTarget - the html element, to which the evlistener is attached
 * @param {EventType}EvlType - The event type of the ev.listener(eg. Click, keydown, mouseout)
 * @param {Function} EvlFunction - The OG function that was passed to the evl which is to be removed
 */
function RemoveEvListener(EvTarget, EvlType, EvlFunction) {
  EvTarget.removeEventListener(EvlType, EvlFunction);
  console.log("EvListener Removed!");
}

// AddEvListener Example usage:
// function Bbb(e) {
//   console.log(e.key);
// }
// AddEvListener("Bbbbbbbbbbbbb", "keydown", window, Bbb);
// RemoveEvListener Example usage:
// RemoveEvListener(window, "keydown", Bbb);

// let HotkeyEventListener = window.addEventListener("keydown", function (e) {
// HotkeyEvListener(e);
// });

function HotkeyEvListener(e, Label) {
  if (
    e.key === "Shift" ||
    e.key === "Control" ||
    e.key === "Alt" ||
    e.key === "Meta"
  ) {
    HotkeyArray[0] = e.key;
  } else {
    HotkeyArray[1] = e.key;
  }
  console.log(HotkeyArray);

  if (HotkeyArray[0] !== undefined && HotkeyArray[1]) {
    let Hotkey = HotkeyArray[1];
    Hotkey = Hotkey.toUpperCase();
    Label.textContent = `${HotkeyArray[0]} + ${Hotkey}`;
  } else if (HotkeyArray[1]) {
    Label.textContent = HotkeyArray[1];
    Label.textContent = Label.textContent.toUpperCase();
  }
}
//#endregion
window.addEventListener("keyup", (e) => {
  HotkeyArray = [];
});
HotkeyContainer.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("HotkeyButton")) {
    e.target.style.border = "2px solid rgba(255, 0, 0, 0.5)";
  }
});
HotkeyContainer.addEventListener("mouseout", (e) => {
  e.target.style.border = "none";
});

HotkeyContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("HotkeyButton")) {
    if (HotkeyEvl) {
      RemoveEvListener(window, "keydown", HotkeyEvl);
    }

    let Label = `${e.target.id}`;
    Label = Label.replace("Button", "Label");
    Label = document.getElementById(Label);
    HotkeyEvl = (event) => HotkeyEvListener(event, Label);

    AddEvListener(window, "keydown", HotkeyEvl);

    let Buttons = document.getElementsByClassName("HotkeyButton");
    for (let i = 0; i < Buttons.length; i++) {
      Buttons[i].classList.remove("Active");
      Buttons[i].style.backgroundColor = "rgb(74, 26, 130)";
    }
    e.target.style.backgroundColor = "rgba(165, 96, 243)";
    e.target.classList.toggle("Active");
  }
});
