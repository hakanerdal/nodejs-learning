import jwt from 'jsonwebtoken';
import User from '../models/User';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err: any) {
        res.status(400).json({
            message: 'Error registering user',
            error: err.message,
        });
    }
});

// Login
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.matchPassword(password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return; // İşlevi burada sonlandırın
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        next(err); // Hataları `next` ile yakalayın
    }
});


export default router;
