'use strict';


const cote = require('cote');
const jimp = require('jimp');

const responder = new cote.Responder({ name: 'thumbnail-service' });

responder.on('generateThumbnail', async (req, done) => {
  const { imagePath, thumbnailPath } = req;

  try {
    const image = await jimp.read(imagePath);
    image.resize(100, 100).write(thumbnailPath);

    done(null, thumbnailPath);
  } catch (error) {
    console.error(error);
    done(error);
  }
});
