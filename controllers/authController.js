const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        const token = jwt.sign(
            { userId: user._id.toString(), role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id.toString(), role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        res.json(req.user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
