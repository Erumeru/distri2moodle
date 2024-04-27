const ws = new WebSocket('ws://localhost:3002');

ws.onopen = () => {
    console.log('Conexión WebSocket abierta');
};

ws.onmessage = (event) => {
    console.log('Mensaje recibido:', event.data);
    // Manejar el mensaje recibido del servidor
    document.getElementById('mensajes').innerText += event.data + '\n';
};


document.getElementById('btnEnviar').addEventListener('click', enviarMensaje);

// Función para enviar mensajes (productor)
async function enviarMensaje() {
    try {
        const mensaje = document.getElementById('messageInput').value;
        const response = await fetch('http://localhost:3001/enviar-mensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({mensaje: mensaje})
        });
        const data = await response.text();
        console.log(data); // Mensaje enviado correctamente
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
    }
}
