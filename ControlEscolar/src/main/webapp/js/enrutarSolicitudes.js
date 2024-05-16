/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

const iframe = document.getElementById('rutaAlerta');
        function hacerSolicitud(url) {
        return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
                const urlDestino = 'http://localhost:89' + url;
                xhr.open('GET', urlDestino, true);
                var token = localStorage.getItem('token');
                if (token !== null && token !== undefined) {
        document.cookie = "token=" + encodeURIComponent(localStorage.getItem('token'));
        }

        xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
        try {
        const jsonRespuesta = JSON.parse(xhr.responseText);
                console.log('Respuesta del servidor:', jsonRespuesta);
                resolve(jsonRespuesta);
        } catch (error) {
        console.error("Error al analizar el json de respuesta", error);
                reject(error);
        }
        } else {
        console.error('Error al hacer la solicitud:', xhr.statusText);
                reject(new Error(xhr.statusText));
        }
        }
        };
                xhr.onerror = function () {
                console.error('Error de red al hacer la solicitud');
                        reject(new Error('Error de red al hacer la solicitud'));
                };
                xhr.send();
        });
                }

function consultarAlumnosPorCurso() {
    hacerSolicitud('/api/entrega-ctrlEscolar').then(function(resultado) {
        // Filtrar los objetos que tienen los atributos cola y mensaje
        const alumnosConMensaje = resultado.filter(alumno => alumno.cola && alumno.mensaje);
        
        // Iterar sobre cada alumno con mensaje
        alumnosConMensaje.forEach(alumno => {
            // Construir la URL con los atributos cola y mensaje del alumno actual
            const url = `http://localhost:3011?col=${alumno.cola}&mensaje=${alumno.mensaje}`;
            
            // Mostrar la URL en la consola
            console.log("URL generada para el alumno:", url);

            // Actualizar el atributo src del iframe con la URL correspondiente
            iframe.src = url;
        });
    });
}



function loop() {
    consultarAlumnosPorCurso();
}

// Establece el intervalo de tiempo en milisegundos (5 segundos = 5000 milisegundos)
const intervalo = 20000;

// Llama a la función miFuncion() cada 5 segundos utilizando setInterval()
setInterval(loop, intervalo);