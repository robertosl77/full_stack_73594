const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  if (!validateForm(form)) {
    return;
  }

  alert("Mensaje enviado");
});

const validateForm = (form) => {
  let valid = true;
  
  let name = form.querySelector(".name");
  let message = form.querySelector(".message");
  let email = form.querySelector(".email");

  if (name.value === "") {
    giveError(name, "El nombre es requerido");
    valid = false;
  }

  if (message.value === "") {
    giveError(message, "El mensaje es requerido");
    valid = false;
  }

  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  let emailValue = email.value;
  if(!emailRegex.test(emailValue)){
    giveError(email, "El email no es válido");
    valid = false;
  }

  if (valid) {
    return true;
  }
};

const giveError = (field, message) => {
  let parentElement = field.parentElement;
  parentElement.classList.add("error");
  let existingError = parentElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }
  let error = document.createElement("span");
  error.textContent = message;
  error.classList.add("error-message");
  parentElement.appendChild(error);
}

const inputs = document.querySelectorAll("input");
const textareas = document.querySelectorAll("textarea");

let allFields = [...inputs, ...textareas];

allFields.forEach((field) => {
  field.addEventListener("input", () => {
    removeError(field);
  });
});

const removeError = (field) => {
  let parentElement = field.parentElement;
  parentElement.classList.remove("error");
  let error = parentElement.querySelector(".error-message");
  if (error) {
    error.remove();
  }
}