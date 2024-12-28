import jwt from 'jsonwebtoken';
import user from '../Modals/user.js';

// Middleware to validate token and user authentication
const isValidUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ status: { code: 400, message: 'Access denied, no token provided.', }, data: [] });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = await user.findById(decoded.id).select('-password'); // Attach user to request
    if (!req.user) return res.status(401).json({ status: { code: 400, message: 'user not found', }, data: [] });
    next();
  } catch (err) {
    res.status(403).json({ status: { code: 400, message: 'Invalid or expired token.', }, data: [] });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ status: { code: 400, message: 'Access denied, admin only.', }, data: [] });
  }
};

 const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = await user.findById(decoded.id);

    if (!User || User.currentToken !== token) {
      return res.status(403).json({ message: 'Invalid or expired token. Please log in again.' });
    }

    req.user = User;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired. Please log in again.' });
    }
    res.status(500).json({ message: 'Invalid token.' });
  }
};

export { isValidUser, isAdmin, verifyToken };
