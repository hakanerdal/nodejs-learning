const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const jwt = require('jsonwebtoken');

// Test kullanıcı token'ı
const token = jwt.sign({ id: '12345', username: 'testuser' }, 'your_jwt_secret', { expiresIn: '1h' });

// Test öncesi veritabanını temizle ve verileri ekle
beforeAll(async () => {
    await Item.deleteMany({});
    await Item.insertMany([
        { name: 'Item A' },
        { name: 'Item B' },
        { name: 'Item C' },
        { name: 'Item D' },
        { name: 'Item E' },
    ]);
});

// Testlerden sonra MongoDB bağlantısını kapat
afterAll(async () => {
    await mongoose.connection.close();
});

describe('GET /items with pagination and filtering', () => {
    it('should return paginated items', async () => {
        const res = await request(app)
            .get('/items')
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 1, limit: 2 });

        expect(res.statusCode).toEqual(200);
        expect(res.body.items).toHaveLength(2);
    });

    it('should filter items by name', async () => {
        const res = await request(app)
            .get('/items')
            .set('Authorization', `Bearer ${token}`)
            .query({ name: 'Item A' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.items).toHaveLength(1);
        expect(res.body.items[0]).toHaveProperty('name', 'Item A');
    });

    it('should sort items by name in ascending order', async () => {
        const res = await request(app)
            .get('/items')
            .set('Authorization', `Bearer ${token}`)
            .query({ limit: 5 });

        expect(res.statusCode).toEqual(200);
        expect(res.body.items[0].name).toBe('Item A');
        expect(res.body.items[4].name).toBe('Item E');
    });

    it('should return 500 if server error occurs', async () => {
        jest.spyOn(Item, 'find').mockImplementation(() => {
            throw new Error('Database Error');
        });

        const res = await request(app)
            .get('/items')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Database Error');

        Item.find.mockRestore();
    });
});
