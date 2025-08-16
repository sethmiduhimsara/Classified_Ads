import React from 'react';
import { Link } from 'react-router-dom';

const CategoryDetailView = ({ category, subcategories }) => {
  // Define the category data structure based on the image
  const categoryData = {
    'vehicles': {
      icon: '🚗',
      color: 'bg-green-500',
      subcategories: [
        'Aircraft', 'Automotive Items & Parts', 'Boats & Watercraft', 'Cars', 
        'Classic Cars', 'Commercial Trucks', 'Motorcycles', 'Off Road Vehicles', 
        'RV & Motorhomes', 'SUVs', 'Trucks', 'Utility & Work Trailers', 'Vans', 'Vehicles Wanted'
      ]
    },
    'services': {
      icon: '🔧',
      color: 'bg-orange-500',
      subcategories: [
        'Automotive Services', 'Beauty & Salon Services', 'Caregivers & Baby Sitting', 
        'Cleaning Services', 'Construction & Remodeling', 'Financial Services', 
        'Health & Wellness', 'Home Services', 'Insurance', 'Lawn & Garden Services', 
        'Legal Services', 'Marketing Services', 'Moving & Storage', 'Office Services', 
        'Real Estate Services', 'Training & Education Services', 'Web Design & Tech', 
        'Weddings & Photography'
      ]
    },
    'for-rent': {
      icon: '🏢',
      color: 'bg-blue-600',
      subcategories: [
        'Apartments', 'Commercial Lease', 'Condos For Rent', 'Houses For Rent', 
        'Housing Wanted', 'Mobile Homes For Rent', 'Roommates', 'Townhomes For Rent', 
        'Vacation Homes'
      ]
    },
    'real-estate': {
      icon: '🏠',
      color: 'bg-green-500',
      subcategories: [
        'Commercial Real Estate', 'Condos For Sale', 'Farms & Ranches', 'Homes For Sale', 
        'Land For Sale', 'Manufactured Homes', 'Other Real Estate', 'Real Estate Services', 
        'Time Shares', 'Townhomes For Sale', 'Vacation Homes'
      ]
    },
    'community': {
      icon: '👥',
      color: 'bg-blue-600',
      subcategories: [
        'Announcements', 'Carpool', 'Churches', 'Free Stuff', 'Garage Sales', 
        'General Entertainment', 'Items Wanted', 'Lost & Found', 'Musicians & Bands', 'Volunteers'
      ]
    },
    'pets': {
      icon: '🐾',
      color: 'bg-orange-500',
      subcategories: [
        'Birds', 'Cats', 'Dogs', 'Fish & Reptile Pets', 'Free Pets to Good Home', 
        'Horses', 'Livestock', 'Other Pets', 'Pet Services & Stores', 'Pet Supplies', 
        'Pets Lost & Found', 'Pets Wanted'
      ]
    },
    'jobs': {
      icon: '💼',
      color: 'bg-orange-500',
      subcategories: [
        'Accounting & Bookkeeping Jobs', 'Business Opportunities', 'Cleaning Jobs', 
        'Construction Work', 'Creative Jobs', 'Educational Jobs', 'Financial & Real Estate Jobs', 
        'Internships', 'IT Jobs', 'Labor Jobs', 'Legal Jobs', 'Management Jobs', 
        'Marketing Jobs', 'Medical Jobs', 'Office Jobs', 'Other Jobs', 'People Seeking Jobs', 
        'Restaurant Jobs', 'Retail Jobs', 'Sales Jobs', 'Science & Engineering Jobs', 
        'Security & Safety Jobs', 'Skilled Trade Jobs', 'Transportation Jobs'
      ]
    },
    'items-for-sale': {
      icon: '🛒',
      color: 'bg-blue-400',
      subcategories: [
        'Appliances', 'Art & Crafts', 'Automotive Items & Parts', 'Bicycles', 
        'Books & Magazines', 'Cell Phones', 'Clothing & Apparel', 'Collectibles', 
        'Computers & Electronics', 'Farm & Ranch', 'Games', 'Health & Beauty Items', 
        'Heavy Equipment', 'Hobbies', 'Household & Furniture', 'Jewelry', 'Kids Stuff', 
        'Lawn & Garden', 'Mattresses', 'Miscellaneous Items', 'Movies & DVDs', 
        'Music & CDs', 'Musical Instruments', 'Office & Business', 'Sports Equipment', 
        'Tickets', 'Tools'
      ]
    }
  };

  // Get category info based on category name or slug
  const getCategoryInfo = (category) => {
    const categoryName = category?.name?.toLowerCase().replace(/\s+/g, '-') || 
                        category?.slug?.toLowerCase() || '';
    
    return categoryData[categoryName] || {
      icon: '📁',
      color: 'bg-gray-500',
      subcategories: subcategories?.map(sub => sub.name) || []
    };
  };

  const categoryInfo = getCategoryInfo(category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find exactly what you're looking for in our organized categories
        </p>
      </div>

      {/* Category Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - 2 categories */}
        <div className="lg:col-span-2 space-y-8">
          {Object.entries(categoryData).slice(0, 2).map(([key, data]) => (
            <CategorySection key={key} categoryKey={key} data={data} />
          ))}
        </div>

        {/* Middle Column - 3 categories */}
        <div className="lg:col-span-2 space-y-8">
          {Object.entries(categoryData).slice(2, 5).map(([key, data]) => (
            <CategorySection key={key} categoryKey={key} data={data} />
          ))}
        </div>

        {/* Right Column - 3 categories */}
        <div className="lg:col-span-1 space-y-8">
          {Object.entries(categoryData).slice(5).map(([key, data]) => (
            <CategorySection key={key} categoryKey={key} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({ categoryKey, data }) => {
  const categoryName = categoryKey.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Category Header */}
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 ${data.color} rounded-full flex items-center justify-center text-white text-xl mr-4`}>
          {data.icon}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{categoryName}</h2>
      </div>

      {/* Subcategories List */}
      <div className="space-y-2">
                 {data.subcategories.map((subcategory, index) => (
           <Link
             key={index}
             to={`/category/${categoryKey}?subcategory=${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
             className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors text-sm"
           >
             {subcategory}
           </Link>
         ))}
      </div>
    </div>
  );
};

export default CategoryDetailView; 