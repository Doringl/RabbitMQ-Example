const amqp = require('amqplib');

const queueName = process.argv[2] || 'jobsQueue';

const data = require('./data.json');

connect_Rabbit();

async function connect_Rabbit() {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    // Mesaj alma
    console.log('Mesaj bekleniyor ...');
    channel.consume(queueName, (message) => {
      const messageInfo = JSON.parse(message.content.toString());
      const userInfo = data.find((user) => user.id == messageInfo.id);
      if (userInfo) {
        console.log('Mesaj alındı .', userInfo);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
