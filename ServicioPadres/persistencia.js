const mysql = require('mysql2');
const os = require('os');
const dotenv = require('dotenv');
dotenv.config();
// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
<<<<<<< HEAD
    host: process.env.HOST_MYSQL || 'localhost',
    user: process.env.USER_MYSQL || 'root',
    password: process.env.PASSWORD_MYSQL || 'root', 
    database: process.env.DATABASE_MYSQL || 'moodlepadres',
    port: process.env.PORT_MYSQL || '3306'
=======
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'moodlepadres',
    port: 3306
>>>>>>> 8a833352b6994ec32012bf049faa65849970d507
});

// Método para insertar datos en la base de datos
function insertarDatosPadres(datos) {
    return new Promise((resolve, reject) => {
        // Conectarse a la base de datos
        connection.connect(function (err) {
            if (err) {
                console.error('Error al conectar a la base de datos: ' + err.stack);
                return reject(err);
            }

            console.log('Conectado como ID ' + connection.threadId);

            // Consulta SQL para insertar datos
            const sql = 'INSERT INTO padre (email, nombre, password) VALUES (?, ?, TRIM(?))';

            // Parámetros para la consulta SQL
            const values = [datos.email, datos.nombre, datos.password];
            console.log("0oadre:", values);

            // Ejecutar la consulta SQL
            connection.query(sql, values, function (error, results, fields) {
                // Si hay un error, rechazar la promesa con el error
                if (error) {
                    console.error('Error al insertar datos del padre:', error);
                    return reject(error);
                }

                // Mostrar los resultados
                console.log('Datos del padre insertados correctamente:', results);

                // Obtener el ID del padre insertado
                const padreId = results.insertId;

                // Resolver la promesa con el padreId
                resolve(padreId);

                // Cerrar la conexión a la base de datos
                // connection.end();
            });
        });
    });
    // connection.end();
}



// Método para insertar datos en la base de datos
function insertarDatosAlumnoDePadre(datos) {
    // Conectarse a la base de datos
    connection.connect(function (err) {
        if (err) {
            console.error('Error al conectar a la base de datos: ' + err.stack);
            return;
        }

        console.log('Conectado como ID ' + connection.threadId);

        // Consulta SQL para insertar datos
        const sql = 'INSERT INTO alumno (email, id_moodle, nombre) VALUES ( ?, ?, ?)';
        const sqlAlumnoPadre = 'INSERT INTO alumno_padre (alumno_id, padre_id) VALUES (?, ?)';

        // Parámetros para la consulta SQL
        const values = [datos.email, datos.id_moodle, datos.nombre];
        const valuesAlumnoPadre = [datos.id_moodle, datos.padre_id];

        // Ejecutar la consulta SQL
        connection.query(sql, values, function (error, results, fields) {
            // Si hay un error, mostrarlo
            if (error)
                throw error;

            // Mostrar los resultados
            console.log('Datos insertados correctamente:', results);

            connection.query(sqlAlumnoPadre, valuesAlumnoPadre, function (error, results, fields) {
                // Si hay un error, mostrarlo
                if (error)
                    throw error;

                // Mostrar los resultados
                console.log('Datos insertados correctamente:', results);
            });

        });

        // Cerrar la conexión a la base de datos
        //  connection.end();
    });
}





// Método para insertar datos en la base de datos
function insertarDatosCurso(datos) {
    return new Promise((resolve, reject) => {
        // Conectarse a la base de datos
        connection.connect(function (err) {
            if (err) {
                console.error('Error al conectar a la base de datos: ' + err.stack);
                return reject(err);
            }

            console.log('Conectado como ID ' + connection.threadId);

            // Consulta SQL para insertar datos
            const sql = 'INSERT INTO curso (id_maestro, id_moodle, nombreCurso, nombreMaestro) VALUES (?, ?, ?, ?)';
            //const sqlAlumno_curso = 'INSERT INTO alumno_curso (alumno_id, curso_id) VALUES ( ?, ?)';

            // Parámetros para la consulta SQL
            const values = [datos.id_maestro, datos.id_moodle, datos.nombreCurso, datos.nombreMaestro];
           // const valuesAlumo_curso = [datos.id_alumno, datos.id_moodle];

            // Ejecutar la consulta SQL
            connection.query(sql, values, function (error, results, fields) {
                // Si hay un error, rechazar la promesa con el error
                if (error) {
                    console.error('Curso ya existente:', error);
                    return;
                }

                // Mostrar los resultados
                console.log('Datos del curso insertados correctamente:', results);
//
//                connection.query(sqlAlumno_curso, valuesAlumo_curso, function (error, results, fields) {
//                    // Si hay un error, mostrarlo
//                    if (error)
//                        throw error;
//
//                    // Mostrar los resultados
//                    console.log('Datos insertados correctamente:', results);
//                });

                // Obtener el ID del padre insertado
                const cursoId = results.insertId;

                // Resolver la promesa con el padreId
                resolve(cursoId);

                // Cerrar la conexión a la base de datos
                // connection.end();
            });
        });
    });
    connection.end();
}

