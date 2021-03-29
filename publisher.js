const amqp = require('amqplib');

const message = {
  id: 0,
};

const data = require('./data.json');
const queueName = process.argv[2] || 'jobsQueue';

connect_Rabbit();

async function connect_Rabbit() {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    // Mesaj gönderme

    data.forEach((index) => {
      message.id = index.id;
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log('Gönderilen mesaj ... ', index.id);
    });

    /*--------
    setInterval(() => {
      message.description = new Date().getTime();
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log('Gönderilen mesaj', message);
    }, 1);
    -------- */
  } catch (error) {
    console.log(error);
  }
}
