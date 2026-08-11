const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsFallback, getMemoryStore } = require('../config/db');

const register = async (req, res) => {
  try {
    const { businessName, ownerName, email, phone, password } = req.body;

    if (!businessName || !ownerName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required registration fields.' });
    }

    if (getIsFallback()) {
      const store = getMemoryStore();
      const existing = store.users.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User account with this email already exists.' });
      }
      const newUser = {
        _id: 'user_' + Date.now(),
        businessName,
        ownerName,
        email: email.toLowerCase(),
        phone: phone || '',
        createdAt: new Date().toISOString()
      };
      store.users.push(newUser);

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, businessName: newUser.businessName },
        process.env.JWT_SECRET || 'securemsme_jwt_secret_key_2026_prototype',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: newUser
      });
    }

    let existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      businessName,
      ownerName,
      email: email.toLowerCase(),
      phone: phone || '',
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, businessName: user.businessName },
      process.env.JWT_SECRET || 'securemsme_jwt_secret_key_2026_prototype',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        businessName: user.businessName,
        ownerName: user.ownerName,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('[Auth Register Error]:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Demo shortcut credential check
    if (email === 'owner@securemsme.ai' || email === 'demo@msme.com') {
      const demoUser = {
        id: 'user_demo_1',
        businessName: 'SecureMSME Demo Enterprise',
        ownerName: 'Rahul Sharma',
        email: email,
        phone: '+91 98765 43210'
      };
      const token = jwt.sign(
        { id: demoUser.id, email: demoUser.email, businessName: demoUser.businessName },
        process.env.JWT_SECRET || 'securemsme_jwt_secret_key_2026_prototype',
        { expiresIn: '7d' }
      );
      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: demoUser
      });
    }

    if (getIsFallback()) {
      const store = getMemoryStore();
      const user = store.users.find(u => u.email === email.toLowerCase());
      const demoUser = user || {
        id: 'user_demo_1',
        businessName: 'SecureMSME Demo Business',
        ownerName: 'Business Owner',
        email: email,
        phone: '+91 98765 43210'
      };
      const token = jwt.sign(
        { id: demoUser.id, email: demoUser.email, businessName: demoUser.businessName },
        process.env.JWT_SECRET || 'securemsme_jwt_secret_key_2026_prototype',
        { expiresIn: '7d' }
      );
      return res.json({
        success: true,
        message: 'Login successful (Demo mode).',
        token,
        user: demoUser
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, businessName: user.businessName },
      process.env.JWT_SECRET || 'securemsme_jwt_secret_key_2026_prototype',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        businessName: user.businessName,
        ownerName: user.ownerName,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user profile.' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
