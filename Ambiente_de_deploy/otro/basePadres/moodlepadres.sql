-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS moodlepadres;

-- Usar la base de datos
USE moodlepadres;

-- Tabla para los padres
CREATE TABLE padre (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

-- Tabla para los alumnos
CREATE TABLE alumno (
  id_moodle BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_moodle)
);

-- Tabla intermedia para la relación muchos a muchos entre alumnos y padres
CREATE TABLE alumno_padre (
  alumno_id BIGINT NOT NULL,
  padre_id BIGINT NOT NULL,
  PRIMARY KEY (alumno_id, padre_id),
  CONSTRAINT fk_alumno_padre_alumno FOREIGN KEY (alumno_id) REFERENCES alumno (id_moodle),
  CONSTRAINT fk_alumno_padre_padre FOREIGN KEY (padre_id) REFERENCES padre (id)
);

-- Tabla para los cursos
CREATE TABLE curso (
  id_moodle BIGINT NOT NULL AUTO_INCREMENT,
  id_maestro BIGINT NOT NULL,
  nombreCurso VARCHAR(100) NOT NULL,
  nombreMaestro VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_moodle)
);

-- Tabla intermedia para la relación muchos a muchos entre alumnos y cursos
CREATE TABLE alumno_curso (
  alumno_id BIGINT NOT NULL,
  curso_id BIGINT NOT NULL,
  PRIMARY KEY (alumno_id, curso_id),
  CONSTRAINT fk_alumno_curso_alumno FOREIGN KEY (alumno_id) REFERENCES alumno (id_moodle),
  CONSTRAINT fk_alumno_curso_curso FOREIGN KEY (curso_id) REFERENCES curso (id_moodle),
  CONSTRAINT unique_alumno_curso UNIQUE (alumno_id, curso_id) -- Agregar una restricción de clave única
);