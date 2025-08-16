const express = require('express');
const { body, validationResult } = require('express-validator');
const Ad = require('../models/Ad');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all ads with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      city,
      state,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };
    
    if (category) {
      // Handle category by name or slug
      const categoryDoc = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(category, 'i') } },
          { slug: { $regex: new RegExp(category, 'i') } }
        ]
      });
      
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }
    
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const ads = await Ad.find(filter)
      .populate('category', 'name slug')
      .populate('seller', 'name email phone')
      .sort(sort)
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
    console.error('Get ads error:', error);
    res.status(500).json({ message: 'Server error while fetching ads' });
  }
});

// Get single ad by ID
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'name email phone location');

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Increment view count
    ad.views += 1;
    await ad.save();

    res.json(ad);
  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({ message: 'Server error while fetching ad' });
  }
});

// Create new ad (protected route)
router.post('/', auth, [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').trim().isLength({ min: 20, max: 1000 }).withMessage('Description must be 20-1000 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isMongoId().withMessage('Valid category is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.state').trim().notEmpty().withMessage('State is required'),
  body('contact.email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const adData = {
      ...req.body,
      seller: req.user.userId
    };

    const ad = new Ad(adData);
    await ad.save();

    const populatedAd = await Ad.findById(ad._id)
      .populate('category', 'name slug')
      .populate('seller', 'name email');

    res.status(201).json({
      message: 'Ad created successfully',
      ad: populatedAd
    });
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({ message: 'Server error while creating ad' });
  }
});

// Update ad (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Check if user owns the ad
    if (ad.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this ad' });
    }

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.json({
      message: 'Ad updated successfully',
      ad: updatedAd
    });
  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({ message: 'Server error while updating ad' });
  }
});

// Delete ad (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Check if user owns the ad
    if (ad.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this ad' });
    }

    await Ad.findByIdAndDelete(req.params.id);

    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({ message: 'Server error while deleting ad' });
  }
});

module.exports = router;
