/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


function hacerSolicitud(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const urlDestino = 'http://localhost:89' + url;
        xhr.open('GET', urlDestino, true);
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

async function consultarAlumno() {
    try {
        const respuesta = await hacerSolicitud('/api/otra-api?userId=4&courseId=2');
        return respuesta;
    } catch (error) {
        console.error('Error al consultar alumno:', error);
        throw error;
    }
}

async function consultarTareasDeAlumnoEnCurso(courseId) {
    try {
        const respuesta = await hacerSolicitud('/api/consultar-tareas-alumno-curso?courseId=' + courseId);
        return respuesta;
    } catch (error) {
        console.error('Error al consultar tareas:', error);
        throw error;
    }
}

async function consultarCursos() {
    try {
        const respuesta = await hacerSolicitud('/api/consultar-cursos?userId=2');
        return respuesta;
    } catch (error) {
        console.error('Error al consultar tareas:', error);
        throw error;

    }
}

async function consultarProfesorCurso(courseId) {
    try {
        const respuesta = await hacerSolicitud('/api/consultar-profesor-curso?courseId=' + courseId);
        return respuesta;
    } catch (error) {
        console.error('Error al consultar tareas:', error);
        throw error;

    }
}

function consultarCalificaciones() {
    hacerSolicitud('/api/consultar-calificaciones-curso?courseId=2&userId=4');
}

//esto es para control escolar 
function maestroConCalificar() {
    fetch('/api/obtener-maestro-calificaciones');
}

function mestroSinCalificar() {
    fetch('/api/obtener-maestros-sin-calificacion');
}


function promedioAlum() {
    fetch('/api/obtener-promedio-alumno');
}


function consultarCusosAlumnoYCargarAsignaciones() {
    var tbody = document.getElementById('bodyCursos');
    var tbodyProfe = document.getElementById('bodyProfes');

    let cursos = [];
    let profesores = [];
    consultarCursos().then(function (resultado) {
        resultado.forEach(function (elemento) {
            const tareasNombres = [];
            const tareasIds = [];
            var idCurso = elemento['id']; // Declarar idCurso como variable local
            console.log(idCurso);

            // Utilizar una función de cierre para capturar el valor correcto de idCurso
            (function (idCurso) {
                consultarTareasDeAlumnoEnCurso(idCurso).then(function (resultadoTareas) {
                    console.log(resultadoTareas['courses']);
                    var tareas = resultadoTareas['courses'][0];
                    var nombreCurso = tareas['fullname'];
                    console.log(nombreCurso);
                    profesorCurso = consultarProfesorCurso(idCurso).then(function (profe) {
                        var fila = document.createElement('tr');

                        var nombreProfe = document.createElement('td');
                        nombreProfe.textContent = profe[0]['fullname'];
                        fila.appendChild(nombreProfe);


                        var idProfe = document.createElement('td');
                        idProfe.textContent = profe[0]['id'];
                        fila.appendChild(idProfe);


                        var boton = document.createElement('button');
                        boton.textContent = 'Ir a chat';
                        boton.addEventListener('click', function () {
                            redirigirConUsuario(profe[0]['fullname'], profe[0]['id']);
                        });
                        fila.appendChild(boton);

                        tbodyProfe.appendChild(fila);
                    });

                    arregloTareas = tareas['assignments'].forEach(function (assign) {
                        console.log(assign['id']);
                        console.log(assign['name']);

                        var idTarea = assign['id'];
                        var nombreTarea = assign['name'];
                        tareasIds.push(idTarea);
                        tareasNombres.push(nombreTarea);
                    });

                    console.log(tareasIds);
                    var i = 0;
                    tareasNombres.forEach(function (tareaNom) {
                        var fila = document.createElement('tr');

                        var nombreCursoFila = document.createElement('td');
                        nombreCursoFila.textContent = nombreCurso;
                        fila.appendChild(nombreCursoFila);

                        var nomTarea = document.createElement('td');
                        nomTarea.textContent = tareaNom;
                        fila.appendChild(nomTarea);

                        var idCursoFila = document.createElement('td');
                        idCursoFila.textContent = idCurso;
                        fila.appendChild(idCursoFila);

                        var tareaIdFila = document.createElement('td');
                        tareaIdFila.textContent = tareasIds[i];
                        fila.appendChild(tareaIdFila);

                        var boton = document.createElement('button');
                        boton.textContent = 'Avalar Tarea';
                        boton.addEventListener('click', function () {
                            console.log(tareaIdFila.textContent);
                        });

                        fila.appendChild(boton);

                        tbody.appendChild(fila);
                        i++;
                    });
                });
            })(idCurso);
        });
    });
}


async function registrarPadre() {
    try {
        var form = document.getElementById("registroFormPadre");
        var formData = new FormData(form);
        const email = encodeURIComponent(formData.get("email"));
        const nombre = encodeURIComponent(formData.get("nombre"));
        const password = encodeURIComponent(formData.get("password"));
        const url = `/api/persistir-padre?email=${email}&nombre=${nombre}&password=${password}`;

        // Realizar la solicitud al servidor
        const respuesta = await hacerSolicitud(url);

        // Verificar si la respuesta contiene el padre_id
        if (respuesta.padre_id) {
            // Retornar la respuesta recibida
            return respuesta;
        } else {
            // Si la respuesta no contiene el padre_id, lanzar un error
            throw new Error('La respuesta no contiene el padre_id');
        }
    } catch (error) {
        console.error('Error al registrar padre:', error);
        throw error;
    }
}

async function consultarAlumnoDePadre() {
    try {
        var form = document.getElementById("registroFormAlumno");
        var formData = new FormData(form);
        const email = encodeURIComponent(formData.get("email"));
        const nombre = encodeURIComponent(formData.get("nombre"));
        const apellidos = encodeURIComponent(formData.get("apellidos"));
        const url = `/api/consulta-alumno-de-padre?email=${email}&nombre=${nombre}&apellidos=${apellidos}`;
        const respuesta = await hacerSolicitud(url);
        return respuesta;
    } catch (error) {
        console.error('Error al consultar alumno:', error);
        throw error;
    }
}

async function loginPadre() {
    try {
        var form = document.getElementById("loginForm");
        var formData = new FormData(form);
        const email = encodeURIComponent(formData.get("email"));
        const password = encodeURIComponent(formData.get("password"));
        const url = `/api/iniciarSesion-Padre?email=${email}&password=${password}`;
        const respuesta = await hacerSolicitud(url);
        return respuesta;
    } catch (error) {
        console.error('Error al consultar alumno:', error);
        throw error;
    }
}


function imprimirIdTarea(idTarea) {
    console.log('ID de la tarea:', idTarea);
}

function redirigirConUsuario(nombreMaestro, idMaestro) {
    // Redirigir a la página de mensajería con el nombre de usuario como parámetro
    window.location.href = 'mensajeriaMaestro.html?maestro=' + encodeURIComponent(nombreMaestro) + '&col=' + encodeURIComponent(idMaestro);
}