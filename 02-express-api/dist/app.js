"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const items_1 = __importDefault(require("./routes/items"));
const users_1 = __importDefault(require("./routes/users"));
const db_1 = require("./utils/db");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware: JSON ayrıştırıcı
app.use(express_1.default.json());
// Statik dosyalar
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// `req.io` Middleware'i
app.use((req, res, next) => {
    req.io = req.app.get('io'); // `req.io` nesnesini ayarla
    next();
});
// Rotalar
app.use('/items', items_1.default);
app.use('/users', users_1.default);
// MongoDB Bağlantısı
(0, db_1.connectDB)('mongodb://localhost:27017/myapp');
exports.default = app;
