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
function insertarDatos(datos) {
  // Conectarse a la base de datos
  connection.connect(function(err) {
    if (err) {
      console.error('Error al conectar a la base de datos: ' + err.stack);
      return;
    }

    console.log('Conectado como ID ' + connection.threadId);

    // Consulta SQL para insertar datos
    const sql = 'INSERT INTO padre (email, nombre, password) VALUES (?, ?, ?)';
    
    // Parámetros para la consulta SQL
    const values = [datos.email, datos.nombre, datos.password];

    // Ejecutar la consulta SQL
    connection.query(sql, values, function(error, results, fields) {
      // Si hay un error, mostrarlo
      if (error) throw error;

      // Mostrar los resultados
      console.log('Datos insertados correctamente:', results);
    });

    // Cerrar la conexión a la base de datos
    connection.end();
  });
}


module.exports = {
  insertarDatos: insertarDatos
};