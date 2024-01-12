const amqplib = require('amqplib');

// conectar al broker de RabbitMQ
const canalPromise = amqplib.connect(process.env.RABBITMQ_BROKER_URL)
  .then(connection => {
    // crear un canal
    return connection.createChannel();
  })

module.exports = canalPromise;