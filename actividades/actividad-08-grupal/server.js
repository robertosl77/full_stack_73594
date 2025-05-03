const http = require('http');
const fs = require('fs');
const path = require('path');

function manejaPaginas(pagina, res, codigo = 200) {
  const filePath = path.join(__dirname, 'public', pagina);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(302, { 'Location': '/error.html?code=500' });
      res.end();
    } else {
      // console.log(`Leyendo ${codigo} ${filePath}`);
      res.writeHead(codigo, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
}

// Crear un servidor HTTP
const server = http.createServer((req, res) => {

  // obtengo la ruta solicitada, ej "/index.html"
  let ruta = req.url;

  switch (ruta) {
    case '/':
    case '/index':
    case '/index.html':
      manejaPaginas('index.html', res);
      break;

    case '/about':
    case '/about.html':
      manejaPaginas('about.html', res);
      break;

    case '/contact':
    case '/contact.html':
      manejaPaginas('contact.html', res);
      break;    

    case '/forbidden':
      res.writeHead(302, { 'Location': '/error.html?code=403' });
      res.end();
      break;
      
    case '/teapot':
      res.writeHead(302, { 'Location': '/error.html?code=418' });
      res.end();
      break;
        
    case '/crasheo':
      res.writeHead(302, { 'Location': '/error.html?code=500' });
      res.end();
      break;
      

    default:
      /**
       * Analizaremos: 
       *  - rutas no analizadas por el switch (ej: /pagina.html)
       *  - rutas con parametros (ej: /index.html?parametro=valor)
       *  - rutas con errores (ej: /pagina.html?error=404)
       */
      
      // busca si el archivo existe en el directorio, la separacion del ? y al tomar el primer indice [0], hace que tome la pagina real sin parametros
      const nombreArchivo = ruta.split('?')[0];
      // construye la ruta al archivo, simulando que el archivo exista (eso se verifica despues)
      const rutaArchivo = path.join(__dirname, 'public', nombreArchivo);      
      // verifica si el archivo existe
      if (fs.existsSync(rutaArchivo)) {
        // si existe el archivo, lo lee y lo devuelve
        fs.readFile(rutaArchivo, (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end("Error al leer el archivo.");
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
          }
        });
        return;
      } else {
        // si no existe el archivo, redirecciona (302) al navegador a la pagina de error.html con el codigo 404
        res.writeHead(302, { 'Location': `/error.html?code=404` });
        res.end();
      }
      break;
  }

});







const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err.message);
});
