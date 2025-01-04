const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

module.exports = { protect };
