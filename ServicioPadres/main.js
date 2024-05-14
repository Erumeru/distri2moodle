const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON en las solicitudes
app.use(express.json());
// Ruta para hacer la solicitud a la otra API
app.get('/api/otra-api', async (req, res) => {
    try {

        var url = "http://localhost/webservice/rest/server.php";
        var cursos = [];
        //var tbody = document.getElementById('tablaCursos');
        // Construir los parámetros de la URL
        var parametros = [];
        parametros.push("wstoken=b5905aee33fbbe8a2cb3f613bcec7bbf");
        parametros.push("wsfunction=gradereport_user_get_grades_table");
        // parametros.push("courseid=2");
        parametros.push("moodlewsrestformat=json");
        parametros.push("userid=" + req.query.userId);
        parametros.push("courseid=" + req.query.courseId);
        //parametros.push("groupid=0");
        // Combinar todos los parámetros en la URL
        url += "?" + parametros.join("&");
        // Hacer una solicitud GET a la otra API
        const response = await axios.get(url);
        // Devolver los datos recibidos como respuesta
        res.json(response.data);
    } catch (error) {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error('Error al hacer la solicitud a la otra API:', error);
        res.status(500).json({error: 'Error al hacer la solicitud a la otra API'});
    }
});


//PERSISTIR CURSOS ACAAAA
app.get('/api/consultar-cursos-y-profesores', async (req, res) => {
    try {
        const email = req.query.email;

        // Consultar los IDs de los alumnos asociados al padre por su correo electrónico
        const idsAlumnos = await new Promise((resolve, reject) => {
            consultarIdMoodleAlumnosPorEmailPadre(email, function (error, idsAlumnos) {
                if (error) {
                    console.error('Error al consultar los IDs de los alumnos:', error);
                    reject(error);
                } else {
                    resolve(idsAlumnos);
                }
            });
        });

        // Si se obtuvieron los IDs de los alumnos correctamente, iterar sobre ellos y realizar una solicitud REST para cada uno
        const promesasCursos = idsAlumnos.map(idAlumno => {
            return new Promise((resolve, reject) => {
                // Construir la URL para la solicitud al servidor Moodle para el ID de este alumno
                const url = "http://localhost/webservice/rest/server.php";
                const parametros = [
                    "wstoken=b5905aee33fbbe8a2cb3f613bcec7bbf",
                    "wsfunction=core_enrol_get_users_courses",
                    "moodlewsrestformat=json",
                    `userid=${idAlumno}`
                ];
                const cursoUrl = url + "?" + parametros.join("&");

                // Hacer la solicitud utilizando Axios
                axios.get(cursoUrl)
                        .then(function (response) {
                            // Resolver la promesa con los datos recibidos
                            resolve(response.data);
                        })
                        .catch(function (error) {
                            // Rechazar la promesa con el error
                            reject(error);
                        });
            });
        });

        // Esperar a que se completen todas las solicitudes de cursos y luego obtener los profesores
        const cursos = await Promise.all(promesasCursos);
        console.log(cursos);
        // Ahora, puedes iterar sobre los cursos para obtener los IDs de los cursos y hacer la solicitud para obtener los profesores
        const promesasProfesores = cursos.flatMap(curso => {
            const courseid = curso.map(c => c.id); // Supongo que el ID del curso está en la propiedad 'id'
            return courseid.map(id => {
                return axios.get('http://localhost/webservice/rest/server.php', {
                    params: {
                        wstoken: 'b5905aee33fbbe8a2cb3f613bcec7bbf',
                        wsfunction: 'core_enrol_get_enrolled_users',
                        courseid: id,
                        moodlewsrestformat: 'json'
                    }
                }).then(response => response.data);
            });
        });


        // Esperar a que se completen todas las solicitudes de profesores y luego devolver los datos
        const profesores = await Promise.all(promesasProfesores);
        res.json({cursos, profesores, idsAlumnos});
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({error: 'Error al procesar la solicitud'});
    }
});


