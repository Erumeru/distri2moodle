/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const padres = await buscarPadres();
        const tbody = document.querySelector('table tbody');
        
        // Iterar sobre cada padre en la respuesta
        padres.forEach(padre => {
            // Crear una nueva fila
            const fila = document.createElement('tr');
            
            // Crear celdas para el nombre del padre y el botón de chat
            const celdaNombre = document.createElement('td');
            celdaNombre.textContent = padre.nombre;
            
            const celdaChat = document.createElement('td');
            const botonChat = document.createElement('button');
            botonChat.textContent = 'Chat';
            // Aquí asumo que tienes una función redirigirConUsuario definida en tu código
            botonChat.addEventListener('click', function() {
                redirigirConUsuario(padre.nombre, padre.id); // Suponiendo que padre.id es el ID del padre
            });
            celdaChat.appendChild(botonChat);
            
            // Agregar las celdas a la fila
            fila.appendChild(celdaNombre);
            fila.appendChild(celdaChat);
            
            // Agregar la fila al tbody de la tabla
            tbody.appendChild(fila);
        });
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda de padres
        console.error('Error al cargar padres:', error);
    }
});

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


    
async function buscarPadres() {
    try {
        const respuesta = await hacerSolicitud('/api/obtener-padres-por-maestro?idMaestro='+localStorage.getItem('id'));
        return respuesta;
    } catch (error) {
        console.error('Error al iniciar sesion:', error);
        throw error;
    }
}



function redirigirConUsuario(nombrePadre, idPadre) {
// Redirigir a la página de mensajería con el nombre de usuario como parámetro
    window.location.href = 'mensajeriaPadre.html?padre=' + encodeURIComponent(nombrePadre) + '&col=' + encodeURIComponent(idPadre);
}