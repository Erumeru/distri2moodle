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

async function obtenerEmailPadre() {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "ObtenerEmailDesdeTokenServlet", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    var email = response.email;
                    console.log("Email del usuario:", email);
                    resolve(email); // Resuelve la promesa con el email obtenido
                } else {
                    console.error("Error al obtener el email:", xhr.status);
                    reject(new Error("Error al obtener el email"));
                }
            }
        };

        xhr.send();
    });
}



async function consultarCursos() {
    try {
        const email = await obtenerEmailPadre(); // Obtener el email del padre
        const respuesta = await hacerSolicitud('/api/consultar-cursos-y-profesores?email=' + email);
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

async function insertarCurso(idMaestro, idMoodle, nombreCurso, nombreMaestro) {
    try {
        const respuesta = await hacerSolicitud('/api/insertarDatosCurso?id_maestro=' + idMaestro + '&id_moodle=' + idMoodle + '&nombreCurso=' + nombreCurso + '&nombreMaestro=' + nombreMaestro);
        return respuesta;
    } catch (error) {
        console.error('Error al consultar tareas:', error);
        throw error;
    }
}

async function insertarCursoAlAlumno(alumno_id, curso_id) {
    try {
        const respuesta = await hacerSolicitud('/api/insertarCursoAlAlumno?alumno_id=' + alumno_id + '&curso_id=' + curso_id);
        return respuesta;
    } catch (error) {
        console.error('Error al consultar tareas:', error);
        throw error;
    }
}

// Definir una función async para consultar calificaciones
async function consultarCalificaciones() {
    try {
        const email = await obtenerEmailPadre(); // Obtener el email del padre
        await hacerSolicitud('/api/consultar-calificaciones-curso?email=' + email);
    } catch (error) {
        console.error("Error al consultar calificaciones:", error);
    }
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
        console.log("chigon", resultado);
        resultado['cursos'].forEach(function (elemento) {
            const tareasNombres = [];
            const tareasIds = [];
            console.log("aquyi", elemento);
            elemento.forEach(function (cursosParaSacarID) {
                console.log(cursosParaSacarID['id']);
                var idCurso = cursosParaSacarID['id']; // Declarar idCurso como variable local
                var cursoInfo = {};
                cursoInfo.idMoodle = idCurso;

                // Mover la lógica que depende de cursoInfo dentro de la función then de la promesa
                (function (idCurso) {
                    consultarTareasDeAlumnoEnCurso(idCurso).then(function (resultadoTareas) {
                        console.log(resultadoTareas);
                        console.log(resultadoTareas['courses']);
                        var tareas = resultadoTareas['courses'][0];
                        var nombreCurso = tareas['fullname'];
                        console.log(nombreCurso);
                        cursoInfo.nombreCurso = nombreCurso;
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
                            cursoInfo.idProfe = profe[0]['id'];
                            cursoInfo.nombreMaestro = profe[0]['fullname'];

                            // Persistir el curso aquí dentro de la función then
                            insertarCurso(cursoInfo.idProfe, cursoInfo.idMoodle, cursoInfo.nombreCurso, cursoInfo.nombreMaestro).then(function (cursoPersisted) {
                                console.log("elcursofue", cursoPersisted['cursoId'], "para el alumno: ", resultado['idsAlumnos'][0]);
                                insertarCursoAlAlumno(resultado['idsAlumnosBase'][0], cursoPersisted['cursoId']);
                            });
                        });
                    });
                })(idCurso);

                // No se necesita esta línea aquí
                // idCursoInsertado = insertarCurso(cursoInfo.idProfe, cursoInfo.idMoodle, cursoInfo.nombreCurso, cursoInfo.nombreMaestro);
            });
        });
    });
}


//async function registrarPadre() {
//    try {
//        var form = document.getElementById("registroFormPadre");
//        var formData = new FormData(form);
//        const email = encodeURIComponent(formData.get("email"));
//        const nombre = encodeURIComponent(formData.get("nombre"));
//        const password = encodeURIComponent(formData.get("password"));
//        const url = `/api/persistir-padre?email=${email}&nombre=${nombre}&password=${password}`;
//        // Realizar la solicitud al servidor
//        const respuesta = await hacerSolicitud(url);
//        // Verificar si la respuesta contiene el padre_id
//        if (respuesta.padre_id) {
//// Retornar la respuesta recibida
//            return respuesta;
//        } else {
//// Si la respuesta no contiene el padre_id, lanzar un error
//            throw new Error('La respuesta no contiene el padre_id');
//        }
//    } catch (error) {
//        console.error('Error al registrar padre:', error);
//        throw error;
//    }
//}

async function consultarAlumnoDePadre() {
    try {

//datos alumno
        var formAlumno = document.getElementById("registroFormAlumno");
        var formDataAlumno = new FormData(formAlumno);
        const emailAlumno = encodeURIComponent(formDataAlumno.get("emailAlumno"));
        const nombreAlumno = encodeURIComponent(formDataAlumno.get("nombreAlumno"));
        const apellidosAlumno = encodeURIComponent(formDataAlumno.get("apellidosAlumno"));

        var parametros = new URLSearchParams(window.location.search);
        var emailPadre = parametros.get('emailPadre');
        var nombrePadre = parametros.get('nombrePadre');
        var passwordPadre = parametros.get('passwordPadre');
        console.log("[assp[adre", passwordPadre);

        const url = `/api/consulta-alumno-de-padre?emailPadre=${emailPadre}&nombrePadre=${nombrePadre}&passwordPadre=${passwordPadre}
        &emailAlumno=${emailAlumno}&nombreAlumno=${nombreAlumno}&apellidosAlumno=${apellidosAlumno}`;
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
//        
//        // almacenar el token JWT
//        if (respuesta.token) {
//            // Almacenar el token en localStorage
//            localStorage.setItem('jwtToken', respuesta.token);
//        }


        if (respuesta.idPadre) {
            localStorage.setItem('id', respuesta.idPadre);
            console.log("naca", localStorage.getItem('id'));
        }
        return respuesta;
    } catch (error) {
        console.error('Error al consultar alumno:', error);
        throw error;
    }
}

//
//function solicitarJwtToken(url) {
//    return new Promise((resolve, reject) => {
//        const xhr = new XMLHttpRequest();
//        const urlDestino = 'http://localhost:89' + url;
//        xhr.open('GET', urlDestino, true);
//        xhr.onreadystatechange = function () {
//            if (xhr.readyState === XMLHttpRequest.DONE) {
//                if (xhr.status === 200) {
//                    try {
//                        const jsonRespuesta = JSON.parse(xhr.responseText);
//                        console.log('Respuesta del servidor:', jsonRespuesta);
//                        resolve(jsonRespuesta);
//                    } catch (error) {
//                        console.error("Error al analizar el json de respuesta", error);
//                        reject(error);
//                    }
//                } else {
//                    console.error('Error al hacer la solicitud:', xhr.statusText);
//                    reject(new Error(xhr.statusText));
//                }
//            }
//        };
//        xhr.onerror = function () {
//            console.error('Error de red al hacer la solicitud');
//            reject(new Error('Error de red al hacer la solicitud'));
//        };
//        xhr.send();
//    });
//}





function imprimirIdTarea(idTarea) {
    console.log('ID de la tarea:', idTarea);
}

function redirigirConUsuario(nombreMaestro, idMaestro) {
// Redirigir a la página de mensajería con el nombre de usuario como parámetro
    window.location.href = 'mensajeriaMaestro.html?maestro=' + encodeURIComponent(nombreMaestro) + '&col=' + encodeURIComponent(idMaestro);
}