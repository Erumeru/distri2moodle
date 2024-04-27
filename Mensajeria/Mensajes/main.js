const express = require('express');
const app = express();
const amqp = require('amqplib');
const PORT = 3001;
const bodyParser = require('body-parser');

const WebSocket = require('ws');

const rabbitmqUrl = 'amqp://localhost';
const queueName = 'mi_cola';

// Lista de clientes conectados
const clients = new Set();

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Establecer cabeceras para permitir solicitudes CORS desde cualquier origen
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Manejar las solicitudes POST a '/enviar-mensaje'
app.post('/enviar-mensaje', async (req, res) => {
    try {
        // Obtener el mensaje del cuerpo de la solicitud
        const mensaje = req.body.mensaje;
        // Conectar a RabbitMQ
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        // Declarar una cola
        await channel.assertQueue(queueName);
        // Enviar el mensaje a la cola
        await channel.sendToQueue(queueName, Buffer.from(mensaje));
        console.log('Mensaje enviado a la cola:', mensaje);
        // Cerrar la conexión
        await channel.close();
        await connection.close();
        // Responder con un mensaje de éxito
        res.status(200).send('Mensaje enviado correctamente');
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        // Responder con un mensaje de error
        res.status(500).send('Error al enviar mensaje');
    }
});

// Iniciar un servidor WebSocket
const wss = new WebSocket.Server({ port: 3002 });

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
    console.log('Cliente conectado al WebSocket');
    // Agregar cliente a la lista
    clients.add(ws);

    // Manejar desconexiones de clientes
    ws.on('close', () => {
        console.log('Cliente desconectado del WebSocket');
        // Remover cliente de la lista
        clients.delete(ws);
    });
});

// Conectar a RabbitMQ y suscribirse a la cola
async function conectarRabbitMQ() {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    channel.consume(queueName, (mensaje) => {
        // Enviar mensaje a todos los clientes conectados
        const mensajeString = mensaje.content.toString();
        clients.forEach(client => {
            client.send(mensajeString);
        });
        console.log('Mensaje recibido de RabbitMQ:', mensajeString);
    }, { noAck: true });
}

// Iniciar la conexión a RabbitMQ
conectarRabbitMQ().catch(error => console.error('Error al conectar con RabbitMQ:', error));

// Iniciar el servidor HTTP
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});