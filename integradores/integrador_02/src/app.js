import express from 'express';
import { engine } from 'express-handlebars';

const app = express();

app.use(express.urlencoded({ extended: true }));

// usa el layout main.hbs que está en src/views/layouts y usá la extensión .hbs
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: './src/views/layouts'
}));
// app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './src/views');

// Esto redirige a tp10
app.get('/', (req, res) => {
    res.redirect('/tp10');
});

app.get('/tp10', (req,res) => {
    res.render('index');
});



// uso de carpetas publicas 
app.use(express.static('public'));

// datos recibidos del form de index
app.post('/tp10/info', (req, res) => {
    const { nombre, edad } = req.body;
    res.render('info', { nombre, edad });
});

export default app;
