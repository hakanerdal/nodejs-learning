const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB Bağlantısı
mongoose.connect('mongodb://localhost:27017/myapp')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Rotalar
const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/users');
app.use('/items', itemRoutes);
app.use('/users', userRoutes);

module.exports = app;