// Método para insertar datos en la base de datos
function insertarCursoAlAlumno(datos) {
    return new Promise((resolve, reject) => {
        // Conectarse a la base de datos
        connection.connect(function (err) {
            if (err) {
                console.error('Error al conectar a la base de datos: ' + err.stack);
                return reject(err);
            }

            console.log('Conectado como ID ' + connection.threadId);

            // Consulta SQL para insertar datos
            const sql = 'INSERT INTO alumno_curso (alumno_id, curso_id) VALUES (?, ?)';

            // Parámetros para la consulta SQL
            const values = [datos.alumno_id, datos.curso_id];

            // Ejecutar la consulta SQL
            connection.query(sql, values, function (error, results, fields) {
                // Si hay un error, rechazar la promesa con el error
                if (error) {
                    console.error('Error al insertar datos del curso en alumno:', error);
                    return;
                }

                // Mostrar los resultados
                console.log('Datos del curso en alumno insertados correctamente:', results);

                // Obtener el ID del padre insertado
                const cursoId = results;

                // Resolver la promesa con el cursoId
                resolve(cursoId);

                // Cerrar la conexión a la base de datos
                // connection.end();
            });
        });
    });
    connection.end();
}

// Método para consultar un padre en la base de datos
function consultarPadrePorCredenciales(email, password, callback) {
    // Consulta SQL para buscar al padre por email y contraseña

    connection.connect(function (err) {
        if (err) {
            console.error('Error al conectar a la base de datos: ' + err.stack);
            return reject(err);
        }
        const sql = 'SELECT * FROM padre WHERE email = ? AND password = ?';

        // Parámetros para la consulta SQL
        const values = [email, password];
        // Ejecutar la consulta SQL
        connection.query(sql, values, function (error, results, fields) {
            // Si hay un error, llamar al callback con el error
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                callback(error, null);
                return;
            }

            // Si no hay resultados, llamar al callback con un mensaje indicando que no se encontró el padre
            if (results.length === 0) {
                const notFoundError = new Error('Padre no encontrado');
                callback(notFoundError, null);
                return;
            }

            // Llamar al callback con los resultados (el padre encontrado)
            callback(null, results[0]);
        });
    });
    // connection.end();

}


// Método para obtener los IDs y nombres de todos los padres existentes en la base de datos
function obtenerIdsYNombrePadres(callback) {
    // Consulta SQL para seleccionar los IDs y nombres de todos los padres
    const sql = 'SELECT id, nombre FROM padre';

    // Ejecutar la consulta SQL
    connection.query(sql, function (error, results, fields) {
        // Si hay un error, llamar al callback con el error
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            callback(error, null);
            return;
        }

        // Crear un array para almacenar los IDs y nombres de los padres
        const idsYNombrePadres = results.map(resultado => ({id: resultado.id, nombre: resultado.nombre}));

        // Llamar al callback con los IDs y nombres de los padres
        callback(null, idsYNombrePadres);
    });
}

function obtenerPadrePorIdMoodle(idMoodle, callback) {
 // Consulta SQL para obtener el padre de un alumno por su alumno_id
    const sql = 'SELECT p.id, p.nombre FROM padre p INNER JOIN alumno_padre ap ON p.id = ap.padre_id WHERE ap.alumno_id = ?';

    // Ejecutar la consulta SQL con el alumno_id proporcionado
    connection.query(sql, [idMoodle], function (error, results, fields) {
        // Si hay un error, llamar al callback con el error
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            callback(error, null);
            return;
        }

        // Si no se encontraron resultados, llamar al callback con un mensaje de error
        if (results.length === 0) {
            const mensajeError = 'No se encontró ningún padre para el alumno con alumno_id: ' + idMoodle;
            callback(mensajeError, null);
            return;
        }

        // Como se espera que haya un solo padre, obtener el primer resultado
        const padre = {id: results[0].id, nombre: results[0].nombre};

        // Llamar al callback con los datos del padre
        callback(null, padre);
    });
}

