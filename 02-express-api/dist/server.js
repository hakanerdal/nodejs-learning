"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3000;
// HTTP sunucusunu oluştur
const server = http_1.default.createServer(app_1.default);
// Socket.IO sunucusunu başlat
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
// Socket.IO'yu Express uygulamasına bağla
app_1.default.set('io', io);
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
