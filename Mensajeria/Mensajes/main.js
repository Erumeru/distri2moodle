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
        // Obtener el mensaje y el nombre de la cola del cuerpo de la solicitud
        const mensaje = req.body.mensaje;
        const cola = req.body.cola;

        // Conectar a RabbitMQ
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        
        // Declarar la cola especificada por el cliente
        await channel.assertQueue(cola);

        // Enviar el mensaje a la cola especificada
        await channel.sendToQueue(cola, Buffer.from(mensaje));

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

    // Manejar mensajes del cliente
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            const cola = data.cola;

            // Suscribirse a la cola especificada por el cliente y enviar mensajes al cliente
            async function recibirMensajesRabbitMQ(cola) {
                const connection = await amqp.connect(rabbitmqUrl);
                const channel = await connection.createChannel();
                await channel.assertQueue(cola);
                channel.consume(cola, (mensaje) => {
                    ws.send(mensaje.content.toString());
                    console.log('Mensaje recibido de RabbitMQ:', mensaje.content.toString());
                }, { noAck: true });
            }

            recibirMensajesRabbitMQ(cola).catch(error => console.error('Error al recibir mensajes de RabbitMQ:', error));
        } catch (error) {
            console.error('Error al procesar mensaje del cliente:', error);
        }
    });
});

// Conectar a RabbitMQ y suscribirse a la cola
async function conectarRabbitMQ() {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);

        // Manejar errores de conexión a RabbitMQ
        connection.on('error', (error) => {
            console.error('Error en la conexión a RabbitMQ:', error);
            setTimeout(conectarRabbitMQ, 5000); // Intentar reconectar después de 5 segundos
        });

        channel.consume(queueName, (mensaje) => {
            if (mensaje) {
                // Enviar mensaje a todos los clientes conectados
                const mensajeString = mensaje.content.toString();
                clients.forEach(client => {
                    client.send(mensajeString);
                });
                console.log('Mensaje recibido de RabbitMQ:', mensajeString);
            }
        }, { noAck: true });
    } catch (error) {
        console.error('Error al conectar con RabbitMQ:', error);
        setTimeout(conectarRabbitMQ, 5000); // Intentar reconectar después de 5 segundos
    }
}

conectarRabbitMQ();
// Iniciar el servidor HTTP
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});