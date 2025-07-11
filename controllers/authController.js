import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret';

export const signup = async (req, res) => {
    console.log('📝 [SIGNUP] Signup request received');
    console.log('📝 [SIGNUP] Request body:', { ...req.body, password: '[HIDDEN]' });
    
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ [SIGNUP] User already exists with email:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        console.log('✅ [SIGNUP] User created successfully:', { userId: user._id, email: user.email, role: user.role });

        const token = jwt.sign(
            { userId: user._id.toString(), role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log('🔑 [SIGNUP] JWT token generated:', {
            token: `${token.substring(0, 20)}...`,
            payload: { userId: user._id.toString(), role: user.role },
            expiresIn: '1d',
            JWT_SECRET: JWT_SECRET
        });

        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        console.log('❌ [SIGNUP] Server error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    console.log('🔐 [LOGIN] Login request received');
    console.log('🔐 [LOGIN] Request body:', { ...req.body, password: '[HIDDEN]' });
    
    try {
        const { email, password } = req.body;

        console.log('🔍 [LOGIN] Looking up user by email:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ [LOGIN] User not found with email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('🔍 [LOGIN] User found, verifying password...');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('❌ [LOGIN] Password mismatch for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('✅ [LOGIN] Password verified successfully for user:', { userId: user._id, email: user.email, role: user.role });

        const token = jwt.sign(
            { userId: user._id.toString(), role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log('🔑 [LOGIN] JWT token generated:', {
            token: `${token.substring(0, 20)}...`,
            payload: { userId: user._id.toString(), role: user.role },
            expiresIn: '1d',
            JWT_SECRET: JWT_SECRET
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.log('❌ [LOGIN] Server error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProfile = async (req, res) => {
    console.log('👤 [PROFILE] Get profile request received');
    console.log('👤 [PROFILE] User object:', req.user ? {
        userId: req.user._id,
        email: req.user.email,
        role: req.user.role
    } : 'No user object');
    
    try {
        if (!req.user) {
            console.log('❌ [PROFILE] No user object found');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        console.log('✅ [PROFILE] Returning user profile');
        res.json(req.user);
    } catch (err) {
        console.log('❌ [PROFILE] Server error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
