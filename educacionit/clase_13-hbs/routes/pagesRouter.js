
// Importamos express router
const router = require('express').Router(); // importamos express router


router.get('/', (req, res) => { // creamos una ruta para la página de inicio
    res.render('index'); // renderizamos la vista index.hbs
}); 

router.get('/alta', (req, res) => { // creamos una ruta para la página de alta
    res.render('alta'); // renderizamos la vista alta.hbs
}); // cerramos la ruta de alta

router.get('/contacto', (req, res) => { // creamos una ruta para la página de contacto
    res.render('contacto'); // renderizamos la vista contacto.hbs
});

router.get('/nosotros', (req, res) => { // creamos una ruta para la página de nosotros
    res.render('nosotros'); // renderizamos la vista nosotros.hbs
});

module.exports = router; // exportamos el router para usarlo en otros archivos