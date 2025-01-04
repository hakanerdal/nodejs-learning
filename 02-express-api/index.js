const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

let items = []; // Temporary in-memory storage

// Get all items
app.get('/items', (req, res) => {
    res.json(items);
});

// Add a new item
app.post('/items', (req, res) => {
    const { name } = req.body;
    const newItem = { id: items.length + 1, name };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Delete an item
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    items = items.filter(item => item.id !== parseInt(id));
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
