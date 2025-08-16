import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, DollarSign } from 'lucide-react';

const MyAds = () => {
  const { isAuthenticated } = useAuth();
  const [statusFilter, setStatusFilter] = useState('active');
  const queryClient = useQueryClient();

  const { data: adsData, isLoading, error } = useQuery(
    ['my-ads', statusFilter],
    async () => {
      const response = await axios.get(`/api/users/my-ads?status=${statusFilter}`);
      return response.data;
    },
    {
      enabled: isAuthenticated
    }
  );

  const deleteAdMutation = useMutation(
    async (adId) => {
      await axios.delete(`/api/ads/${adId}`);
    },
    {
      onSuccess: () => {
        toast.success('Ad deleted successfully');
        queryClient.invalidateQueries(['my-ads']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete ad');
      }
    }
  );

  const handleDeleteAd = (adId) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      deleteAdMutation.mutate(adId);
    }
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

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      sold: 'bg-blue-100 text-blue-800',
      expired: 'bg-yellow-100 text-yellow-800',
      deleted: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your ads.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Ads</h1>
            <p className="text-gray-600 mt-2">
              Manage your classified advertisements
            </p>
          </div>
          <Link to="/post-ad" className="btn btn-primary flex items-center space-x-2">
            <Plus size={16} />
            <span>Post New Ad</span>
          </Link>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {['active', 'sold', 'expired', 'all'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} Ads
              </button>
            ))}
          </div>
        </div>

        {/* Ads List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading ads</h3>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        ) : adsData?.ads?.length > 0 ? (
          <div className="space-y-4">
            {adsData.ads.map((ad) => (
              <div key={ad._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {ad.images && ad.images.length > 0 ? (
                        <img
                          src={ad.images[0]}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {ad.title}
                            </h3>
                            {getStatusBadge(ad.status)}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center">
                              <DollarSign size={14} className="mr-1" />
                              <span className="font-medium text-gray-900">{formatPrice(ad.price)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              <span>{ad.location.city}, {ad.location.state}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              <span>{formatDate(ad.createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye size={14} className="mr-1" />
                              <span>{ad.views} views</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {ad.description}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            to={`/ads/${ad._id}`}
                            className="p-2 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-100"
                            title="View Ad"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => {/* TODO: Implement edit functionality */}}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100"
                            title="Edit Ad"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAd(ad._id)}
                            disabled={deleteAdMutation.isLoading}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 disabled:opacity-50"
                            title="Delete Ad"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {adsData.pagination && adsData.pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  {[...Array(adsData.pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        adsData.pagination.current === i + 1
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ads found</h3>
            <p className="text-gray-600 mb-6">
              You haven't posted any ads yet. Create your first listing to get started.
            </p>
            <Link to="/post-ad" className="btn btn-primary">
              Post Your First Ad
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAds;
