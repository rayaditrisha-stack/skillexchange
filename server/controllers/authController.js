const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to send JWT in httpOnly cookie & JSON response
const sendTokenResponse = (user, statusCode, res) => {
  const payload = { id: user._id, email: user.email, name: user.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'skillmesh_decentralized_campus_secret_key_2026_998877', {
    expiresIn: '7d'
  });

  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL;

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? 'none' : 'lax'
  };

  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userObj
    });
};

// @desc    Register new campus user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, skillsOffered, skillsNeeded, campusName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, campus email, and password are required.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const formattedSkillsNeeded = (skillsNeeded || []).map((s) =>
      typeof s === 'string' ? s : s.skillName || String(s)
    );

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      campusName: campusName || 'Campus Hub',
      skillsOffered: skillsOffered || [],
      skillsNeeded: formattedSkillsNeeded,
      escrowCredits: 3,
      reputationScore: 5.0
    });

    sendTokenResponse(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login campus user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL ? true : false,
    sameSite: process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL ? 'none' : 'lax'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};
