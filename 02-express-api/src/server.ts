import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';

const PORT = process.env.PORT || 3000;

// HTTP sunucusunu oluştur
const server = http.createServer(app);

// Socket.IO sunucusunu başlat
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Socket.IO'yu Express uygulamasına bağla
app.set('io', io);

// Socket.IO olaylarını tanımla
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Sunucuyu başlat
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
