import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';

// Load env vars
dotenv.config();

console.log('🚀 [PROBLEM-SERVICE] Starting Problem Service...');
console.log('🔧 [PROBLEM-SERVICE] Environment variables loaded');
console.log('🔧 [PROBLEM-SERVICE] JWT_SECRET:', process.env.JWT_SECRET || 'your_jwt_secret');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173', 'http://localhost:5000', 'https://vibecode-ui-8z5x.vercel.app', 'https://vibecode-ui-dz9c.vercel.app', 'https://13.203.239.166'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 [PROBLEM-SERVICE] ${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log(`📨 [PROBLEM-SERVICE] Headers:`, JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📨 [PROBLEM-SERVICE] Body:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 [PROBLEM-SERVICE] Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'problem-service'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log('🔗 [PROBLEM-SERVICE] Connecting to MongoDB...');
console.log('🔗 [PROBLEM-SERVICE] MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ [PROBLEM-SERVICE] MongoDB connected successfully');
        app.listen(PORT, () => {
          console.log(`🚀 [PROBLEM-SERVICE] Server running on port ${PORT}`);
          console.log(`🔗 [PROBLEM-SERVICE] Health check: http://localhost:${PORT}/health`);
          console.log(`🔗 [PROBLEM-SERVICE] Auth endpoints: http://localhost:${PORT}/api/auth`);
          console.log(`🔗 [PROBLEM-SERVICE] Problem endpoints: http://localhost:${PORT}/api/problems`);
        });
    })
    .catch(err => {
        console.error('❌ [PROBLEM-SERVICE] MongoDB connection error:', err);
    });