function consultarIdsAlumnosPorEmailPadre(emailPadre, callback) {
    // Consulta SQL para buscar los IDs de los alumnos asociados al padre por su correo electrónico
    const sql = `
        SELECT id
        FROM alumno
        WHERE padre_id IN (
            SELECT id
            FROM padre
            WHERE email = ?
        )`;

    // Parámetros para la consulta SQL
    const values = [emailPadre];
    // Ejecutar la consulta SQL
    connection.query(sql, values, function (error, results, fields) {
        // Si hay un error, llamar al callback con el error
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            return callback(error, null);
        }
        // Si no hay resultados, llamar al callback con un mensaje indicando que no se encontraron alumnos
        if (results.length === 0) {
            const notFoundError = new Error('No se encontraron alumnos asociados a este padre');
            return callback(notFoundError, null);
        }

        // Crear un array para almacenar los IDs de los alumnos
        const idsAlumnos = results.map(result => result.id);

        // Llamar al callback con los IDs de los alumnos encontrados
        return callback(null, idsAlumnos);
    });
}

function consultarIdMoodleAlumnosPorEmailPadre(emailPadre, callback) {
    // Consulta SQL para buscar los IDs de los alumnos asociados al padre por su correo electrónico
    const sql = `
    SELECT alumno.id_moodle
FROM alumno
JOIN alumno_padre ON alumno_padre.alumno_id = alumno.id_moodle
JOIN padre ON alumno_padre.padre_id = padre.id
WHERE padre.email = ?`;

    // Parámetros para la consulta SQL
    const values = [emailPadre];
    // Ejecutar la consulta SQL
    connection.query(sql, values, function (error, results, fields) {
        // Si hay un error, llamar al callback con el error
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            return callback(error, null);
        }
        // Si no hay resultados, llamar al callback con un mensaje indicando que no se encontraron alumnos
        if (results.length === 0) {
            const notFoundError = new Error('No se encontraron alumnos asociados a este padre');
            return callback(notFoundError, null);
        }

        // Crear un array para almacenar los IDs de los alumnos
        const idsAlumnos = results.map(result => result.id_moodle);

        // Llamar al callback con los IDs de los alumnos encontrados
        return callback(null, idsAlumnos);
    });
}


function consultarCursosDeAlumno(alumno_id, callback) {
    // Consulta SQL para seleccionar los cursos del alumno
    const sql = 'SELECT curso_id FROM alumno_curso WHERE alumno_id = ?';

    // Parámetros para la consulta SQL
    const values = [alumno_id];

    // Ejecutar la consulta SQL
    connection.query(sql, values, function (error, results, fields) {
        // Si hay un error, llamar al callback con el error
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            callback(error, null);
            return;
        }

        // Almacenar los ids de los cursos en un array
        const cursos = results.map(result => result.curso_id);

        // Llamar al callback con los ids de los cursos
        callback(null, cursos);
    });
}

async function consultarPadresDeAlumnosDeMaestro(id_maestro, callback) {
    try {
        const sql = 'SELECT id_moodle FROM curso WHERE id_maestro = ?';
        const values = [id_maestro];

        const resultadosCursos = await new Promise((resolve, reject) => {
            connection.query(sql, values, function (error, resultadosCursos, fields) {
                if (error) {
                    console.error('Error al obtener cursos del maestro:', error);
                    reject(error);
                    return;
                }
                resolve(resultadosCursos);
            });
        });

        const padresSet = new Set();

        for (const curso of resultadosCursos) {
            const alumnos = await new Promise((resolve, reject) => {
                consultarAlumnosDeCurso(curso.id_moodle, function (error, alumnos) {
                    if (error) {
                        console.error('Error al obtener alumnos del curso:', error);
                        reject(error);
                        return;
                    }
                    resolve(alumnos);
                });
            });

            for (const alumno of alumnos) {
                const padre = await new Promise((resolve, reject) => {
                    consultarPadreDeAlumno(alumno, function (error, padre) {
                        if (error) {
                            console.error('Error al obtener padre del alumno:', error);
                            reject(error);
                            return;
                        }
                        resolve(padre);
                    });
                });
                padresSet.add({id: padre.id, nombre: padre.nombre});
            }
        }

        const padresArray = Array.from(padresSet);

// Utiliza un array temporal para almacenar las propiedades únicas (en este caso, el id)
        const idUnicos = [];
        padresArray.forEach(padre => {
            if (!idUnicos.includes(padre.id)) {
                idUnicos.push(padre.id);
            }
        });

// Construye un nuevo array de objetos únicos basados en el id
        const padresUnicos = idUnicos.map(id => padresArray.find(padre => padre.id === id));


        console.log("Padres:", padresUnicos);
        callback(null, Array.from(padresUnicos));
    } catch (error) {
        console.error('Error inesperado:', error);
        callback(error, null);
    }
}



