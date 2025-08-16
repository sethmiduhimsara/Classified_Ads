import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Car, Home as HomeIcon, Briefcase, Heart, ShoppingBag, Gamepad2, Users } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedLocation) params.append('city', selectedLocation);
    navigate(`/ads?${params.toString()}`);
  };

  // Fetch categories
  const { data: categories } = useQuery('categories', async () => {
    const response = await axios.get('/api/categories');
    return response.data;
  });

  // Get main categories (topics) for display
  const mainCategories = React.useMemo(() => 
    categories?.filter(cat => !cat.parentCategory) || [], 
    [categories]
  );



  const featuredAds = [
    {
      id: 1,
      title: '2020 Honda Civic - Excellent Condition',
      price: '$18,500',
      location: 'Los Angeles, CA',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop',
      category: 'Vehicles'
    },
    {
      id: 2,
      title: 'Beautiful 3BR Apartment Downtown',
      price: '$2,200/month',
      location: 'New York, NY',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop',
      category: 'Real Estate'
    },
    {
      id: 3,
      title: 'iPhone 14 Pro Max - Like New',
      price: '$899',
      location: 'Chicago, IL',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop',
      category: 'Electronics'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Amazing Deals
              <span className="block text-primary-200">Near You</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Buy, sell, and discover great items in your local community with our modern, 
              easy-to-use classified ads platform.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 text-gray-900 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    <option value="New York">New York, NY</option>
                    <option value="Los Angeles">Los Angeles, CA</option>
                    <option value="Chicago">Chicago, IL</option>
                    <option value="Houston">Houston, TX</option>
                    <option value="Phoenix">Phoenix, AZ</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Categories</h2>
            <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {mainCategories.map((category) => {
              // Map category names to icons
              const getIcon = (categoryName) => {
                const name = categoryName.toLowerCase();
                if (name.includes('vehicle')) return Car;
                if (name.includes('service')) return Gamepad2;
                if (name.includes('rent') || name.includes('real estate')) return HomeIcon;
                if (name.includes('community')) return Users;
                if (name.includes('pet')) return Heart;
                if (name.includes('job')) return Briefcase;
                if (name.includes('sale') || name.includes('item')) return ShoppingBag;
                return ShoppingBag; // default icon
              };

              const IconComponent = getIcon(category.name);
              const colors = [
                'bg-green-100 text-green-600',
                'bg-orange-100 text-orange-600', 
                'bg-blue-100 text-blue-600',
                'bg-purple-100 text-purple-600',
                'bg-red-100 text-red-600',
                'bg-yellow-100 text-yellow-600',
                'bg-indigo-100 text-indigo-600',
                'bg-pink-100 text-pink-600'
              ];
              const colorClass = colors[Math.floor(Math.random() * colors.length)];

              return (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="group text-center p-6 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">Browse {category.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Ads Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Ads</h2>
            <p className="text-lg text-gray-600">Check out these popular listings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAds.map((ad) => (
              <Link
                key={ad.id}
                to={`/ads/${ad.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary-600 font-medium">{ad.category}</span>
                    <span className="text-lg font-bold text-gray-900">{ad.price}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {ad.title}
                  </h3>
                  <p className="text-gray-600">{ad.location}</p>
                </div>
              </Link>
            ))}
          </div>


        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of users who trust ClassifiedHub for their buying and selling needs.
          </p>
          <Link
            to="/post-ad"
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-md font-semibold text-lg transition-colors"
          >
            Post Your First Ad
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
