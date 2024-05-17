/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

const axios = require('axios');

async function getProfesores(courseId) {
    const url = "http://localhost:8200/webservice/rest/server.php";
    const params = {
        wstoken: '86158e1f7f073595c65460b27edaf9b5',
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


const { obtenerTodosLosCursos, insertarDatosCursos } = require('./persistencia.js');
async function obtenerIdsCursos() {
    try {
        // Realizar la solicitud de obtención de cursos desde la base de datos
        const cursos = await obtenerTodosLosCursos();
        
        // Verificar si la respuesta de obtenerTodosLosCursos es nula o está vacía
        if (!cursos || cursos.length === 0) {
            // Si no hay cursos en la base de datos, realizar la solicitud REST para obtenerlos
            console.log("Realizando solicitud REST para obtener IDs de cursos...");
            
            const url = "http://localhost:8200/webservice/rest/server.php";
            const params = {
                wstoken: '86158e1f7f073595c65460b27edaf9b5',
                wsfunction: 'core_course_get_courses',
                moodlewsrestformat: 'json'
            };
            // Realizar la solicitud GET utilizando Axios
            const response = await axios.get(url, {params});
            // Extraer solo los IDs de cada curso
            const idsCursos = response.data.map(curso => curso.id);
            
            // Persistir los IDs de los cursos en la base de datos
            for (const idCurso of idsCursos) {
                try {
                    // Insertar el curso en la base de datos
                    await insertarDatosCursos({ id_moodle: idCurso });
                    
                    console.log(`Curso con ID ${idCurso} insertado correctamente en la base de datos.`);
                } catch (error) {
                    console.error(`Error al insertar curso con ID ${idCurso} en la base de datos:`, error);
                }
            }
            return idsCursos;
        } else {
            // Si hay cursos en la base de datos, retornar los IDs de los cursos existentes
            console.log("Utilizando los cursos existentes obtenidos de la base de datos.");
            return cursos.map(curso => curso.id_moodle);
        }
    } catch (error) {
        // Manejar errores
        console.error("Error al obtener los IDs de cursos:", error);
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
