// src/middleware/multerImagen.js
import multer from 'multer';

const upload = multer({ 
  dest: 'public/img_temp',
  fileFilter: (req, file, cb) => {
    const tiposValidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (tiposValidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, png, webp)'));
    }
  }
});

export default upload;
