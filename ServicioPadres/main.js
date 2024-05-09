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
        parametros.push("wstoken=a7ab7c13eca9c4d87556998dff78a606");
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

app.get('/api/consultar-cursos', async (req, res) => {
    try {
        var url = "http://localhost/webservice/rest/server.php";
        // Construir los parámetros de la URL
        var parametros = [];
        parametros.push("wstoken=a7ab7c13eca9c4d87556998dff78a606");
        parametros.push("wsfunction=core_enrol_get_users_courses");
        parametros.push("moodlewsrestformat=json");
        parametros.push("userid=" + req.query.userId);
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

app.get('/api/consultar-profesor-curso', async (req, res) => {
    try {
        const url = "http://localhost/webservice/rest/server.php";
        const params = {
            wstoken: 'a7ab7c13eca9c4d87556998dff78a606',
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
            wstoken: 'a7ab7c13eca9c4d87556998dff78a606',
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
//const {getProfesores} = require('./funciones.js');
app.get('/api/consultar-calificaciones-curso', async (req, res) => {
    try {
        const axios = require('axios');
        const url = "http://localhost/webservice/rest/server.php";
        const userId = req.query.userId;
        const courseId = req.query.courseId;
        const token = 'a7ab7c13eca9c4d87556998dff78a606';
        const params = {
            wstoken: token,
            wsfunction: 'gradereport_user_get_grades_table',
            moodlewsrestformat: 'json',
            userid: userId,
            courseid: courseId
        };
        // Realizar la solicitud GET utilizando Axios
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
        const jsonData = {contibucionTotal: sum};
        res.json(jsonData);

    } catch (error) {
        // Manejar errores
        console.error("Error al enviar la solicitud:", error);
    }
});


// let padreId;
//
//const {insertarDatosPadres} = require('./persistencia');
//
//app.get('/api/persistir-padre', async (req, res) => {
//    const padre = {
//        email: req.query.email,
//        nombre: req.query.nombre,
//        password: req.query.password
//    };
//    try {
//        padreId = await insertarDatosPadres(padre); // Esperar a que se resuelva la inserción en la base de datos
//        padre.padre_id = padreId; // Agregar el padre_id a la respuesta
//        res.json(padre); // Enviar la respuesta con el padre_id
//    } catch (error) {
//        console.error('Error al persistir los datos del padre:', error);
//        res.status(500).json({error: 'Error al persistir los datos del padre'});
//    }
//});


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
                password: "novaasernecesario",
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
        parametros.push("wstoken=a7ab7c13eca9c4d87556998dff78a606");
        parametros.push("wsfunction=core_user_get_users");
        parametros.push("moodlewsrestformat=json");
        parametros.push("criteria[0][key]=username");
        parametros.push("criteria[0][value]="+req.query.username);

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



