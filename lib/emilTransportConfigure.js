const nodemailer = require('nodemailer');

module.exports = async function() {

  // entorno desarrollo
  const testAccount = await nodemailer.createTestAccount();

  const developmetTransport = {
    host: testAccount.smtp.host, //'smtp.ethereal.email',
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
        user: testAccount.user,
        pass: testAccount.pass
    }
  }

  const productionTransport = {
    service: process.env.EMAIL_SERVICE_NAME,
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS,
    }
  }

  console.log('process.env.NODE_ENV', process.env.NODE_ENV);

  // uso la configuración del entorno en el que me encuentro
  const activeTransport = process.env.NODE_ENV === 'development' ?
    developmetTransport :
    productionTransport;

  const transport = nodemailer.createTransport(activeTransport);

  return transport;
}