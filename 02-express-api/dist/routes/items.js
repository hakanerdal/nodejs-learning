"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Item_1 = __importDefault(require("../models/Item"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all items with pagination
router.get('/', authMiddleware_1.protect, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name;
    const query = name ? { name: new RegExp(name, 'i') } : {};
    try {
        // Toplam öğe sayısını ve sayfalama parametrelerini hesapla
        const totalItems = await Item_1.default.countDocuments(query);
        const items = await Item_1.default.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ name: 1 });
        res.json({
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            items,
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Add a new item
router.post('/', authMiddleware_1.protect, async (req, res) => {
    const item = new Item_1.default({ name: req.body.name });
    console.log('req.io:', req.io); // Log ile kontrol edin
    try {
        const newItem = await item.save();
        if (req.io) {
            console.log('Emitting newItem event:', newItem); // Log ekleyin
            req.io.emit('newItem', newItem); // req.io üzerinden emit
        }
        res.status(201).json(newItem);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Update an item
router.patch('/:id', authMiddleware_1.protect, async (req, res) => {
    try {
        const updatedItem = await Item_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            res.status(404).json({ message: 'Item not found' });
            return; // İşlevi açıkça sonlandır
        }
        res.json(updatedItem);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Delete an item
router.delete('/:id', authMiddleware_1.protect, async (req, res) => {
    try {
        await Item_1.default.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
