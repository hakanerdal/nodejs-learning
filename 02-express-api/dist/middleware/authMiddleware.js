"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'your_jwt_secret');
        req.user = decoded; // Kullanıcı bilgilerini `req.user` içine ekle
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
        return;
    }
};
exports.protect = protect;
