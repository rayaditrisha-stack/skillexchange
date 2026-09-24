import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new campus user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, campusName, skillsOffered, skillsNeeded } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (name, email, password).'
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this campus email already exists.'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      campusName: campusName || 'Campus Node',
      skillsOffered: skillsOffered || [],
      skillsNeeded: skillsNeeded || [],
      escrowCredits: 3, // 3 free credits upon signup
      reputationScore: 5.0
    });

    const token = generateToken(res, user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'Account created successfully! 3 Escrow Credits awarded.',
      token,
      user: userObj
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate campus user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
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
        message: 'Invalid campus email or password.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid campus email or password.'
      });
    }

    const token = generateToken(res, user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      token,
      user: userObj
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};
