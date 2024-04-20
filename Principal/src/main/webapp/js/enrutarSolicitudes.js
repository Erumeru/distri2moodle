/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


function hacerSolicitud(url) {
    const xhr = new XMLHttpRequest();
    const urlDestino = 'http://localhost:89' + url;
    xhr.open('GET', urlDestino, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Respuesta del servidor:', xhr.responseText);
            } else {
                console.error('Error al hacer la solicitud:', xhr.statusText);
            }
        }
    };
    xhr.onerror = function() {
        console.error('Error de red al hacer la solicitud');
    };
    xhr.send();
}

function consultarAlumno() {
    hacerSolicitud('/api/otra-api');
}

function consultarCursos() {
    hacerSolicitud('/consultar-cursos');
}

function consultarProfesorCurso() {
    hacerSolicitud('/consultar-profesor-curso');
}

function consultarCalificaciones() {
    hacerSolicitud('/consultar-calificaciones');
}
        