const {consultarIdsAlumnosPorEmailPadre} = require('./persistencia.js');
app.get('/api/consultar-cursos', async (req, res) => {
    try {
        const email = req.query.email;

        // Consultar los IDs de los alumnos asociados al padre por su correo electrónico
        const idsAlumnos = await new Promise((resolve, reject) => {
            consultarIdMoodleAlumnosPorEmailPadre(email, function (error, idsAlumnos) {
                if (error) {
                    console.error('Error al consultar los IDs de los alumnos:', error);
                    reject(error);
                } else {
                    resolve(idsAlumnos);
                }
            });
        });

        // Si se obtuvieron los IDs de los alumnos correctamente, iterar sobre ellos y realizar una solicitud REST para cada uno
        const promesas = idsAlumnos.map(idAlumno => {
            return new Promise((resolve, reject) => {
                // Construir la URL para la solicitud al servidor Moodle para el ID de este alumno
                var url = "http://localhost/webservice/rest/server.php";
                var parametros = [
                    "wstoken=b5905aee33fbbe8a2cb3f613bcec7bbf",
                    "wsfunction=core_enrol_get_users_courses",
                    "moodlewsrestformat=json",
                    `userid=${idAlumno}`
                ];
                url += "?" + parametros.join("&");

                // Hacer la solicitud utilizando Axios
                axios.get(url)
                        .then(function (response) {
                            // Resolver la promesa con los datos recibidos
                            resolve(response.data);
                        })
                        .catch(function (error) {
                            // Rechazar la promesa con el error
                            reject(error);
                        });
            });
        });

        // Esperar a que se completen todas las solicitudes y luego devolver los datos
        const resultados = await Promise.all(promesas);
        res.json(resultados);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({error: 'Error al procesar la solicitud'});
    }
});

app.get('/api/consultar-profesor-curso', async (req, res) => {
    try {
        const url = "http://localhost/webservice/rest/server.php";
        const params = {
            wstoken: 'b5905aee33fbbe8a2cb3f613bcec7bbf',
            wsfunction: 'core_enrol_get_enrolled_users',
            courseid: req.query.courseId,
            moodlewsrestformat: 'json'
        };
        // Realizar la solicitud GET utilizando Axios
        const response = await axios.get(url, {params})
                .then(function (response) {
                    // Devolver la respuesta JSON con los maestros del curso
                    const cursoInfo = response.data;
                    // Filtrar los maestros y alumnos
                    const maestros = cursoInfo.filter(user => user.roles.some(role => role.shortname === 'editingteacher'));
                    res.json(maestros);
                });
    } catch (error) {
        // Manejar errores
        console.error("Error al enviar la solicitud:", error);
        // Aquí puedes agregar cualquier lógica adicional para manejar el error
    }
});

app.get('/api/consultar-tareas-alumno-curso', async (req, res) => {
    try {
        const url = "http://localhost/webservice/rest/server.php";
        const params = {
            wstoken: 'b5905aee33fbbe8a2cb3f613bcec7bbf',
            wsfunction: 'mod_assign_get_assignments',
            courseids: [req.query.courseId],
            moodlewsrestformat: 'json'
        };
        // Realizar la solicitud GET utilizando Axios
        const response = await axios.get(url, {params})
                .then(function (response) {
                    const cursoInfo = response.data;
                    res.json(cursoInfo);
                });
    } catch (error) {
        // Manejar errores
        console.error("Error al enviar la solicitud:", error);
        // Aquí puedes agregar cualquier lógica adicional para manejar el error
    }
});

