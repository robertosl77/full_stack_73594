const f = document.createDocumentFragment();
const names = ["susana", "andrea", "lorena"]; // Corregido el formato de las comillas
names.forEach(n => f.innerHTML += `<div>${n}</div>`); // Esta línea sigue sin funcionar correctamente
document.getElementById('app').appendChild(f);
