import express, { Application, Request, Response, NextFunction } from 'express';
import itemRoutes from './routes/items';
import userRoutes from './routes/users';
import { connectDB } from './utils/db';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';

const app: Application = express();

// Middleware: JSON ayrıştırıcı
app.use(express.json());

// Statik dosyalar
app.use(express.static(path.join(__dirname, 'public')));

// `req.io` Middleware'i
app.use((req: Request, res: Response, next: NextFunction) => {
    req.io = req.app.get('io'); // `req.io` nesnesini ayarla
    next();
});

// Rotalar
app.use('/items', itemRoutes);
app.use('/users', userRoutes);

// MongoDB Bağlantısı
connectDB('mongodb://localhost:27017/myapp');

export default app;
