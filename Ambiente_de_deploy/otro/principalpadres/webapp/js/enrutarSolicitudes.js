

function hacerSolicitud(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const urlDestino = 'http://nginx_apigateway:89' + url;
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

//
//async function consultarAlumno() {
//    try {
//        const respuesta = await hacerSolicitud('/api/otra-api?userId=4&courseId=2');
//        return respuesta;
//    } catch (error) {
//        console.error('Error al consultar alumno:', error);
//        throw error;
//    }
//}

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
        console.log("respuesta desde el m consultarcurso> ", respuesta);
        return respuesta;
    } catch (error) {
        console.error('Error al consultar tareas:', error);
        throw error;
    }
}

//cambie un poquito la funcion solo para que la forma en que cargeun en el html se vea mejor 
//async function consultarCursos() {
//    try {
//        const email = await obtenerEmailPadre(); // Obtener el email del padre
//        const respuesta = await hacerSolicitud('/api/consultar-cursos-y-profesores?email=' + email);
//        console.log("respuesta desde el m consultarcurso> ", respuesta);
//
//        const cursosContainer = document.getElementById('cursos-container');
//        cursosContainer.innerHTML = ''; // Limpiamos el contenedor antes de agregar nuevos elementos
//
//        // Agregar cursos y profesores al contenedor
//        respuesta.cursos.forEach(curso => {
//            const cursoElement = document.createElement('div');
//            cursoElement.classList.add('curso');
//            cursoElement.innerHTML = `
//                <h3>${curso.nombre}</h3>
//                <p>Profesor: ${curso.profesor}</p>
//            `;
//            cursosContainer.appendChild(cursoElement);
//        });
//
//    } catch (error) {
//        console.error('Error al consultar tareas:', error);
//        throw error;
//    }
//}

function obtenerNot() {
    let idpapa = localStorage.getItem('idPadre');
    window.location.href = 'http://mensajeriaservicio:3011?col=ctrlEscolar&' + encodeURIComponent(idpapa);
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
        const response = await hacerSolicitud('/api/consultar-calificaciones-curso?email=' + email);
        return response.data; // Retornar los datos de la respuesta
    } catch (error) {
        console.error("Error al consultar calificaciones:", error);
        throw error; // Relanzar el error para manejarlo fuera de la función
    }
}

// Esta función imprimirá las calificaciones en el HTML
async function imprimirCalificaciones() {
    try {
        // Obtener las calificaciones
        const calificaciones = await consultarCalificaciones();

        // Verificar si las calificaciones están definidas y no están vacías
        if (calificaciones && calificaciones.length > 0) {
            // Obtener la lista donde se imprimirán las calificaciones
            const calificacionesList = document.getElementById('calificaciones-list');

            // Limpiar la lista antes de agregar nuevas calificaciones
            calificacionesList.innerHTML = '';

            // Recorrer el array de calificaciones y agregar elementos a la lista
            calificaciones.forEach(calificacion => {
                const listItem = document.createElement('li');
                listItem.textContent = `Alumno ID: ${calificacion.alumnoId}, Curso ID: ${calificacion.cursoId}, Contribución Total: ${calificacion.contibucionTotal}`;
                calificacionesList.appendChild(listItem);
            });
        } else {
            console.log('No se encontraron calificaciones.');
        }

    } catch (error) {
        console.error("Error al imprimir calificaciones:", error);
        // Puedes manejar el error de acuerdo a tus necesidades
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
        resultado['idsAlumnos'].forEach(function (idDelAlumno) {
            const mapa = new Map(Object.entries(resultado['mapajson']));
            console.log(mapa);
            const mapaDeCursos = resultado['mapajson'];
            console.log("mapacursos", mapaDeCursos);
            var cursosDeEsteAlumno = mapaDeCursos[idDelAlumno];
            console.log("LOS CURSOS SON:", cursosDeEsteAlumno);
            cursosDeEsteAlumno.forEach(function (cursosParaSacarID) {
                const tareasNombres = [];
                const tareasIds = [];
                console.log("aquyi", cursosParaSacarID);
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
                        var tareasDelCurso = tareas['assignments'];
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

                            tareasDelCurso.forEach(function (assignments) {
                                if (assignments['name'].startsWith("avalar")) {
                                    var filaTarea = document.createElement('tr');
                                    var nomCurso = document.createElement('td');
                                    nomCurso.textContent = nombreCurso;
                                    filaTarea.appendChild(nomCurso);
                                    var nomTarea = document.createElement('td');
                                    nomTarea.textContent = assignments['name'];
                                    filaTarea.appendChild(nomTarea);

                                    var cursoId = document.createElement('td');
                                    cursoId.textContent = idCurso;
                                    filaTarea.appendChild(cursoId);

                                    var idTarea = document.createElement('td');
                                    idTarea.textContent = assignments['id'];
                                    filaTarea.appendChild(idTarea);

                                    //Id del maestro encargado a la tarea
                                    filaTarea.appendChild(idProfe);

                                    var idDelAlumnoColumna = document.createElement('td');
                                    idDelAlumnoColumna.textContent = idDelAlumno;
                                    filaTarea.appendChild(idDelAlumnoColumna);

                                    var btnAvalar = document.createElement('button');
                                    btnAvalar.textContent = 'Avalar Tarea';
                                    btnAvalar.addEventListener('click', function () {
                                       // console.log("AQUI SE DEBE MANDAR UN MENSAJE PARA AVALAR TAREA");
                                         redirigirConUsuario(profe[0]['fullname'], profe[0]['id']);
                                    });
                                    filaTarea.appendChild(btnAvalar);

                                    tbody.appendChild(filaTarea);
                                }
                            });

                            // Persistir el curso aquí dentro de la función then
                            insertarCurso(cursoInfo.idProfe, cursoInfo.idMoodle, cursoInfo.nombreCurso, cursoInfo.nombreMaestro);
                            console.log("elcursofue", cursoInfo.idMoodle, "para el alumno: ", resultado['idsAlumnos'][0]);

                            insertarCursoAlAlumno(idDelAlumno, cursoInfo.idMoodle);
                        });
                    });
                })(idCurso);


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
    let idpapa = localStorage.getItem('idPadre');
    window.location.href = 'http://mensajeriaservicio:3010?col=' + encodeURIComponent(idMaestro) + encodeURIComponent(idpapa)+ '&rem=' + encodeURIComponent(nombreMaestro);
}

function redirigirConUsuarioAvalar(nombreMaestro, idMaestro) {
// Redirigir a la página de mensajería con el nombre de usuario como parámetro
    let idpapa = localStorage.getItem('idPadre');
    window.location.href = 'http://mensajeriaservicio:3010?col=' + encodeURIComponent(idMaestro) + encodeURIComponent(idpapa)+ '&mensaje=' +"Confirmo de avalada la tarea de mi hijo";
}