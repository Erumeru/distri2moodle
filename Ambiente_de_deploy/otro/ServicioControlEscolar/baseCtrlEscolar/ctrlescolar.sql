-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ctrlescolar;

-- Usar la base de datos ctrlescolar
USE ctrlescolar;

-- Crear la tabla curso
CREATE TABLE IF NOT EXISTS curso (
    id_moodle BIGINT PRIMARY KEY
);