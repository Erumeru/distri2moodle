document.addEventListener('DOMContentLoaded', function () {
    var parametros = new URLSearchParams(window.location.search);
    var nombrePadre = parametros.get('padre');
    var col = parametros.get('col');
    col = `${localStorage.getItem('id')}&${col}`;
    document.getElementById('nombrePadre').textContent = `Padre: ${nombrePadre} idDeCola: ${col}`;
    console.log("aqui");
    iniciarWebSocket(col);


    document.getElementById('btnEnviar').addEventListener('click', function (event) {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del botón

        // Llamar a la función enviarMensaje
        enviarMensaje(col);
    });
});

function guardarMensaje(mensaje, cola) {
    // Obtener los mensajes guardados actualmente en el almacenamiento local
    let mensajesGuardados = JSON.parse(localStorage.getItem(cola)) || [];

    mensajesGuardados.push(mensaje);

    localStorage.setItem(cola, JSON.stringify(mensajesGuardados));
}

function cargarMensajesGuardados(cola) {
    let mensajesGuardados = JSON.parse(localStorage.getItem(cola)) || [];
    mensajesGuardados.forEach(mensaje => {
        document.getElementById('mensajes').innerText += mensaje + '\n';
    });
}

async function enviarMensaje(cola) {
    try {
        const mensaje = `Maestro: ${document.getElementById('messageInput').value}`;
        const colaEnviar = cola;
        const response = await fetch('http://localhost:3001/enviar-mensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({mensaje: mensaje, cola: colaEnviar})
        });
        const data = await response.text();
        console.log(data); // Mensaje enviado correctamente
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
    }
}

function iniciarWebSocket(cola) {
    const ws = new WebSocket('ws://localhost:3002');

    ws.onopen = () => {
        console.log('Conexión WebSocket abierta');
        cargarMensajesGuardados(cola);
        ws.send(JSON.stringify({cola: cola}));
    };

    ws.onmessage = (event) => {
        console.log('Mensaje recibido:', event.data);
        document.getElementById('mensajes').innerText += event.data + '\n';
        guardarMensaje(event.data, cola);
    };

    // Manejar errores de conexión WebSocket
    ws.onerror = (error) => {
        console.error('Error en la conexión WebSocket:', error);
        setTimeout(() => iniciarWebSocket(cola), 5000); // Intentar reconectar después de 5 segundos
    };
}
