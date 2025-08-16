import React from 'react';
import { Link } from 'react-router-dom';

const SubcategoryGrid = ({ subcategories, parentCategory }) => {
  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-gray-500">No subcategories available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Subcategories ({subcategories.length})
        </h3>
        <Link
          to={`/category/${parentCategory.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View all in {parentCategory.name} →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subcategories.map((subcategory) => (
          <SubcategoryCard 
            key={subcategory._id} 
            subcategory={subcategory} 
            parentCategory={parentCategory}
          />
        ))}
      </div>
    </div>
  );
};

const SubcategoryCard = ({ subcategory, parentCategory }) => {
  return (
            <Link
          to={`/category/${parentCategory.name.toLowerCase().replace(/\s+/g, '-')}?subcategory=${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="group block"
        >
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200 group-hover:scale-105">
        <div className="flex items-center space-x-3">
          {/* Icon indicator */}
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: parentCategory.color }}
          />
          
          {/* Subcategory name */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {subcategory.name}
            </h4>
            {subcategory.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {subcategory.description}
              </p>
            )}
          </div>
          
          {/* Arrow icon */}
          <svg
            className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default SubcategoryGrid;
