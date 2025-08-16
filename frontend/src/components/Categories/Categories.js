import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import SubcategoryGrid from './SubcategoryGrid';
import CategoryDetailView from './CategoryDetailView';

const Categories = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.length > 0) {
      const category = categories.find(cat => 
        cat.name.toLowerCase() === categoryParam.toLowerCase() ||
        cat.slug === categoryParam
      );
      if (category) {
        setSelectedCategory(category);
        fetchSubcategories(category._id);
      }
    }
  }, [searchParams, categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      // Filter main categories (no parent)
      const mainCategories = data.filter(cat => !cat.parentCategory);
      setCategories(mainCategories);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}/subcategories`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }
      const data = await response.json();
      setSubcategories(data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory && selectedCategory._id === category._id) {
      // Close if already selected
      setSelectedCategory(null);
      setSubcategories([]);
    } else {
      setSelectedCategory(category);
      fetchSubcategories(category._id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Categories</h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchCategories}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedCategory ? (
        // Show detailed category view when a category is selected
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for in our organized categories
            </p>
          </div>

          {/* Main Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                isSelected={selectedCategory && selectedCategory._id === category._id}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>

          {/* Subcategories Section */}
          <div className="mt-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div 
                className="px-8 py-6 border-b border-gray-100"
                style={{ backgroundColor: selectedCategory.color + '10' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{selectedCategory.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCategory.name}
                      </h2>
                      <p className="text-gray-600">{selectedCategory.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSubcategories([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <SubcategoryGrid 
                  subcategories={subcategories} 
                  parentCategory={selectedCategory}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h3>
              <p className="text-gray-600 mb-6">Post your ad or browse existing listings</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/ads/create"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Post an Ad
                </Link>
                <Link
                  to="/ads"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-blue-600"
                >
                  Browse All Ads
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Show the detailed category view like in the image when no category is selected
        <CategoryDetailView category={null} subcategories={[]} />
      )}
    </div>
  );
};

export default Categories;
