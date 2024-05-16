import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cluster from 'cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
        if (cluster.isPrimary) {
for (let i = 0; i < 2; i++) {
cluster.fork({
PORT: 3010 + i
        });
        }

setupPrimary();
} else {
const db = await open({
filename: 'chat.db',
        driver: sqlite3.Database
        });
        await db.exec(`
  
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT,
        room TEXT  -- Agregar la columna room
    );
`);
        const app = express();
        const server = createServer(app);
        const io = new Server(server, {
        connectionStateRecovery: {},
                adapter: createAdapter()
        });
        const __dirname = dirname(fileURLToPath(import.meta.url));
        app.get('/', (req, res) => {
        res.sendFile(join(__dirname, 'index.html'));
        });
        io.on('connection', async (socket) => {
        const colValue = socket.handshake.auth.col;
                const remValue = socket.handshake.auth.rem;
                const mensajeValue = socket.handshake.auth.mensaje;
                console.log(`Usuario conectado a la sala ${colValue}`);
                console.log(`mensaje ${mensajeValue}`);
                // Almacena el valor colValue en la instancia del socket
                socket.room = colValue;
                socket.join(colValue);
                socket.on('disconnect', () => {
                console.log(`Usuario desconectado de la sala ${colValue}`);
                });
                socket.on('message', async (msg, clientOffset, callback) => {
                let result;
                        try {
                        result = await db.run(`INSERT INTO messages (content, client_offset, room) VALUES (?, ?, ?)`, msg, clientOffset, colValue);
                                console.log(`Mensaje insertado en la sala ${colValue}: ${msg}`);
                        } catch (e) {
                if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
                callback();
                } else {
                console.error(`Error al insertar mensaje en la sala ${colValue}: ${e.message}`);
                }
                return;
                }
                io.to(colValue).emit('message', ${msg}`);
                        console.log(`Mensaje emitido en la sala ${colValue}: ${msg}`);
                        callback();
                });
                if (!socket.recovered) {
        try {
        // Recuperar mensajes solo de la sala específica almacenada en el socket
        await db.each('SELECT id, content FROM messages WHERE room = ? AND id > ?',
        [socket.room, socket.handshake.auth.serverOffset || 0],
                (_err, row) => {
        console.log("recuperado", row.content);
                socket.emit(socket.room, row.content, row.id);
        }
        );
        } catch (e) {
        console.error(`Error al recuperar mensajes de la sala ${colValue}: ${e.message}`);
                // Manejar el error según sea necesario
        }
        }
        });
        const port = process.env.PORT || 3010;
        server.listen(port, () => {
        console.log(`Servidor en ejecucion en http://localhost:${port}`);
        });
}