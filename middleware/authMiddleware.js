import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = 'your_jwt_secret';

// Auth middleware: verifies JWT and attaches user to req
export const authenticate = async (req, res, next) => {
    console.log('🔐 [AUTH] Authentication middleware triggered');
    console.log('🔐 [AUTH] Request headers:', JSON.stringify(req.headers, null, 2));
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ [AUTH] No valid authorization header found');
        console.log('❌ [AUTH] Auth header:', authHeader);
        return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('🔑 [AUTH] Extracted token:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('🔑 [AUTH] JWT_SECRET being used:', JWT_SECRET);
    
    try {
        console.log('🔍 [AUTH] Attempting to verify JWT token...');
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ [AUTH] JWT token verified successfully');
        console.log('🔍 [AUTH] Decoded token payload:', JSON.stringify(decoded, null, 2));
        
        console.log('🔍 [AUTH] Looking up user in database...');
        req.user = await User.findById(decoded.userId).select('-password');
        
        if (!req.user) {
            console.log('❌ [AUTH] User not found in database for userId:', decoded.userId);
            return res.status(401).json({ message: 'User not found' });
        }
        
        console.log('✅ [AUTH] User found and attached to request:', {
            userId: req.user._id,
            email: req.user.email,
            role: req.user.role
        });
        
        next();
    } catch (err) {
        console.log('❌ [AUTH] JWT verification failed');
        console.log('❌ [AUTH] Error details:', err.message);
        console.log('❌ [AUTH] Error stack:', err.stack);
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Admin middleware: only allows admin users
export const requireAdmin = (req, res, next) => {
    console.log('👑 [ADMIN] Admin middleware triggered');
    console.log('👑 [ADMIN] User object:', req.user ? {
        userId: req.user._id,
        role: req.user.role
    } : 'No user object');
    
    if (req.user && req.user.role === 'admin') {
        console.log('✅ [ADMIN] Admin access granted');
        next();
    } else {
        console.log('❌ [ADMIN] Admin access denied');
        res.status(403).json({ message: 'Admin access required' });
    }
};
