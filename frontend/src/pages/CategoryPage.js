import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Search, Filter, MapPin, Calendar, Eye, Heart, Car, Home as HomeIcon, Briefcase, Users, ShoppingBag, Gamepad2 } from 'lucide-react';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    subcategory: searchParams.get('subcategory') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Category data structure based on the image
  const categoryData = {
    'vehicles': {
      icon: Car,
      color: 'bg-green-500',
      title: 'Vehicles Categories',
      subcategories: [
        'Aircraft', 'Automotive Items & Parts', 'Boats & Watercraft', 'Cars', 
        'Classic Cars', 'Commercial Trucks', 'Motorcycles', 'Off Road Vehicles', 
        'RV & Motorhomes', 'SUVs', 'Trucks', 'Utility & Work Trailers', 'Vans', 'Vehicles Wanted'
      ],
      filterOptions: {
        make: ['All', 'Honda', 'Toyota', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Chevrolet', 'Dodge', 'Jeep', 'Nissan', 'Mazda', 'Subaru', 'Lexus', 'Acura', 'Infiniti', 'Buick', 'Cadillac', 'Lincoln', 'Chrysler', 'Plymouth', 'Pontiac', 'Saturn', 'Scion', 'Suzuki', 'Mitsubishi', 'Hyundai', 'Kia', 'Genesis', 'Fiat', 'Alfa Romeo', 'Jaguar', 'Land Rover', 'Mini', 'Smart', 'Ferrari', 'Lamborghini', 'Porsche', 'Aston Martin', 'Bentley', 'Rolls-Royce', 'McLaren', 'Bugatti', 'Koenigsegg', 'Pagani', 'Rimac', 'Lotus', 'Caterham', 'Ariel', 'Noble', 'Gumpert', 'Spyker', 'Donkervoort', 'Wiesmann', 'RUF', 'Brabus', 'AMG', 'M', 'RS', 'S', 'GT', 'GTS', 'GTR', 'Type R', 'ST', 'RS', 'GTI', 'R', 'S', 'SE', 'LE', 'XLE', 'Limited', 'Touring', 'Sport', 'Premium', 'Platinum', 'Signature', 'Ultimate', 'Exclusive', 'Elite', 'Prestige', 'Luxury', 'Deluxe', 'Executive', 'Professional', 'Business', 'Commercial', 'Utility', 'Work', 'Heavy', 'Light', 'Medium', 'Small', 'Compact', 'Midsize', 'Full-size', 'Large', 'Extra Large', 'Mini', 'Micro', 'Nano', 'Pico', 'Femto', 'Atto', 'Zepto', 'Yocto', 'Ronto', 'Quecto', 'Other'],
        yearRange: { min: 1900, max: 2024 },
        priceRange: { min: 0, max: 1000000 }
      }
    },
    'services': {
      icon: Gamepad2,
      color: 'bg-orange-500',
      title: 'Services Categories',
      subcategories: [
        'Automotive Services', 'Beauty & Salon Services', 'Caregivers & Baby Sitting', 
        'Cleaning Services', 'Construction & Remodeling', 'Financial Services', 
        'Health & Wellness', 'Home Services', 'Insurance', 'Lawn & Garden Services', 
        'Legal Services', 'Marketing Services', 'Moving & Storage', 'Office Services', 
        'Real Estate Services', 'Training & Education Services', 'Web Design & Tech', 
        'Weddings & Photography'
      ],
      filterOptions: {
        serviceType: ['All', 'Professional', 'Personal', 'Business', 'Home', 'Automotive', 'Health', 'Beauty', 'Legal', 'Financial', 'Educational', 'Technical', 'Creative', 'Physical', 'Mental', 'Emotional', 'Spiritual', 'Social', 'Environmental', 'Cultural', 'Political', 'Economic', 'Scientific', 'Artistic', 'Musical', 'Theatrical', 'Literary', 'Culinary', 'Athletic', 'Recreational', 'Therapeutic', 'Preventive', 'Curative', 'Palliative', 'Diagnostic', 'Surgical', 'Medical', 'Dental', 'Veterinary', 'Pharmaceutical', 'Nutritional', 'Fitness', 'Wellness', 'Spa', 'Salon', 'Barber', 'Massage', 'Acupuncture', 'Chiropractic', 'Physical Therapy', 'Occupational Therapy', 'Speech Therapy', 'Respiratory Therapy', 'Radiation Therapy', 'Chemotherapy', 'Immunotherapy', 'Gene Therapy', 'Stem Cell Therapy', 'Regenerative Medicine', 'Alternative Medicine', 'Traditional Medicine', 'Western Medicine', 'Eastern Medicine', 'Indigenous Medicine', 'Folk Medicine', 'Herbal Medicine', 'Homeopathic Medicine', 'Naturopathic Medicine', 'Osteopathic Medicine', 'Podiatric Medicine', 'Optometric Medicine', 'Audiology', 'Psychology', 'Psychiatry', 'Counseling', 'Therapy', 'Coaching', 'Mentoring', 'Tutoring', 'Teaching', 'Training', 'Consulting', 'Advisory', 'Coaching', 'Mentoring', 'Tutoring', 'Teaching', 'Training', 'Consulting', 'Advisory', 'Other'],
        yearRange: { min: 1900, max: 2024 },
        priceRange: { min: 0, max: 10000 }
      }
    },
    'for-rent': {
      icon: HomeIcon,
      color: 'bg-blue-600',
      title: 'For Rent Categories',
      subcategories: [
        'Apartments', 'Commercial Lease', 'Condos For Rent', 'Houses For Rent', 
        'Housing Wanted', 'Mobile Homes For Rent', 'Roommates', 'Townhomes For Rent', 
        'Vacation Homes'
      ],
      filterOptions: {
        propertyType: ['All', 'Apartment', 'House', 'Condo', 'Townhouse', 'Mobile Home', 'Commercial', 'Office', 'Retail', 'Industrial', 'Warehouse', 'Land', 'Farm', 'Ranch', 'Cabin', 'Cottage', 'Villa', 'Mansion', 'Penthouse', 'Studio', 'Loft', 'Duplex', 'Triplex', 'Fourplex', 'Room', 'Shared Room', 'Private Room', 'Entire Place', 'Shared Place', 'Other'],
        yearRange: { min: 1900, max: 2024 },
        priceRange: { min: 0, max: 50000 }
      }
    },
    'real-estate': {
      icon: HomeIcon,
      color: 'bg-green-500',
      title: 'Real Estate Categories',
      subcategories: [
        'Commercial Real Estate', 'Condos For Sale', 'Farms & Ranches', 'Homes For Sale', 
        'Land For Sale', 'Manufactured Homes', 'Other Real Estate', 'Real Estate Services', 
        'Time Shares', 'Townhomes For Sale', 'Vacation Homes'
      ],
      filterOptions: {
        propertyType: ['All', 'House', 'Condo', 'Townhouse', 'Mobile Home', 'Commercial', 'Office', 'Retail', 'Industrial', 'Warehouse', 'Land', 'Farm', 'Ranch', 'Cabin', 'Cottage', 'Villa', 'Mansion', 'Penthouse', 'Studio', 'Loft', 'Duplex', 'Triplex', 'Fourplex', 'Room', 'Shared Room', 'Private Room', 'Entire Place', 'Shared Place', 'Other'],
        yearRange: { min: 1900, max: 2024 },
        priceRange: { min: 0, max: 10000000 }
      }
    },
    'community': {
      icon: Users,
      color: 'bg-blue-600',
      title: 'Community Categories',
      subcategories: [
        'Announcements', 'Carpool', 'Churches', 'Free Stuff', 'Garage Sales', 
        'General Entertainment', 'Items Wanted', 'Lost & Found', 'Musicians & Bands', 'Volunteers'
      ],
      filterOptions: {
        communityType: ['All', 'Event', 'Activity', 'Group', 'Club', 'Organization', 'Charity', 'Volunteer', 'Community', 'Social', 'Religious', 'Spiritual', 'Cultural', 'Educational', 'Recreational', 'Sports', 'Fitness', 'Health', 'Wellness', 'Business', 'Professional', 'Networking', 'Support', 'Help', 'Service', 'Other'],
        yearRange: { min: 1900, max: 2024 },
        priceRange: { min: 0, max: 10000 }
      }
    },
    'pets': {
      icon: Heart,
      color: 'bg-orange-500',
      title: 'Pets Categories',
      subcategories: [
        'Birds', 'Cats', 'Dogs', 'Fish & Reptile Pets', 'Free Pets to Good Home', 
        'Horses', 'Livestock', 'Other Pets', 'Pet Services & Stores', 'Pet Supplies', 
        'Pets Lost & Found', 'Pets Wanted'
      ],
      filterOptions: {
        petType: ['All', 'Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Amphibian', 'Rodent', 'Rabbit', 'Horse', 'Livestock', 'Exotic', 'Other'],
        yearRange: { min: 1900, max: 2024 },
        priceRange: { min: 0, max: 10000 }
      }
    },
    'jobs': {
      icon: Briefcase,
      color: 'bg-orange-500',
      title: 'Jobs Categories',
      subcategories: [
        'Accounting & Bookkeeping Jobs', 'Business Opportunities', 'Cleaning Jobs', 
        'Construction Work', 'Creative Jobs', 'Educational Jobs', 'Financial & Real Estate Jobs', 
        'Internships', 'IT Jobs', 'Labor Jobs', 'Legal Jobs', 'Management Jobs', 
        'Marketing Jobs', 'Medical Jobs', 'Office Jobs', 'Other Jobs', 'People Seeking Jobs', 
        'Restaurant Jobs', 'Retail Jobs', 'Sales Jobs', 'Science & Engineering Jobs', 
        'Security & Safety Jobs', 'Skilled Trade Jobs', 'Transportation Jobs'
      ],
      filterOptions: {
        jobType: ['All', 'Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Freelance', 'Remote', 'On-site', 'Hybrid', 'Entry-level', 'Mid-level', 'Senior', 'Executive', 'Management', 'Leadership', 'Technical', 'Non-technical', 'Creative', 'Analytical', 'Administrative', 'Customer Service', 'Sales', 'Marketing', 'Finance', 'Accounting', 'Legal', 'Medical', 'Education', 'Engineering', 'IT', 'Design', 'Writing', 'Translation', 'Teaching', 'Training', 'Consulting', 'Research', 'Development', 'Production', 'Manufacturing', 'Construction', 'Transportation', 'Logistics', 'Healthcare', 'Wellness', 'Fitness', 'Beauty', 'Food', 'Beverage', 'Hospitality', 'Tourism', 'Entertainment', 'Media', 'Publishing', 'Journalism', 'Broadcasting', 'Film', 'Television', 'Radio', 'Music', 'Art', 'Photography', 'Fashion', 'Retail', 'E-commerce', 'Technology', 'Software', 'Hardware', 'Internet', 'Telecommunications', 'Energy', 'Utilities', 'Environment', 'Sustainability', 'Government', 'Non-profit', 'Charity', 'Volunteer', 'Other'],
        yearRange: { min: 1900, max: 2024 },
        priceRange: { min: 0, max: 500000 }
      }
    },
    'items-for-sale': {
      icon: ShoppingBag,
      color: 'bg-blue-400',
      title: 'Items for Sale Categories',
      subcategories: [
        'Appliances', 'Art & Crafts', 'Automotive Items & Parts', 'Bicycles', 
        'Books & Magazines', 'Cell Phones', 'Clothing & Apparel', 'Collectibles', 
        'Computers & Electronics', 'Farm & Ranch', 'Games', 'Health & Beauty Items', 
        'Heavy Equipment', 'Hobbies', 'Household & Furniture', 'Jewelry', 'Kids Stuff', 
        'Lawn & Garden', 'Mattresses', 'Miscellaneous Items', 'Movies & DVDs', 
        'Music & CDs', 'Musical Instruments', 'Office & Business', 'Sports Equipment', 
        'Tickets', 'Tools'
      ],
      filterOptions: {
        itemType: ['All', 'Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Tools', 'Automotive', 'Home & Garden', 'Toys & Games', 'Collectibles', 'Art', 'Jewelry', 'Musical Instruments', 'Appliances', 'Office', 'Health & Beauty', 'Baby & Kids', 'Pet Supplies', 'Other'],
        yearRange: { min: 1900, max: 2024 },
        priceRange: { min: 0, max: 100000 }
      }
    }
  };

  const currentCategory = categoryData[categoryName] || categoryData['vehicles'];
  const IconComponent = currentCategory.icon;

  const { data: adsData, isLoading, error } = useQuery(
    ['ads', categoryName, filters, currentPage],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        category: categoryName,
        ...filters
      });
      const response = await axios.get(`/api/ads?${params}`);
      return response.data;
    },
    {
      keepPreviousData: true
    }
  );

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading ads</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentCategory.title}</h1>
          <p className="text-gray-600">
            {adsData?.pagination?.total || 0} ads found
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Search for..."
                  />
                </div>
              </div>
              <div className="md:w-64">
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  <option value="Chennai">Chennai, India</option>
                  <option value="Mumbai">Mumbai, India</option>
                  <option value="Delhi">Delhi, India</option>
                  <option value="Bangalore">Bangalore, India</option>
                  <option value="Hyderabad">Hyderabad, India</option>
                </select>
              </div>
              <button
                onClick={() => handleFilterChange('search', filters.search)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
              >
                SEARCH
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 ${currentCategory.color} rounded-full flex items-center justify-center text-white mr-3`}>
                  <IconComponent size={16} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{currentCategory.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {currentCategory.subcategories.map((subcategory, index) => (
                  <Link
                    key={index}
                    to={`/ads?category=${categoryName}&subcategory=${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`px-3 py-2 rounded-md text-sm transition-colors ${
                      filters.subcategory === subcategory.toLowerCase().replace(/\s+/g, '-')
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {subcategory}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Ads */}
          <div className="lg:w-1/2">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : adsData?.ads?.length > 0 ? (
              <div className="space-y-4">
                {adsData.ads.map((ad) => (
                  <Link
                    key={ad._id}
                    to={`/ads/${ad._id}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 block"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        NO IMAGE
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {ad.title}
                          </h3>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(ad.price)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {ad.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            <span>{ad.location?.city}, {ad.location?.state}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>{formatDate(ad.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ads found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or browse all categories.
                </p>
                <Link to="/post-ad" className="btn btn-primary">
                  Post the first ad
                </Link>
              </div>
            )}
          </div>

          {/* Right Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter size={20} className="mr-2" />
                Filters
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input"
                    placeholder="Low"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input"
                    placeholder="High"
                  />
                </div>
              </div>

              {/* Category-specific filters */}
              {categoryName === 'vehicles' && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make
                    </label>
                    <select className="input">
                      <option value="">All</option>
                      {currentCategory.filterOptions.make.map((make, index) => (
                        <option key={index} value={make.toLowerCase()}>{make}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Corvette"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        className="input"
                        placeholder="Low"
                        min={currentCategory.filterOptions.yearRange.min}
                        max={currentCategory.filterOptions.yearRange.max}
                      />
                      <input
                        type="number"
                        className="input"
                        placeholder="High"
                        min={currentCategory.filterOptions.yearRange.min}
                        max={currentCategory.filterOptions.yearRange.max}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Private sellers only checkbox */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-700">Private sellers only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilters({
                    search: '',
                    subcategory: '',
                    city: '',
                    minPrice: '',
                    maxPrice: '',
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                  });
                  setSearchParams({});
                }}
                className="w-full btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-right">
          <Link
            to="/post-ad"
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            Create your own ad in Chennai
          </Link>
          <p className="text-xs text-gray-500 mt-1">
            {currentCategory.title}. It's easy and free!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 