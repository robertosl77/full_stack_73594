const http = require('http');
const fs = require('fs');
const path = require('path');

// Crear un servidor HTTP
const server = http.createServer((req, res) => {

  let ruta = req.url;
  let filePath;
  console.log(ruta);

  // Si la ruta incluye un archivo real (como error.html), servirlo directo
  const nombreArchivo = ruta.split('?')[0]; // elimina el query string
  const rutaArchivo = path.join(__dirname, 'public', nombreArchivo);

  switch (ruta) {
    case '/':
    case '/index':
    case '/index.html':
      filePath = path.join(__dirname, 'public', 'index.html');
      fs.readFile(filePath, (err, data) => {
          if (err) {
              res.writeHead(500);
              res.end("Error al leer index.html");
          } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(data);
          }
      });
      break;

    case '/about':
    case '/about.html':
      filePath = path.join(__dirname, 'public', 'about.html');
      fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end("Error al leer about.html");
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
      });
      break;

    case '/contact':
    case '/contact.html':
      filePath = path.join(__dirname, 'public', 'contact.html');
      fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end("Error al leer contact.html");
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
      });
      break;    

    case '/forbidden':
      res.writeHead(302, { 'Location': '/error.html?code=403' });
      res.end();
      break;
    
    case '/crasheo':
      res.writeHead(302, { 'Location': '/error.html?code=500' });
      res.end();
      break;
    
    case '/teapot':
      res.writeHead(302, { 'Location': '/error.html?code=418' });
      res.end();
      break;
      

    default:
      // Verifica si el archivo existe y es un archivo real
      if (fs.existsSync(rutaArchivo)) {
        fs.readFile(rutaArchivo, (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end("Error al leer el archivo.");
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
          }
        });
        return; // salta el resto del código
      }

      res.writeHead(302, { 'Location': `/error.html?code=404` });
      res.end();
        break;
  }

});







const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
