const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CLIENT_URL, // e.g. https://your-app.vercel.app
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Also allow any *.vercel.app preview deployments
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        version: '1.0.0',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        version: '1.0.0',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Root
app.get('/', (req, res) => {
    res.json({ message: 'Alumni Connect API is running ✅', version: '1.0.0' });
});

// API Routes
app.use('/api/auth/google', require('./routes/googleAuthRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/resumes', require('./routes/resumeReviewRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/competitions', require('./routes/competitionRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/payouts', require('./routes/payoutRoutes'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Database Connection + Server Start
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-connect');
        console.log('✅ MongoDB connected:', process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-connect');
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

start();
