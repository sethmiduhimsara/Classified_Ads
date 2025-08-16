import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, isSelected, onClick }) => {
  return (
    <div
      className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
        isSelected ? 'scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${
          isSelected
            ? 'border-blue-500 shadow-xl'
            : 'border-gray-100 hover:border-gray-200 hover:shadow-xl'
        }`}
      >
        {/* Category Header */}
        <div
          className="px-6 py-8 text-center relative"
          style={{
            background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)`
          }}
        >
          {/* Icon */}
          <div className="text-6xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
            {category.icon}
          </div>
          
          {/* Category Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {category.name}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {category.description}
          </p>
          
          {/* Hover Indicator */}
          <div
            className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 ${
              isSelected ? 'opacity-10' : 'group-hover:opacity-5'
            }`}
            style={{ backgroundColor: category.color }}
          />
        </div>

        {/* Action Area */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {isSelected ? 'Click to close' : 'Click to explore'}
            </span>
            <div className="flex items-center space-x-2">
              {/* Browse Link */}
              <Link
                to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Browse
              </Link>
              
              {/* Arrow Icon */}
              <svg
                className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                  isSelected ? 'rotate-180' : 'group-hover:translate-x-1'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isSelected ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div
            className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: category.color }}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
