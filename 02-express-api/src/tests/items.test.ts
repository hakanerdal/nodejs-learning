import request from 'supertest';
import jwt from 'jsonwebtoken';
import { connectDB, disconnectDB } from '../utils/db';
import app from '../app';
import Item from '../models/Item';

// Test kullanıcı token'ı
const token = jwt.sign({ id: '12345', username: 'testuser' }, 'your_jwt_secret', { expiresIn: '1h' });

beforeAll(async () => {
    await connectDB('mongodb://localhost:27017/testdb'); // Test veritabanını bağla
    await Item.deleteMany({});
    await Item.insertMany([
        { name: 'Item A' },
        { name: 'Item B' },
        { name: 'Item C' },
    ]);
});

afterAll(async () => {
    await disconnectDB(); // Bağlantıyı kapat
});

describe('GET /items', () => {
    it('should return a list of items', async () => {
        const res = await request(app)
            .get('/items')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.status).toBe(200);
        expect(res.body.items).toBeInstanceOf(Array);
    });
});
