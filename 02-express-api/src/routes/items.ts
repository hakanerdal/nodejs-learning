import { Router, Request, Response } from 'express';
import Item from '../models/Item';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Get all items with pagination
router.get('/', protect, async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const name = req.query.name as string;
    const query = name ? { name: new RegExp(name, 'i') } : {};

    try {
        // Toplam öğe sayısını ve sayfalama parametrelerini hesapla
        const totalItems = await Item.countDocuments(query);
        const items = await Item.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ name: 1 });

        res.json({
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            items,
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new item
router.post('/', protect, async (req: Request, res: Response) => {
    const item = new Item({ name: req.body.name });
    console.log('req.io:', req.io); // Log ile kontrol edin
    try {
        const newItem = await item.save();
        if (req.io) {
            console.log('Emitting newItem event:', newItem); // Log ekleyin
            req.io.emit('newItem', newItem); // req.io üzerinden emit
        }
        res.status(201).json(newItem);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Update an item
router.patch('/:id', protect, async (req: Request, res: Response) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            res.status(404).json({ message: 'Item not found' });
            return; // İşlevi açıkça sonlandır
        }
        res.json(updatedItem);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an item
router.delete('/:id', protect, async (req: Request, res: Response) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
