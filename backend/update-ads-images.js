const mongoose = require('mongoose');
const Ad = require('./models/Ad');

const placeholderImages = [];

const updateAdsImages = async () => {
  try {
    // Connect to MongoDB
    const uri = "mongodb+srv://kpramudi2002:pramudi2002@cluster0.14j6u.mongodb.net/ads";
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    console.log('Connected to MongoDB');
    
    // Find all ads without images or with empty images array
    const adsToUpdate = await Ad.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: null }
      ]
    });
    
    console.log(`Found ${adsToUpdate.length} ads to update`);
    
    // Update each ad with placeholder images
    for (const ad of adsToUpdate) {
      await Ad.findByIdAndUpdate(ad._id, {
        $set: { images: placeholderImages }
      });
      console.log(`Updated ad: ${ad.title}`);
    }
    
    console.log('All ads updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating ads:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  updateAdsImages();
}

module.exports = updateAdsImages;
