/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


function redirigirFormsAlumno() {
    // Obtener los valores del formulario
    var emailPadre = document.getElementById("emailPadre").value;
    var nombrePadre = document.getElementById("nombrePadre").value;
    var passwordPadre = document.getElementById("passwordPadre").value;
        console.log("[assp[adre", passwordPadre, "t");

    // Construir la URL con los datos del formulario como parámetros
    var url = "formularioObtenerHijo.html?" +
            "emailPadre=" + encodeURIComponent(emailPadre) +
            "&nombrePadre=" + encodeURIComponent(nombrePadre) +
            "&passwordPadre=" + encodeURIComponent(passwordPadre);

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
