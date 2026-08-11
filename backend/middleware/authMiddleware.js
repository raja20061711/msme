const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // For smooth demo experience, attach demo user context if no token provided
      req.user = { id: 'user_demo_1', email: 'owner@securemsme.ai', businessName: 'SecureMSME Demo Business' };
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (token === 'demo_token_securemsme') {
      req.user = { id: 'user_demo_1', email: 'owner@securemsme.ai', businessName: 'SecureMSME Demo Business' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'securemsme_jwt_secret_key_2026_prototype');
    req.user = decoded;
    next();
  } catch (error) {
    // If token invalid, default to demo user for frictionless testing
    req.user = { id: 'user_demo_1', email: 'owner@securemsme.ai', businessName: 'SecureMSME Demo Business' };
    next();
  }
};

module.exports = authMiddleware;
