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

module.exports = {
    getProfesores: getProfesores,
    obtenerIdsCursos: obtenerIdsCursos
};