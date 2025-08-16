import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { MapPin, Calendar, Eye, Phone, Mail, Share2, Heart, ArrowLeft, User } from 'lucide-react';
import toast from 'react-hot-toast';

const AdDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const { data: ad, isLoading, error } = useQuery(
    ['ad', id],
    async () => {
      const response = await axios.get(`/api/ads/${id}`);
      return response.data;
    }
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: ad.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ad not found</h2>
          <p className="text-gray-600 mb-4">The ad you're looking for doesn't exist or has been removed.</p>
          <Link to="/ads" className="btn btn-primary">
            Browse Other Ads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/ads"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              {ad.images && ad.images.length > 0 ? (
                <div>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={ad.images[currentImageIndex]}
                      alt={ad.title}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                  {ad.images.length > 1 && (
                    <div className="p-4">
                      <div className="flex space-x-2 overflow-x-auto">
                        {ad.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              currentImageIndex === index
                                ? 'border-primary-500'
                                : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${ad.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No images available</span>
                </div>
              )}
            </div>

            {/* Ad Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full mb-2">
                    {ad.category?.name}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{ad.title}</h1>
                  <div className="text-4xl font-bold text-primary-600 mb-4">
                    {formatPrice(ad.price)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Share2 size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100">
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  <span>{ad.location.city}, {ad.location.state}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>Posted {formatDate(ad.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  <span>{ad.views} views</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <div className="prose max-w-none text-gray-700">
                  {ad.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Dynamic Details Based on Category */}
              {ad.vehicleDetails && Object.values(ad.vehicleDetails).some(value => value) && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ad.vehicleDetails.make && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Make:</span>
                        <p className="text-gray-900">{ad.vehicleDetails.make}</p>
                      </div>
                    )}
                    {ad.vehicleDetails.model && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Model:</span>
                        <p className="text-gray-900">{ad.vehicleDetails.model}</p>
                      </div>
                    )}
                    {ad.vehicleDetails.year && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Year:</span>
                        <p className="text-gray-900">{ad.vehicleDetails.year}</p>
                      </div>
                    )}
                    {ad.vehicleDetails.mileage && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Mileage:</span>
                        <p className="text-gray-900">{ad.vehicleDetails.mileage.toLocaleString()} miles</p>
                      </div>
                    )}
                    {ad.vehicleDetails.fuelType && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Fuel Type:</span>
                        <p className="text-gray-900">{ad.vehicleDetails.fuelType}</p>
                      </div>
                    )}
                    {ad.vehicleDetails.transmission && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Transmission:</span>
                        <p className="text-gray-900">{ad.vehicleDetails.transmission}</p>
                      </div>
                    )}
                    {ad.vehicleDetails.condition && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Condition:</span>
                        <p className="text-gray-900">{ad.vehicleDetails.condition}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {ad.propertyDetails && Object.values(ad.propertyDetails).some(value => value !== false && value) && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ad.propertyDetails.bedrooms && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Bedrooms:</span>
                        <p className="text-gray-900">{ad.propertyDetails.bedrooms}</p>
                      </div>
                    )}
                    {ad.propertyDetails.bathrooms && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Bathrooms:</span>
                        <p className="text-gray-900">{ad.propertyDetails.bathrooms}</p>
                      </div>
                    )}
                    {ad.propertyDetails.squareFeet && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Square Feet:</span>
                        <p className="text-gray-900">{ad.propertyDetails.squareFeet.toLocaleString()}</p>
                      </div>
                    )}
                    {ad.propertyDetails.propertyType && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Property Type:</span>
                        <p className="text-gray-900">{ad.propertyDetails.propertyType}</p>
                      </div>
                    )}
                    {ad.propertyDetails.furnished && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Furnished:</span>
                        <p className="text-gray-900">Yes</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {ad.jobDetails && Object.values(ad.jobDetails).some(value => value) && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ad.jobDetails.jobType && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Job Type:</span>
                        <p className="text-gray-900">{ad.jobDetails.jobType}</p>
                      </div>
                    )}
                    {ad.jobDetails.experience && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Experience Level:</span>
                        <p className="text-gray-900">{ad.jobDetails.experience}</p>
                      </div>
                    )}
                    {ad.jobDetails.salary && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Salary Range:</span>
                        <p className="text-gray-900">{ad.jobDetails.salary}</p>
                      </div>
                    )}
                    {ad.jobDetails.company && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Company:</span>
                        <p className="text-gray-900">{ad.jobDetails.company}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {ad.petDetails && Object.values(ad.petDetails).some(value => value !== false && value) && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Pet Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ad.petDetails.breed && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Breed:</span>
                        <p className="text-gray-900">{ad.petDetails.breed}</p>
                      </div>
                    )}
                    {ad.petDetails.age && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Age:</span>
                        <p className="text-gray-900">{ad.petDetails.age}</p>
                      </div>
                    )}
                    {ad.petDetails.gender && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Gender:</span>
                        <p className="text-gray-900">{ad.petDetails.gender}</p>
                      </div>
                    )}
                    {ad.petDetails.vaccinated && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Vaccinated:</span>
                        <p className="text-gray-900">Yes</p>
                      </div>
                    )}
                    {ad.petDetails.neutered && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Neutered/Spayed:</span>
                        <p className="text-gray-900">Yes</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Seller</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <User size={20} className="text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{ad.seller?.name}</div>
                  <div className="text-sm text-gray-500">Member since {new Date(ad.seller?.createdAt).getFullYear()}</div>
                </div>
              </div>

              {showContactInfo ? (
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail size={16} className="text-gray-400 mr-3" />
                    <a
                      href={`mailto:${ad.contact.email}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {ad.contact.email}
                    </a>
                  </div>
                  {ad.contact.phone && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone size={16} className="text-gray-400 mr-3" />
                      <a
                        href={`tel:${ad.contact.phone}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {ad.contact.phone}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowContactInfo(true)}
                  className="w-full btn btn-primary"
                >
                  Show Contact Info
                </button>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Safety Tips</h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• Meet in a public place</li>
                <li>• Bring a friend if possible</li>
                <li>• Inspect the item before paying</li>
                <li>• Use secure payment methods</li>
                <li>• Trust your instincts</li>
              </ul>
            </div>

            {/* Report Ad */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Report this ad</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you think this ad violates our terms of service, please report it.
              </p>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Report Ad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetail;
