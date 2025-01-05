"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../utils/db");
const app_1 = __importDefault(require("../app"));
const Item_1 = __importDefault(require("../models/Item"));
// Test kullanıcı token'ı
const token = jsonwebtoken_1.default.sign({ id: '12345', username: 'testuser' }, 'your_jwt_secret', { expiresIn: '1h' });
beforeAll(async () => {
    await (0, db_1.connectDB)('mongodb://localhost:27017/testdb'); // Test veritabanını bağla
    await Item_1.default.deleteMany({});
    await Item_1.default.insertMany([
        { name: 'Item A' },
        { name: 'Item B' },
        { name: 'Item C' },
    ]);
});
afterAll(async () => {
    await (0, db_1.disconnectDB)(); // Bağlantıyı kapat
});
describe('GET /items', () => {
    it('should return a list of items', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/items')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.items).toBeInstanceOf(Array);
    });
});
