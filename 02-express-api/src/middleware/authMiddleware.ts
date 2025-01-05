import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
        req.user = decoded; // Kullanıcı bilgilerini `req.user` içine ekle
        next();
    } catch (err) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
        return;
    }
};
