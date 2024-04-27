
document.getElementById('btnEnviar').addEventListener('click', enviarMensaje);

async function enviarMensaje() {
    try {
        const mensaje = document.getElementById('messageInput').value;
        const colaEnviar =document.getElementById('colaInput').value;
        const response = await fetch('http://localhost:3001/enviar-mensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mensaje: mensaje, cola: colaEnviar })
        });
        const data = await response.text();
        console.log(data); // Mensaje enviado correctamente
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
    }
}

function iniciarWebSocket() {
    const ws = new WebSocket('ws://localhost:3002');

    ws.onopen = () => {
        console.log('Conexión WebSocket abierta');
        const mensaje = document.getElementById('colaRecibirInput').value;

        const cola = mensaje; // Nombre de la cola deseada

        // Enviar el nombre de la cola al servidor
        ws.send(JSON.stringify({cola: cola}));
    };

    ws.onmessage = (event) => {
        console.log('Mensaje recibido:', event.data);
        // Manejar el mensaje recibido del servidor
        document.getElementById('mensajes').innerText += event.data + '\n';
    };
}