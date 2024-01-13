const jimp = require('jimp');
const generateThumbnail = require('../generateThumbnail');

describe('generateThumbnail', () => {
  it('debería generar un thumbnail correctamente', async () => {
    
    // Crea una imagen de prueba (puede ser una imagen dummy)
   // const image = await jimp.create(200, 200);

    // Define las rutas de archivo válidas
    const imagePath = 'public/assets/images/anuncios/iphone.jpg';
    const thumbnailPath = 'public/assets/images/anuncios/iphone_thumbnail.jpg';


    // Llama a la función que genera el thumbnail con las rutas de archivo
    const thumbnail = await generateThumbnail(imagePath, thumbnailPath);

    // Realiza aserciones para verificar que el thumbnail se generó correctamente
    expect(thumbnail).toBeDefined();
    expect(thumbnail instanceof jimp).toBe(true);
    expect(thumbnail.getWidth()).toBe(100);
    expect(thumbnail.getHeight()).toBe(100);
  });
});
