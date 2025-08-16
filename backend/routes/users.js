const express = require('express');
const User = require('../models/User');
const Ad = require('../models/Ad');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile (protected route)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Get user's ads (protected route)
router.get('/my-ads', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const skip = (page - 1) * limit;

    const filter = { seller: req.user.userId };
    if (status !== 'all') {
      filter.status = status;
    }

    const ads = await Ad.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Ad.countDocuments(filter);

    res.json({
      ads,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get user ads error:', error);
    res.status(500).json({ message: 'Server error while fetching user ads' });
  }
});

// Update user profile (protected route)
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, location, avatar } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, location, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

module.exports = router;
