/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3003;

const os = require('os');
const dotenv = require('dotenv');
dotenv.config();

// Middleware para parsear JSON en las solicitudes
app.use(express.json());


const {obtenerIdsCursos, getProfesores, obtenerIdPadreDeAlumno, persistirIdsCursos} = require('./funcionesCtrlEscolar.js');
app.get('/api/entrega-ctrlEscolar', async (req, res) => {
    try {
        const axios = require('axios');
        const url = "http://localhost/webservice/rest/server.php";
        const token = 'b5905aee33fbbe8a2cb3f613bcec7bbf';

        // Obtener todos los IDs de los cursos
        const idsCursos = await obtenerIdsCursos();

        // Array para almacenar la información de alumnos de todos los cursos con su respectivo courseId
        let alumnosTodosCursos = [];

        // Para cada curso, realizar la solicitud de consulta de alumnos y calificaciones
        await Promise.all(idsCursos.map(async (courseId) => {
            const paramsAlumnos = {
                wstoken: token,
                wsfunction: 'gradereport_grader_get_users_in_report',
                moodlewsrestformat: 'json',
                courseid: courseId
            };

            // Realizar la solicitud GET para obtener los alumnos utilizando Axios
            const responseAlumnos = await axios.get(url, {params: paramsAlumnos});

            // Verificar si hay usuarios en la respuesta
            if (responseAlumnos.data.users) {
                // Extraer solo los campos id y fullname de cada usuario
                const alumnosCurso = responseAlumnos.data.users.map(alumno => ({
                        id: alumno.id,
                        fullname: alumno.fullname,
                        courseId: courseId // Agregar el ID del curso al objeto de alumno
                    }));

                // Agregar la información de los alumnos del curso al array
                alumnosTodosCursos = alumnosTodosCursos.concat(alumnosCurso);

                // Para cada alumno en el curso, obtener sus calificaciones
                await Promise.all(alumnosCurso.map(async (alumno) => {
                    const paramsCalificaciones = {
                        wstoken: token,
                        wsfunction: 'gradereport_user_get_grades_table',
                        moodlewsrestformat: 'json',
                        userid: alumno.id,
                        courseid: courseId
                    };

                    // Realizar la solicitud GET para obtener las calificaciones del alumno utilizando Axios
                    const responseCalificaciones = await axios.get(url, {params: paramsCalificaciones});

                    // Calcular la suma de las calificaciones del alumno
                    let sum = 0;
                    let hasNaN = false;
                    for (const table of responseCalificaciones.data.tables) {
                        for (const data of table.tabledata) {
                            if (data.contributiontocoursetotal) {
                                const contribution = parseFloat(data.contributiontocoursetotal.content);
                                if (!Number.isNaN(contribution)) {
                                    sum += contribution;
                                } else {
                                    hasNaN = true;
                                }
                            }
                        }
                    }

                    if (hasNaN) {
                        // Llamar a la otra función si hay NaN
                        const profesores = await getProfesores(courseId);
                        profesores.forEach(profesor => {
                            alumnosTodosCursos.push({NoCalifico: profesor.fullname, Curso: courseId});
                        });
                    }


                    // Agregar las calificaciones al objeto del alumno
                    alumno.calificaciones = sum;
                    console.log(alumno.calificaciones);
                    console.log(alumno.id);
                    try {
                        if (alumno.calificaciones < 70) {
                            console.log("PADRE DE EL ALUMNO MALO");
                            const padre = await obtenerIdPadreDeAlumno(alumno.id);
                            if (padre.idPadre) {
                                console.log(padre);
                                var nombrePadre = padre.nombre;
                                var col = `ctrlEscolar&${padre.idPadre}`;
                                console.log(col);
                                const mensaje=`Querido ${padre.nombre}, su hijo ${alumno.fullname} ha presentado una baja calificación con un valor de ${alumno.calificaciones}`;
                                enviarMensaje(col,mensaje);
                            }
                        }
                    } catch (error) {
                        console.error('Error al procesar el alumno', error);
                    }
                }));
            }
        }));
        // Devolver la respuesta JSON con la información de todos los alumnos de todos los cursos
        res.json(alumnosTodosCursos);

    } catch (error) {
        // Manejar errores
        console.error("Error al enviar la solicitud:", error);
        res.status(500).json({error: 'Error al procesar la solicitud'});
    }
});

async function enviarMensaje(cola, mensaje) {
    try {
        const colaEnviar = cola;
        const response = await fetch('http://localhost:3001/enviar-mensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({mensaje: mensaje, cola: colaEnviar})
        });
        const data = await response.text();
        console.log(data); // Mensaje enviado correctamente
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
    }
}

// Manejador de ruta para todas las demás solicitudes
app.all('*', (req, res) => {
    res.status(404).json({mensaje: 'Ruta no encontrada'});
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor API Gateway escuchando en el puerto ${PORT}`);
});

