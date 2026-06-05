const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied: Admins only');
  }
  next();
};

const staffOnly = (req, res, next) => {
  if (!['admin', 'receptionist'].includes(req.user?.role)) {
    res.status(403);
    throw new Error('Access denied: Staff only');
  }
  next();
};

module.exports = { protect, adminOnly, staffOnly };
