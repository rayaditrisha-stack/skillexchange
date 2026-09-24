const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const seedDatabase = require('./seed/seedData');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for httpOnly cookies
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
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

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'SkillMesh API Engine v1.0', timestamp: new Date() });
});

// Centralized error handler middleware
app.use(errorHandler);

// Start server and check database seeding
const startServer = async () => {
  await connectDB();

  // Auto-seed if database is empty
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
