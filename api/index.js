const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('../server/config/db');
const errorHandler = require('../server/middleware/errorHandler');
const User = require('../server/models/User');
const seedDatabase = require('../server/seed/seedData');

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Database middleware for serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    const count = await User.countDocuments();
    if (count === 0) {
      await seedDatabase();
    }
    next();
  } catch (err) {
    console.error('Database middleware error:', err);
    next(err);
  }
});

// Routes
app.use('/api/auth', require('../server/routes/authRoutes'));
app.use('/api/users', require('../server/routes/userRoutes'));
app.use('/api/swaps', require('../server/routes/swapRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'SkillMesh Vercel Serverless Engine v1.0', timestamp: new Date() });
});

app.use(errorHandler);

module.exports = app;
