const Item = require('./models/Item');
const { body, validationResult } = require('express-validator');
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Get all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new item
app.post('/items', async (req, res) => {
    const item = new Item({ name: req.body.name });
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an item
app.delete('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Update an item
app.patch('/items/:id', 
    // Validation middleware
    body('name').notEmpty().withMessage('Name is required'),
    body('name').isString().withMessage('Name must be a string'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedItem = await Item.findByIdAndUpdate(
                req.params.id, // Item ID
                req.body,      // Updated data
                { new: true }  // Return the updated document
            );
            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json(updatedItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});