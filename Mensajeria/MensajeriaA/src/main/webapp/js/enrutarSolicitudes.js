/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


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

async function loginMaestro() {
    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const respuesta = await hacerSolicitud('/api/iniciarSesion-maestro?username=' + username + '&password=' + password);
        console.log(respuesta);
        if (respuesta.token) {
            localStorage.setItem('token', respuesta['token']);
            const maestro = await hacerSolicitud('/api/consultar-user-por-usuario?username=' + username);
            localStorage.setItem('id', maestro['users'][0]['id']);
            console.log(respuesta['token']);
            localStorage.setItem('token', respuesta['token']);
            window.location.href = 'chatsMaestro.html';
        }
        return respuesta;
    } catch (error) {
        console.error('Error al iniciar sesion:', error);
        throw error;
    }
}

async function buscarPadres() {
    try {
        const respuesta = await hacerSolicitud('/api/obtener-padres-por-maestro?idMaestro='+localStorage.getItem('id'));
        console.log(respuesta);
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