const amqp = require('amqplib');

async function recibirMensajesRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const cola = 'cola_cliente_1'; // Nombre de la cola para esta aplicación
        await channel.assertQueue(cola);
        channel.consume(cola, async (mensaje) => {
            console.log('Mensaje recibido de RabbitMQ en Cliente 1:', mensaje.content.toString());
        }, { noAck: true });
    } catch (error) {
        console.error('Error al recibir mensajes de RabbitMQ en Cliente 1:', error);
    }
}

async function enviarMensajeRabbitMQ(mensaje, destinatario) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(destinatario);
        await channel.sendToQueue(destinatario, Buffer.from(mensaje));
        console.log('Mensaje enviado a RabbitMQ desde Cliente 1:', mensaje);
    } catch (error) {
        console.error('Error al enviar mensaje a RabbitMQ desde Cliente 1:', error);
    }
}

// Ejemplo de uso
recibirMensajesRabbitMQ();
enviarMensajeRabbitMQ('Hola desde Cliente 1', 'cola_cliente_1');
