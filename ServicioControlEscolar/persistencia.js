/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
const mysql = require('mysql2');

//const os = require('os');
//const dotenv = require('dotenv');
//dotenv.config();

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'ctrlescolar',
    port: 3306
});



// Método para insertar datos en la base de datos
function insertarDatosCursos(datos) {
    // Conectarse a la base de datos
    connection.connect(function (err) {
        if (err) {
            console.error('Error al conectar a la base de datos: ' + err.stack);
            return;
        }

        console.log('Conectado como ID ' + connection.threadId);

        // Consulta SQL para insertar datos
        const sql = 'INSERT INTO curso (id_moodle) VALUES (?)';
        // Parámetros para la consulta SQL
        const values = [datos.id_moodle];

        // Ejecutar la consulta SQL
        connection.query(sql, values, function (error, results, fields) {
            // Si hay un error, mostrarlo
            if (error)
                throw error;

            // Mostrar los resultados
            console.log('Datos insertados correctamente:', results);
        });

        // Cerrar la conexión a la base de datos
        //  connection.end();
    });
}



// Método para obtener todos los cursos de la base de datos
function obtenerTodosLosCursos() {
    return new Promise((resolve, reject) => {
        // Consulta SQL para obtener todos los cursos
        const sql = 'SELECT * FROM curso';

        // Ejecutar la consulta SQL
        connection.query(sql, function (error, results, fields) {
            if (error) {
                // Si hay un error, rechazar la promesa con el error
                reject(error);
            } else {
                // Si la consulta se ejecuta correctamente, resolver la promesa con los resultados
                resolve(results);
            }
        });
    });
}

module.exports = {
    insertarDatosCursos: insertarDatosCursos,
    obtenerTodosLosCursos: obtenerTodosLosCursos
};
