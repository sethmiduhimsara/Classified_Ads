const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentCategory', 'name slug')
      .sort({ order: 1, name: 1 });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

// Get subcategories by parent category ID
router.get('/:id/subcategories', async (req, res) => {
  try {
    const subcategories = await Category.find({ 
      parentCategory: req.params.id, 
      isActive: true 
    })
      .sort({ order: 1, name: 1 });

    res.json(subcategories);
  } catch (error) {
    console.error('Get subcategories error:', error);
    res.status(500).json({ message: 'Server error while fetching subcategories' });
  }
});

// Get main categories (no parent)
router.get('/main', async (req, res) => {
  try {
    const categories = await Category.find({ 
      parentCategory: null, 
      isActive: true 
    })
      .sort({ order: 1, name: 1 });

    res.json(categories);
  } catch (error) {
    console.error('Get main categories error:', error);
    res.status(500).json({ message: 'Server error while fetching main categories' });
  }
});

// Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
      .populate('parentCategory', 'name slug');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error while fetching category' });
  }
});

module.exports = router;
