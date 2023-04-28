const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");
const closeButton = document.querySelector("#close-message");
const fade = document.querySelector("#fa-de");
const message = document.querySelector("#message");
const messageText = document.querySelector("#message p");
const messageIcon = document.querySelector("img");

cepInput.addEventListener("keypress", (e) => {
  const onlyNumbers = /[0-9]/;
  const key = String.fromCharCode(e.keyCode);

  if (!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
});

cepInput.addEventListener("keyup", (e) => {
  const valueInput = e.target.value;

  if (valueInput.length === 8) {
    getAddress(valueInput);
  }
});

const getAddress = async (cep) => {
  toggleLoader();

  cepInput.blur();

  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const response = await fetch(url);

  const data = await response.json();

  if (data.erro === "true" || data.logradouro === undefined) {
    if (!addressInput.hasAttribute("disabled")) {
      toggleDisabled();
    }
    addressForm.reset();
    toggleLoader();
    toggleMessage("Digite um CEP válido!");
    messageText.style.color = "red";
    messageIcon.src = "./img/alert.png";
    messageIcon.appendChild(message);
    return;
  }

  if (addressInput.value === "") {
    toggleDisabled();
  }

  addressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;

  toggleLoader();
};

const toggleDisabled = () => {
  if (regionInput.hasAttribute("disabled")) {
    formInputs.forEach((input) => {
      input.removeAttribute("disabled");
    });
  } else {
    formInputs.forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
  }
};

const toggleLoader = () => {
  const loader = document.querySelector("#loader");

  fade.classList.toggle("hide");
  loader.classList.toggle("hide");
};

const toggleMessage = (msg) => {
  messageText.innerHTML = msg;
  fade.classList.toggle("hide");
  message.classList.toggle("hide");
};

const iconMessage = (icon) => {
  messageIcon.innerHTML = icon;
};

closeButton.addEventListener("click", () => toggleMessage());

addressForm.addEventListener("submit", (e) => {
  e.preventDefault();
  toggleLoader();
  setTimeout(() => {
    toggleLoader();
    toggleMessage("endereço salvo com sucesso!");
    messageText.style.color = "green";
    messageIcon.src = "./img/sucess.png";
    messageIcon.appendChild(message);

    addressForm.reset();
    toggleDisabled();
  }, 1500);
});
