import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import User from './models/User.js';
import { seedDatabase } from './scripts/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS request blocked'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(cookieParser());

// Root welcome route for browser checks & health monitors
app.get('/', (req, res) => {
  res.status(200).json({
    message: '⚡ SkillMesh Decentralized Campus Protocol API Service is Live!',
    healthCheck: '/api/health',
    status: 'Operational',
    endpoints: {
      auth: '/api/auth',
      swaps: '/api/swaps',
      matches: '/api/matches'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'SkillMesh Dedicated Backend v1.0', timestamp: new Date() });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/matches', matchRoutes);

// Centralized Error Handling
app.use(notFound);
app.use(errorHandler);

// Bootstrap Server & Check Auto-Seed
const startServer = async () => {
  await connectDB();

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('[Server] Database empty. Auto-seeding 5 campus users...');
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`🚀 SkillMesh Dedicated Backend running on http://localhost:${PORT}`);
    console.log(`🔒 Security: CORS configured with Credentials, JWT HTTPOnly Cookies active.`);
  });
};

startServer().catch(err => {
  console.error('[Server Bootstrap Error]:', err);
});
