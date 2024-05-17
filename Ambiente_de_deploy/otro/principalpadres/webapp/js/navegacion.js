async function redirigirFormsAlumno() {
    // Obtener los valores del formulario
    var emailPadre = document.getElementById("emailPadre").value;
    var nombrePadre = document.getElementById("nombrePadre").value;
    var passwordPadre = document.getElementById("passwordPadre").value;

    // Hashear la contraseña usando SHA-256
    var hashedPassword = await sha256(passwordPadre); // Esperar la resolución de la promesa

    // Construir la URL con los datos del formulario como parámetros
    var url = "formularioObtenerHijo.html?" +
            "emailPadre=" + encodeURIComponent(emailPadre) +
            "&nombrePadre=" + encodeURIComponent(nombrePadre) +
            "&passwordPadre=" + encodeURIComponent(hashedPassword);

    // Cambiar la ubicación del navegador al HTML deseado con los parámetros
    window.location.href = url;
}

// Asociar la función al evento "submit" del formulario
document.getElementById("registroFormPadre").addEventListener("submit", function (event) {
    // Llamar a la función para redirigir
    redirigirFormsAlumno();
    // Prevenir el comportamiento predeterminado del formulario (no enviarlo por POST)
    event.preventDefault();
});

// Función para calcular el hash SHA-256 de una cadena
async function sha256(str) {
    // Convierte la cadena a un ArrayBuffer
    const buffer = new TextEncoder("utf-8").encode(str);
    // Calcula el hash
    const hashArray = await crypto.subtle.digest("SHA-256", buffer);
    // Convierte el ArrayBuffer a una cadena hexadecimal
    return Array.prototype.map.call(new Uint8Array(hashArray), x => ('00' + x.toString(16)).slice(-2)).join('');
}
