const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  if (!validateForm(form)) {
    return;
  }

  alert("Alta de Producto Exitosa");
});

const validateForm = (form) => {
  let valid = true;
  
  let product_name = form.querySelector(".product_name");
  let product_price = form.querySelector(".product_price");
  let product_stock = form.querySelector(".product_stock");
  let product_brand = form.querySelector(".product_brand");
  let product_category = form.querySelector(".product_category");
  let product_short_description = form.querySelector(".product_short_description");
  let product_long_description = form.querySelector(".product_long_description");
  let product_fee = form.querySelector(".product_fee");
  let product_age_from = form.querySelector(".product_age_from");
  let product_age_to = form.querySelector(".product_age_to");

  if (product_name.value === "") {
    giveError(product_name, "El nombre del artículo es requerido");
    valid = false;
  }

  if (product_price.value === "") {
    giveError(product_price, "El precio del artículo es requerido");
    valid = false;
  }

  if (product_stock.value === "") {
    giveError(product_stock, "El stock del artículo es requerido");
    valid = false;
  }

  if (product_brand.value === "") {
    giveError(product_brand, "La marca del artículo es requerida");
    valid = false;
  }

  if (product_category.value === "") {
    giveError(product_category, "La categoría del artículo es requerida");
    valid = false;
  }

  if (product_short_description.value === "") {
    giveError(product_short_description, "La descripción corta del artículo es requerida");
    valid = false;
  }

  if (product_long_description.value === "") {
    giveError(product_long_description, "La descripción larga del artículo es requerida");
    valid = false;
  }

  if (product_fee.value === "") {
    giveError(product_fee, "El cargo del artículo es requerido");
    valid = false;
  }

  if (product_age_from.value === "") {
    giveError(product_age_from, "La edad desde del artículo es requerida");
    valid = false;
  }

  if (product_age_to.value === "") {
    giveError(product_age_to, "La edad hasta del artículo es requerida");
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