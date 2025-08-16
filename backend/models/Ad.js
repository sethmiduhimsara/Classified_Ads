const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String }
  },
  images: [{
    type: String // URLs to uploaded images
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    email: { type: String, required: true },
    phone: { type: String }
  },
  // Dynamic fields based on category
  vehicleDetails: {
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    mileage: { type: Number },
    fuelType: { type: String },
    transmission: { type: String },
    condition: { type: String }
  },
  propertyDetails: {
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    squareFeet: { type: Number },
    propertyType: { type: String },
    furnished: { type: Boolean, default: false }
  },
  jobDetails: {
    jobType: { type: String },
    experience: { type: String },
    salary: { type: String },
    company: { type: String }
  },
  petDetails: {
    breed: { type: String },
    age: { type: String },
    gender: { type: String },
    vaccinated: { type: Boolean, default: false },
    neutered: { type: Boolean, default: false }
  },
  expireIn: {
    type: String,
    enum: ['1 month', '3 months', '6 months', '1 year', 'Never'],
    default: '6 months'
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'deleted'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
adSchema.index({ title: 'text', description: 'text' });
adSchema.index({ category: 1, 'location.city': 1, status: 1 });

module.exports = mongoose.model('Ad', adSchema);
