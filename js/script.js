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

const padMessageWithSpaces = (message, size) => {
  const paddingNeeded = size - (message.length % size);
  return message + " ".repeat(paddingNeeded === size ? 0 : paddingNeeded);
}

const binaryToAscii = (bin) => bin.match(new RegExp(".{1,8}", "g")).map((bin) => String.fromCharCode(parseInt(bin, 2))).join("");

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
    outputField.value = "Make sure to enter everything correctly!";
    return;
  }

  let messageField = document.querySelector("#des-message");
  let keyField = document.querySelector("#des-key");
  let decryptField = document.querySelector("#des-toggle");

  let output = des(
    stringToBinary(padMessageWithSpaces(messageField.value, 8)),
    bin(keyField.value),
    decryptField.checked
  );
  outputField.value = binaryToAscii(output);
};

const generateRandomRSAKey = async (button) => {
  button.setAttribute("aria-busy", "true");
  await new Promise(resolve => setTimeout(resolve, 500));

  let key = getGenerationObject(1024)
  let pField = document.querySelector("#rsa-p");
  let qField = document.querySelector("#rsa-q");
  pField.value = key.p;
  qField.value = key.q;

  button.setAttribute("aria-busy", "false");
  pField.dispatchEvent(new Event("input", { bubbles: true }));

}

const rsaForm = (form) => {
  let outputField = document.querySelector("#rsa-output");
  let publicField = document.querySelector("#rsa-public");
  let privateField = document.querySelector("#rsa-private");
  let expField = document.querySelector("#rsa-exp")
  if (!form.checkValidity()) {
    outputField.value = "Make sure to enter everything correctly!";
    return;
  }

  let messageField = document.querySelector("#rsa-message");
  let decryptToggle = document.querySelector("#rsa-toggle")
  let pField = document.querySelector("#rsa-p");
  let qField = document.querySelector("#rsa-q");

  let generation = generate(bigInt(pField.value), bigInt(qField.value));
  let output = rsa(messageField.value, generation.n, generation.d, generation.e, decryptToggle.checked)

  publicField.value = generation.n;
  privateField.value = generation.d;
  expField.value = generation.e;
  outputField.value = output
};