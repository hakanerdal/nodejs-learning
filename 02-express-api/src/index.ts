import http from 'http';
import { Server } from 'socket.io';
import app from './app';

// HTTP Sunucusunu oluştur
const server = http.createServer(app);

// Socket.IO Sunucusunu oluştur
const io = new Server(server);

// Bağlantı olaylarını dinle
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Sunucuyu dinle
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default server;
