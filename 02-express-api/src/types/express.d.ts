import { JwtPayload } from 'jsonwebtoken';
import { Server as IOServer } from 'socket.io';

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload; // JWT'den dönen kullanıcı bilgileri
            io?: IOServer; // Socket.IO sunucusu
        }
    }
}
