'use strict';

const jimp = require('jimp');


async function generateThumbnail(imagePath, thumbnailPath) {
    try {
      if (typeof imagePath !== 'string' || typeof thumbnailPath !== 'string') {
        throw new Error('Las rutas deben ser cadenas de texto válidas');
      }
  
      const thumbnail = await jimp.read(imagePath);
      thumbnail.resize(100, 100).write(thumbnailPath);
  
      return thumbnailPath;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  module.exports = generateThumbnail;