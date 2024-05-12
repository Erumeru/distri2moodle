/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

const axios = require('axios');

async function getProfesores(courseId) {
    const url = "http://localhost/webservice/rest/server.php";
    const params = {
        wstoken: 'b5905aee33fbbe8a2cb3f613bcec7bbf',
        wsfunction: 'core_enrol_get_enrolled_users',
        courseid: courseId,
        moodlewsrestformat: 'json'
    };

    const response = await axios.get(url, {params});
    const cursoInfo = response.data;
    // Filtrar los maestros y alumnos
    const maestros = cursoInfo.filter(user => user.roles.some(role => role.shortname === 'editingteacher'));
    // Extraer solo los campos id y fullname de cada usuario
    const admins = maestros.map(maestro => ({
            id: maestro.id,
            fullname: maestro.fullname
        }));

    return admins;
}

async function llamarServicioExterno(idMoodle) {
    try {
        const url = 'http://localhost:3000/api/obtener-padre-por-id-moodle?idmoodle='+idMoodle;
        const params = {
            // si es necesario, agrega tus parámetros aquí
        };

        const response = await fetch(url, {
            method: 'GET', // utiliza el método GET
            // no es necesario definir un cuerpo para una solicitud GET
            headers: {
                'Content-Type': 'application/json',
                // si es necesario, agrega más encabezados aquí
            }
        });
        // Verifica si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error('Error al enviar la solicitud: ' + response.statusText);
        }

        // Lee la respuesta como JSON
        const data = await response.json();
        return data;
    } catch (error) {
      //  console.error('Error al enviar la solicitud:', error);
        throw error;
    }
}


// Define la función obtenerIdsCursos
async function obtenerIdsCursos() {
    try {
        const url = "http://localhost/webservice/rest/server.php";
        const params = {
            wstoken: 'b5905aee33fbbe8a2cb3f613bcec7bbf',
            wsfunction: 'core_course_get_courses',
            moodlewsrestformat: 'json'
        };
        // Realiza la solicitud GET utilizando Axios
        const response = await axios.get(url, {params});
        // Extrae solo los IDs de cada curso
        const idsCursos = response.data.map(curso => curso.id);
        return idsCursos;
    } catch (error) {
        // Maneja errores
        console.error("Error al enviar la solicitud:", error);
        throw error;
    }
}

// Define la función para obtener el id de los padres
async function obtenerIdPadreDeAlumno(idMoodle) {
    try{
    return await llamarServicioExterno(idMoodle);
    } catch(error){
        return {error: "El alumno no tiene un padre registrado"};
    }
}

module.exports = {
    obtenerIdPadreDeAlumno: obtenerIdPadreDeAlumno,
    getProfesores: getProfesores,
    obtenerIdsCursos: obtenerIdsCursos
};