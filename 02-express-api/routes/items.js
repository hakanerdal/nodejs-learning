const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/authMiddleware');

// Get all items with pagination
router.get('/', protect, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { name } = req.query;
    const query = name ? { name: new RegExp(name, 'i') } : {};

    try {
        // Toplam öğe sayısını ve sayfalama parametrelerini hesapla
        const totalItems = await Item.countDocuments();
        const items = await Item.find(query)
            .limit(limit * 1) // Limit kadar öğe getir
            .skip((page - 1) * limit) // Sayfa başına öğeleri atla
            .sort({ name: 1 }) // 'name' alanına göre artan sıralama
            .exec();

        res.json({
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            items,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Add a new item
router.post('/', protect, async (req, res) => {
    const item = new Item({ name: req.body.name });
    try {
        const newItem = await item.save();
        req.io.emit('newItem', newItem); // req.io üzerinden emit
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an item
router.patch('/:id', protect, async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an item
router.delete('/:id', protect, async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
