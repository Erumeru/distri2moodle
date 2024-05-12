
/* global col */


async function obtenerNSetIdPadre() {
    
}
document.addEventListener('DOMContentLoaded', function () {
     var parametros = new URLSearchParams(window.location.search);
    var col = parametros.get('col');
    col = `ctrlEscolar&${localStorage.getItem('idPadre')}`;
    console.log("aqui");
    iniciarWebSocket(col);
    console.log(col);
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

// Llamar a la función cargarMensajesGuardados al iniciar la aplicación



function iniciarWebSocket(cola) {
    const ws = new WebSocket('ws://localhost:3002');

    ws.onopen = () => {
        console.log('Conexión WebSocket abierta');
        cargarMensajesGuardados(cola);
//        const mensaje = document.getElementById('colaRecibirInput').value;
//
//        const cola = mensaje; // Nombre de la cola deseada

        // Enviar el nombre de la cola al servidor
        ws.send(JSON.stringify({cola: cola}));
    };

    ws.onmessage = (event) => {
        console.log('Mensaje recibido:', event.data);
        // Manejar el mensaje recibido del servidor
        document.getElementById('mensajes').innerText += event.data + '\n';
        // Guardar el mensaje en el almacenamiento local
        guardarMensaje(event.data, cola);
    };
}