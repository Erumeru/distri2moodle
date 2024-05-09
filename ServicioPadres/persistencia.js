const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'moodlepadres',
    port: 12345
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
            const sql = 'INSERT INTO padre (email, nombre, password) VALUES (?, ?, ?)';

            // Parámetros para la consulta SQL
            const values = [datos.email, datos.nombre, datos.password];

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
                //connection.end();
            });
        });
    });
    connection.end();
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
        const sql = 'INSERT INTO alumno (email, id_moodle, nombre, password, padre_id) VALUES (?, ?, ?, ?, ?)';

        // Parámetros para la consulta SQL
        const values = [datos.email, datos.id_moodle, datos.nombre, datos.password, datos.padre_id];

        // Ejecutar la consulta SQL
        connection.query(sql, values, function (error, results, fields) {
            // Si hay un error, mostrarlo
            if (error)
                throw error;

            // Mostrar los resultados
            console.log('Datos insertados correctamente:', results);
        });

        // Cerrar la conexión a la base de datos
        connection.end();
    });
}


// Método para consultar un padre en la base de datos
function consultarPadrePorCredenciales(email, password, callback) {
    // Consulta SQL para buscar al padre por email y contraseña
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

module.exports = {
    insertarDatosPadres: insertarDatosPadres,
    insertarDatosAlumnoDePadre: insertarDatosAlumnoDePadre,
    consultarPadrePorCredenciales: consultarPadrePorCredenciales,
    obtenerIdsYNombrePadres: obtenerIdsYNombrePadres
};