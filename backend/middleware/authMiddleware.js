import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing. Please log in.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'skillmesh_decentralized_campus_secret_key_2026_998877';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('[AuthMiddleware Error]:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or token expired.'
    });
  }
};
