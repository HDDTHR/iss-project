import { bin, des, padMessageWithSpaces, asciiToBinary } from "./asymmetric.js";

window.onload = () => {
  let tabs = document.querySelectorAll('input[name="tab-selector"]');
  tabs.forEach((input) => {
    if (input.checked) showContent(input);
  });

  const inputs = document.querySelectorAll("form input");
  inputs.forEach((input) => {
    input.oninput = () => {
      if (input.checkValidity()) {
        input.removeAttribute("aria-invalid");
      } else {
        input.setAttribute("aria-invalid", "true");
      }
    };
  });

  let desF = document.querySelector("#des-form");
  desForm(desF);
};

const showContent = (radio) => {
  let allContent = document.querySelectorAll("section");
  allContent.forEach(function (content) {
    if (content.id === radio.value + "-content") {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });
};

const generateRandomDESKey = () => {
  let result = [...Array(16)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
  let keyField = document.querySelector("#des-key");
  keyField.value = result;
  keyField.dispatchEvent(new Event("input", { bubbles: true }));
};

const desForm = (form) => {
  let outputField = document.querySelector("#des-output");
  if (!form.checkValidity()) {
    outputField.value = "Make sure the key is valid!";
    return;
  }

  let messageField = document.querySelector("#des-message");
  let keyField = document.querySelector("#des-key");
  let decryptField = document.querySelector("#des-toggle");

  outputField.value = des(
    padMessageWithSpaces(asciiToBinary(messageField.value)),
    bin(keyField.value),
    decryptField.checked
  );
};