//CHECARRRRRR
const {consultarIdMoodleAlumnosPorEmailPadre, consultarCursosDeAlumno, consultarIdMoodleCurso} = require('./persistencia.js');
app.get('/api/consultar-calificaciones-curso', async (req, res) => {
    const email = req.query.email;
    console.log("email", email);
    try {
        // Consultar los IDs de los alumnos asociados al padre por su correo electrónico

        const idsAlumnos = await new Promise((resolve, reject) => {
            consultarIdMoodleAlumnosPorEmailPadre(email, function (error, idsAlumnos) {
                if (error) {
                    console.error('Error al consultar los IDs de los alumnos:', error);
                    reject(error);
                } else {
                    resolve(idsAlumnos);
                }
            });
        });

        const url = "http://localhost/webservice/rest/server.php";
        const token = 'b5905aee33fbbe8a2cb3f613bcec7bbf';

        // Array para almacenar las calificaciones de cada alumno
        const calificaciones = [];

        for (const alumnoId of idsAlumnos) {
            // Consultar los cursos del alumno actual
            const cursosAlumno = await new Promise((resolve, reject) => {
                consultarCursosDeAlumno(alumnoId, function (error, cursosAlumno) {
                    if (error) {
                        console.error('Error al consultar los cursos del alumno:', error);
                        reject(error);
                    } else {
                        resolve(cursosAlumno);
                    }
                });
            });
            console.log("cursosAlumnos", cursosAlumno);

            // Iterar sobre cada ID de curso del alumno actual
            for (const cursoId of cursosAlumno) {
                console.log("alumnoId", alumnoId);
                console.log("cursoId", cursoId);

                // Consultar el id_moodle del curso
                const idMoodleCurso = await new Promise((resolve, reject) => {
                    consultarIdMoodleCurso(cursoId, function (error, idMoodleCurso) {
                        if (error) {
                            console.error('Error al consultar el id_moodle del curso:', error);
                            reject(error);
                        } else {
                            resolve(idMoodleCurso);
                        }
                    });
                });
                console.log("id_moodle_curso", idMoodleCurso);

                const idsAlumnosMoodle = await new Promise((resolve, reject) => {
                    consultarIdMoodleAlumnosPorEmailPadre(email, function (error, idsAlumnosMoodle) {
                        if (error) {
                            console.error('Error al consultar los moodle IDs de los alumnos:', error);
                            reject(error);
                        } else {
                            resolve(idsAlumnosMoodle);
                        }
                    });
                });

                for (const idAlumnoMoodle of idsAlumnosMoodle) {

                    console.log("id_moodle_alumno", idAlumnoMoodle);
                    const params = {
                        wstoken: token,
                        wsfunction: 'gradereport_user_get_grades_table',
                        moodlewsrestformat: 'json',
                        userid: idAlumnoMoodle, // Usar el ID de cada alumno
                        courseid: idMoodleCurso // Utilizar el id_moodle del curso actual
                    };
                    try {
                        const response = await axios.get(url, {params});

                        let sum = 0;
                        let hasNaN = false;
                        // Recorre todas las tablas
                        for (const table of response.data.tables) {
                            // Recorre los datos de la tabla
                            for (const data of table.tabledata) {
                                // Verifica si hay un atributo contributiontocoursetotal
                                if (data.contributiontocoursetotal) {
                                    // Extrae el contenido del atributo contributiontocoursetotal y lo convierte a número
                                    const contribution = parseFloat(data.contributiontocoursetotal.content);
                                    // Suma el valor al total
                                    if (!Number.isNaN(contribution)) {
                                        sum += contribution;
                                    } else {
                                        hasNaN = true;
                                    }
                                }
                            }
                        }
                        // Almacenar la calificación del alumno actual en el array de calificaciones
                        calificaciones.push({idAlumnoMoodle, idMoodleCurso, contibucionTotal: sum});
                    } catch (error) {
                        // Manejar errores
                        console.error("Error al enviar la solicitud:", error);
                    }
                } // Fin del bucle for de cursosAlumno
            }
        }

        // Enviar las calificaciones como respuesta
        res.json(calificaciones);

    } catch (error) {
        // Manejar errores
        console.error("Error al procesar la solicitud:", error);
        res.status(500).send("Error al procesar la solicitud");
    }
});

