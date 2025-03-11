const f = document.createDocumentFragment();
const names = ['susana', 'andrea', 'lorena'];

names.forEach(n => {
    const div = document.createElement("div");
    div.textContent = n;
    f.appendChild(div);
});

document.getElementById('app').appendChild(f);