function consultarAlumnosDeCurso(curso_id, callback) {
    // Consulta SQL para seleccionar los alumnos que están cursando un curso específico
    const sql = 'SELECT alumno_id FROM alumno_curso WHERE curso_id = ?';

    // Parámetros para la consulta SQL
    const values = [curso_id];

    // Ejecutar la consulta SQL
    connection.query(sql, values, function (error, resultadosAlumnos, fields) {
        if (error) {
            console.error('Error al obtener alumnos del curso:', error);
            callback(error, null);
            return;
        }

        // Array para almacenar los ID de los alumnos
        const alumnos = [];

        // Obtener los ID de los alumnos del resultado de la consulta
        resultadosAlumnos.forEach(function (resultado) {
            alumnos.push(resultado.alumno_id);
        });

        // Llamar al callback con los ID de los alumnos
        callback(null, alumnos);
    });
}

function consultarPadreDeAlumno(alumno_id, callback) {
    // Consulta SQL para seleccionar el ID y nombre del padre del alumno
    const sql = 'SELECT p.id AS padre_id, p.nombre AS nombre_padre FROM padre p JOIN alumno_padre a ON p.id = a.padre_id WHERE a.alumno_id = ?';

    // Parámetros para la consulta SQL
    const values = [alumno_id];

    // Ejecutar la consulta SQL
    connection.query(sql, values, function (error, resultadosPadre, fields) {
        if (error) {
            console.error('Error al obtener el padre del alumno:', error);
            callback(error, null);
            return;
        }

        // Si no se encontró un padre para el alumno
        if (resultadosPadre.length === 0) {
            const errorNoEncontrado = new Error('Padre no encontrado para el alumno');
            callback(errorNoEncontrado, null);
            return;
        }

        // Obtener el ID y nombre del padre del resultado de la consulta
        const padre = {
            id: resultadosPadre[0].padre_id,
            nombre: resultadosPadre[0].nombre_padre
        };

        // Llamar al callback con el objeto padre
        callback(null, padre);
    });
}



function consultarIdMoodleCurso(id, callback) {
    // Consulta SQL para seleccionar el id_moodle del curso
    const sql = 'SELECT id_moodle FROM curso WHERE id = ?';

    // Parámetros para la consulta SQL
    const values = [id];

    // Ejecutar la consulta SQL
    connection.query(sql, values, function (error, results, fields) {
        // Si hay un error, llamar al callback con el error
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            callback(error, null);
            return;
        }

        // Si hay resultados, tomar el primer resultado y extraer el id_moodle
        if (results.length > 0) {
            const idMoodleCurso = results[0].id_moodle;
            // Llamar al callback con el id_moodle del curso
            callback(null, idMoodleCurso);
        } else {
            // Si no hay resultados, llamar al callback con un mensaje indicando que el curso no fue encontrado
            const errorMessage = 'Curso no encontrado';
            console.error(errorMessage);
            callback(errorMessage, null);
        }
    });
}


module.exports = {
    insertarDatosPadres: insertarDatosPadres,
    insertarDatosAlumnoDePadre: insertarDatosAlumnoDePadre,
    consultarPadrePorCredenciales: consultarPadrePorCredenciales,
    obtenerIdsYNombrePadres: obtenerIdsYNombrePadres,
    consultarIdsAlumnosPorEmailPadre: consultarIdsAlumnosPorEmailPadre,
    obtenerPadrePorIdMoodle: obtenerPadrePorIdMoodle,
    insertarDatosCurso: insertarDatosCurso,
    insertarCursoAlAlumno: insertarCursoAlAlumno,
    consultarCursosDeAlumno: consultarCursosDeAlumno,
    consultarIdMoodleAlumnosPorEmailPadre: consultarIdMoodleAlumnosPorEmailPadre,
    consultarIdMoodleCurso: consultarIdMoodleCurso,
    consultarPadresDeAlumnosDeMaestro: consultarPadresDeAlumnosDeMaestro
};