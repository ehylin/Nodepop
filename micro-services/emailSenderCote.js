'use strict';

const { Responder } = require('cote');
const nodemailer = require('nodemailer');

main().catch(err => console.log('Hubo un error', err));

async function main() {
  try {

    const transport = await createTransport();
    const responder = new Responder({ name: 'servicio de email' });

    responder.on('enviar-email', async (req, done) => {
      try {

        const { from, to, subject, html } = req;

        const result = await transport.sendMail({ from, to, subject, html });
        console.log(`Email enviado. URL: ${nodemailer.getTestMessageUrl(result)}`);

        done(result);
      } catch (error) {
        console.log(error)
        done({ message: err.message });
      }
    })

  } catch (error) {
    console.log('error')
    done({ message: err.message });
  }

}

async function createTransport() {
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

  return nodemailer.createTransport(developmetTransport);
}
