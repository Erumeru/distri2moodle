document.addEventListener('DOMContentLoaded', function () {
    var parametros = new URLSearchParams(window.location.search);
    var nombreMaestro = parametros.get('maestro');
    var col = parametros.get('col');
    col = `${col}&${localStorage.getItem('idPadre')}`;
    document.getElementById('nombreMaestro').textContent = `Maestro: ${nombreMaestro} idDeCola: ${col}`;
    console.log("aqui");
    iniciarWebSocket(col);

    document.getElementById('btnEnviar').addEventListener('click', function (event) {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del botón
        // Llamar a la función enviarMensaje
        enviarMensaje(col);
    });
});
    

async function enviarMensaje(cola) {
        // Usar el servicio para enviar el mensaje
        const response = await fetch('http://localhost:3010/enviar-mensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mensaje: mensaje, cola: colaEnviar })
        });
        const data = await response.text();
        console.log(data); // Mensaje enviado correctamente
   
    }