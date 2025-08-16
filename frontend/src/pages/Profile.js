import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: {
      city: user?.location?.city || '',
      state: user?.location?.state || '',
      zipCode: user?.location?.zipCode || ''
    }
  });

  const { data: profile, refetch } = useQuery(
    'profile',
    async () => {
      const response = await axios.get('/api/users/profile');
      return response.data;
    },
    {
      enabled: isAuthenticated,
      onSuccess: (data) => {
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          location: {
            city: data.location?.city || '',
            state: data.location?.state || '',
            zipCode: data.location?.zipCode || ''
          }
        });
      }
    }
  );

  const updateProfileMutation = useMutation(
    async (profileData) => {
      const response = await axios.put('/api/users/profile', profileData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        refetch();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      location: {
        city: profile?.location?.city || '',
        state: profile?.location?.state || '',
        zipCode: profile?.location?.zipCode || ''
      }
    });
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-8">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6">
                <User size={32} className="text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{profile?.name}</h1>
                <p className="text-primary-100">Member since {new Date(profile?.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline flex items-center space-x-2"
                >
                  <Edit2 size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={updateProfileMutation.isLoading}
                    className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{updateProfileMutation.isLoading ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    id="email"
                    value={profile?.email || ''}
                    disabled
                    className="input pl-10 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`input pl-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="City"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`input ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Active Ads</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Sold Items</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
