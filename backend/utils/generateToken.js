import jwt from 'jsonwebtoken';

/**
 * Generate JWT token & set httpOnly cookie on response
 * @param {Response} res Express response object
 * @param {string} userId MongoDB User ID
 * @returns {string} JWT Token
 */
const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'skillmesh_decentralized_campus_secret_key_2026_998877';
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: '7d'
  });

  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL;

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

export default generateToken;
