"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const express_1 = require("express");
const router = (0, express_1.Router)();
// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User_1.default({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        res.status(400).json({
            message: 'Error registering user',
            error: err.message,
        });
    }
});
// Login
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User_1.default.findOne({ username });
        if (!user || !(await user.matchPassword(password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return; // İşlevi burada sonlandırın
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (err) {
        next(err); // Hataları `next` ile yakalayın
    }
});
exports.default = router;
