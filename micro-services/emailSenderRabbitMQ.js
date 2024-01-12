'use strict';

require('dotenv').config();

const amqplib = require('amqplib');
const nodemailer = require('nodemailer');

const QUEUE = 'email-sender';

main().catch(err => console.log('Hubo un error', err));

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  // conectar al broker de RabbitMQ
  const connection = await amqplib.connect(process.env.RABBITMQ_BROKER_URL);
  const transport = await createTransport();

  // crear un canal
  const canal = await connection.createChannel();

  // asegurar que existe la cola para recibir mensajes
  await canal.assertQueue(QUEUE, {
    durable: true, // the queue will survive broker restarts
  });

  canal.prefetch(1); // pending ack's

  canal.consume(QUEUE, async mensaje => {
    const payload = JSON.parse(mensaje.content.toString());

    const result = await transport.sendMail({
      from: process.env.EMAIL_SERVICE_FROM,
      to: payload.to,
      subject: payload.asunto,
      html: payload.cuerpo // text: --> para emails con texto plano
    });
    console.log(`URL de previsualización: ${nodemailer.getTestMessageUrl(result)}`);

    canal.ack(mensaje);
  });

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
