const multer = require('multer');
const path = require('path');
const cote = require('cote');

const uploadPath = './uploads';

// Declaro una configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    const ruta = path.join(__dirname, '..', 'public', 'avatares');
    callback(null, ruta);
  },
  filename: function(req, file, callback) {
    const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});

// Declaro una configuración de upload
const upload = multer({ storage });

const thumbnailRequester = new cote.Requester({ name: 'thumbnail-requester' });

module.exports = {
  upload,
  sendToThumbnailService: (imagePath) => {
    // Enviar la ruta al servicio de creación de thumbnails en segundo plano
    thumbnailRequester.send({ type: 'generateThumbnail', imagePath });
  }
};
