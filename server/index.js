const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const seedDatabase = require('./seed/seedData');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  if (origin.endsWith('.vercel.app') || origin.includes('vercel.app')) return true;
  if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return true;
  return false;
};

app.use(cors({
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: '⚡ SkillMesh Campus Skill Exchange API Service is Live!',
    healthCheck: '/api/health',
    status: 'Operational'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'SkillMesh API Engine v1.0', timestamp: new Date() });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));

// Centralized error handler middleware
app.use(errorHandler);

// Start server and check database seeding
const startServer = async () => {
  await connectDB();

  const count = await User.countDocuments();
  if (count === 0) {
    console.log('[Server] No users detected in database. Triggering automatic seed...');
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`🚀 SkillMesh Backend Server running on http://localhost:${PORT}`);
    console.log(`🔒 Security: CORS configured with Credentials, JWT HTTPOnly Cookies enabled.`);
  });
};

startServer().catch(err => {
  console.error('[Server Error]: Failed to start server', err);
});