const{insertarDatosCurso} = require('./persistencia');
app.get('/api/insertarDatosCurso', async (req, res) => {

    try {
        // construir y agregar al padre 
        const curso = {
            id_maestro: req.query.id_maestro,
            id_moodle: req.query.id_moodle,
            nombreCurso: req.query.nombreCurso,
            nombreMaestro: req.query.nombreMaestro
        };
        try {
            const cursoId = await insertarDatosCurso(curso); // Esperar a que se resuelva la inserción en la base de datos
            res.json({cursoId: cursoId});
        } catch (error) {
            console.error('Error al persistir los datos del curso:', error);
            res.status(500).json({error: 'Error al persistir los datos del curso'});
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({error: 'Error al procesar la solicitud'});
    }
});

const{insertarCursoAlAlumno} = require('./persistencia');
app.get('/api/insertarCursoAlAlumno', async (req, res) => {
    try {
        // construir y agregar al padre 
        const cursoAlAlumno = {
            alumno_id: req.query.alumno_id,
            curso_id: req.query.curso_id
        };
        try {
            const alumno_cursoId = await insertarCursoAlAlumno(cursoAlAlumno); // Esperar a que se resuelva la inserción en la base de datos
            res.json({alumno_cursoId: alumno_cursoId});
        } catch (error) {
            console.error('Error al persistir los datos del curso en alumno:', error);
            res.status(500).json({error: 'Error al persistir los datos del curso en alumno'});
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({error: 'Error al procesar la solicitud'});
    }
});

const {insertarDatosAlumnoDePadre, insertarDatosPadres} = require('./persistencia');
app.get('/api/consulta-alumno-de-padre', async (req, res) => {
    try {
        var url = "http://localhost/webservice/rest/server.php";
        var parametros = [
            "wstoken=b5905aee33fbbe8a2cb3f613bcec7bbf",
            "wsfunction=core_user_get_users",
            "moodlewsrestformat=json",
            `criteria[0][key]=email&criteria[0][value]=${encodeURIComponent(req.query.emailAlumno)}`,
            `criteria[1][key]=firstname&criteria[1][value]=${encodeURIComponent(req.query.nombreAlumno)}`,
            `criteria[2][key]=lastname&criteria[2][value]=${encodeURIComponent(req.query.apellidosAlumno)}`
        ];

        url += "?" + parametros.join("&");

        const response = await axios.get(url);

        // Limpiar los datos de la respuesta
        const cleanedData = response.data.users.map(user => {
            // Crear un nuevo objeto con las propiedades necesarias limpias
            return {
                id: user.id,
                email: user.email,
                fullname: user.fullname.trim()

            };
        });

        // Devolver la respuesta JSON con los datos limpios
        res.json(cleanedData);



        // construir y agregar al padre 
        const padre = {
            email: req.query.emailPadre,
            nombre: req.query.nombrePadre,
            password: req.query.passwordPadre
        };
        try {
            const padreId = await insertarDatosPadres(padre); // Esperar a que se resuelva la inserción en la base de datos
            const alumno = {
                email: cleanedData[0].email,
                id_moodle: cleanedData[0].id,
                nombre: cleanedData[0].fullname,
                padre_id: padreId
            };
            await insertarDatosAlumnoDePadre(alumno);

        } catch (error) {
            console.error('Error al persistir los datos del padre:', error);
            res.status(500).json({error: 'Error al persistir los datos del padre'});
        }


    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({error: 'Error al procesar la solicitud'});
    }
});

const {consultarPadrePorCredenciales} = require('./persistencia');
app.get('/api/iniciarSesion-Padre', async (req, res) => {
    try {
        // Obtener los parámetros de la URL
        const email = req.query.email;
        const password = req.query.password;

        // Llamar a la función para consultar al padre por sus credenciales
        consultarPadrePorCredenciales(email, password, (error, padre) => {
            if (error) {
                // Manejar el error, si lo hay
                console.error('Error al consultar padre:', error);
                res.status(500).send('Error interno del servidor');
                return;
            }
            if (!padre) {
                // Si no se encuentra al padre, enviar una respuesta de error
                res.status(401).send('Credenciales incorrectas');
                return;
            }

            res.json({idPadre: padre.id});
        });
    } catch (error) {
        // Manejar cualquier error inesperado
        console.error('Error inesperado:', error);
        res.status(500).send('Error interno del servidor');
    }
});

const {obtenerPadrePorIdMoodle, consultarPadresDeAlumnosDeMaestro} = require('./persistencia');
app.get('/api/obtener-padre-por-id-moodle', async (req, res) => {
    try {
        // Obtener los parámetros de la URL
        const idmoodle = req.query.idmoodle;

        // Llamar a la función para consultar al padre por sus credenciales
        obtenerPadrePorIdMoodle(idmoodle, (error, padre) => {
            if (error) {
                // Manejar el error, si lo hay
                console.error('Error al consultar padre:', error);
                res.status(500).send('Error interno del servidor');
                return;
            }
            if (!padre) {
                // Si no se encuentra al padre, enviar una respuesta de error
                res.status(401).send('Credenciales incorrectas');
                return;
            }

            res.json({idPadre: padre.id, nombre: padre.nombre});
        });
    } catch (error) {
        // Manejar cualquier error inesperado
        console.error('Error inesperado:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Definir la ruta para obtener los padres por ID de Moodle
app.get('/api/obtener-padres-por-maestro', async (req, res) => {
    try {
        // Obtener el parámetro de la URL (ID del maestro)
        const idMaestro = req.query.idMaestro;

        // Llamar a la función para consultar los padres de los alumnos del maestro
        consultarPadresDeAlumnosDeMaestro(idMaestro, (error, padres) => {
            if (error) {
                // Manejar el error, si lo hay
                console.error('Error al consultar padres de alumnos del maestro:', error);
                res.status(500).send('Error interno del servidor');
                return;
            }

            // Enviar la lista de padres como respuesta
            res.json(padres);
        });
    } catch (error) {
        // Manejar cualquier error inesperado
        console.error('Error inesperado:', error);
        res.status(500).send('Error interno del servidor');
    }
});




app.get('/api/iniciarSesion-maestro', async (req, res) => {
    try {
        const axios = require('axios');
        const url = "http://localhost/login/token.php";
        const username = req.query.username;
        const password = req.query.password;
        const service = 'moodle_mobile_app';
        const params = {
            username: username,
            password: password,
            service: service
        };
        // Realizar la solicitud GET utilizando Axios
        const response = await axios.get(url, {params});

        res.json(response.data);

    } catch (error) {
        // Manejar errores
        console.error("Error al enviar la solicitud:", error);
    }
});

app.get('/api/consultar-user-por-usuario', async (req, res) => {
    try {
        var url = "http://localhost/webservice/rest/server.php";
        // Construir los parámetros de la URL
        var parametros = [];
        parametros.push("wstoken=b5905aee33fbbe8a2cb3f613bcec7bbf");
        parametros.push("wsfunction=core_user_get_users");
        parametros.push("moodlewsrestformat=json");
        parametros.push("criteria[0][key]=username");
        parametros.push("criteria[0][value]=" + req.query.username);

        // Combinar todos los parámetros en la URL
        url += "?" + parametros.join("&");
        // Hacer la solicitud utilizando Axios
        axios.get(url)
                .then(function (response) {
                    // Devolver la respuesta JSON
                    res.json(response.data);
                })
                .catch(function (error) {
                    // Manejar errores
                    console.error("Error al enviar la solicitud:", error);
                    res.status(500).json({error: 'Error al enviar la solicitud'});
                });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({error: 'Error al procesar la solicitud'});
    }
});

//POR AHORA NO SE USARA Y SOLO SE USARÁ EL ID AL INICIAR SESIÓN
// Función para generar el token JWT
function generarToken(usuario) {
    // Generar el token con la información del usuario y una clave secreta
    const token = jwt.sign({usuario}, 'claveSecreta', {expiresIn: '1h'}); // duración del token
    return token;
}

// Manejador de ruta para todas las demás solicitudes
app.all('*', (req, res) => {
    res.status(404).json({mensaje: 'Ruta no encontrada'});
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor API Gateway escuchando en el puerto ${PORT}`);
});



