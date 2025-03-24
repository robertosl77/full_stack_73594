window.onload = function () {
    // selecciono todos los infos y legend
    const infoDivs = document.querySelectorAll('.info'); 
    const legends = document.querySelectorAll('legend'); 

    for (let i = 0; i < infoDivs.length; i++) {
        // recorro el listado de divs info
        infoDivs[i].addEventListener('click', (e) => {
            // recorro todos los infos (misma cant que legend) y elimino las clases
            for (let j = 0; j < infoDivs.length; j++) { 
                infoDivs[j].classList.remove('selected-info')
                legends[j].classList.remove('selected-legend')
            }
            // agrego las clases sobre el info y legend en el que hice click
            infoDivs[i].classList.add('selected-info')
            legends[i].classList.add('selected-legend')
        });
    }

    
};