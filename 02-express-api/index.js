const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('express').json;
const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(bodyParser());

// Database Connection
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Routes
app.use('/items', itemRoutes);
app.use('/users', userRoutes);

// Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
