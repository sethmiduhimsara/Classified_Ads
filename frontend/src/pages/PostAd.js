import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, X, MapPin, DollarSign, Tag, FileText, Mail, Phone } from 'lucide-react';

const PostAd = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    topic: '',
    category: '',
    location: {
      city: '',
      state: '',
      zipCode: ''
    },
    contact: {
      email: '',
      phone: ''
    },
    images: [],
    expireIn: '6 months', // Default expiration
    // Dynamic fields based on category
    vehicleDetails: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      fuelType: '',
      transmission: '',
      condition: ''
    },
    propertyDetails: {
      bedrooms: '',
      bathrooms: '',
      squareFeet: '',
      propertyType: '',
      furnished: false
    },
    jobDetails: {
      jobType: '',
      experience: '',
      salary: '',
      company: ''
    },
    petDetails: {
      breed: '',
      age: '',
      gender: '',
      vaccinated: false,
      neutered: false
    }
  });
  const [imagePreviews, setImagePreviews] = useState([]);



  const { data: categories } = useQuery('categories', async () => {
    const response = await axios.get('/api/categories');
    return response.data;
  });

  // Get main categories (topics) and subcategories
  const mainCategories = React.useMemo(() => 
    categories?.filter(cat => !cat.parentCategory) || [], 
    [categories]
  );
  const subcategories = React.useMemo(() => 
    categories?.filter(cat => cat.parentCategory) || [], 
    [categories]
  );
  
  // Debug logging
  React.useEffect(() => {
    if (categories) {
      console.log('All categories:', categories);
      console.log('Main categories:', mainCategories);
      console.log('Subcategories:', subcategories);
    }
  }, [categories, mainCategories, subcategories]);

  const createAdMutation = useMutation(
    async (adData) => {
      console.log('Submitting ad data:', adData);
      try {
        console.log('Auth header:', axios.defaults.headers.common['Authorization']);
        const response = await axios.post('/api/ads', adData);
        console.log('Response received:', response);
        return response.data;
      } catch (error) {
        console.error('Request failed:', error);
        console.error('Request URL:', error.config?.url);
        console.error('Request data:', error.config?.data);
        console.error('Request headers:', error.config?.headers);
        throw error;
      }
    },
    {
      onSuccess: (data) => {
        toast.success('Ad posted successfully!');
        navigate(`/ads/${data.ad._id}`);
      },
      onError: (error) => {
        console.error('Ad creation error:', error);
        console.error('Error response:', error.response?.data);
        
        // Show specific validation errors if available
        if (error.response?.data?.errors) {
          const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
          toast.error(`Validation errors: ${errorMessages}`);
        } else {
          toast.error(error.response?.data?.message || 'Failed to post ad');
        }
      }
    }
  );

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else if (name.startsWith('vehicleDetails.')) {
      const vehicleField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          [vehicleField]: value
        }
      }));
    } else if (name.startsWith('propertyDetails.')) {
      const propertyField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        propertyDetails: {
          ...prev.propertyDetails,
          [propertyField]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('jobDetails.')) {
      const jobField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        jobDetails: {
          ...prev.jobDetails,
          [jobField]: value
        }
      }));
    } else if (name.startsWith('petDetails.')) {
      const petField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        petDetails: {
          ...prev.petDetails,
          [petField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    console.log('Selected topic ID:', topicId);
    setFormData(prev => ({
      ...prev,
      topic: topicId,
      category: '' // Reset category when topic changes
    }));
  };

  // Get dynamic fields based on selected category
  const getDynamicFields = () => {
    if (!formData.category) return null;
    
    const categoryName = subcategories.find(cat => cat._id === formData.category)?.name || '';
    const topicName = mainCategories.find(cat => cat._id === formData.topic)?.name || '';
    
    // Vehicle fields
    if (topicName.toLowerCase().includes('vehicle') || 
        categoryName.toLowerCase().includes('car') ||
        categoryName.toLowerCase().includes('truck') ||
        categoryName.toLowerCase().includes('motorcycle')) {
      return 'vehicle';
    }
    
    // Property fields
    if (topicName.toLowerCase().includes('rent') || 
        topicName.toLowerCase().includes('real estate') ||
        categoryName.toLowerCase().includes('apartment') ||
        categoryName.toLowerCase().includes('house')) {
      return 'property';
    }
    
    // Job fields
    if (topicName.toLowerCase().includes('job')) {
      return 'job';
    }
    
    // Pet fields
    if (topicName.toLowerCase().includes('pet') ||
        categoryName.toLowerCase().includes('dog') ||
        categoryName.toLowerCase().includes('cat')) {
      return 'pet';
    }
    
    return null;
  };

  const dynamicFieldType = getDynamicFields();

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Upload each file
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post('/api/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Add uploaded image URL to form data
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, response.data.imageUrl]
        }));

        // Add to previews
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);

        toast.success('Image uploaded successfully!');
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('User authenticated:', isAuthenticated);
    console.log('Current user:', user);
    
    if (!isAuthenticated) {
      toast.error('Please log in to post an ad');
      navigate('/login');
      return;
    }
    
    // Frontend validation
    if (!formData.title || formData.title.trim().length < 5) {
      toast.error('Title must be at least 5 characters long');
      return;
    }

    if (!formData.description || formData.description.trim().length < 20) {
      toast.error('Description must be at least 20 characters long');
      return;
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!formData.topic) {
      toast.error('Please select a topic');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.location.city || !formData.location.state) {
      toast.error('Please fill in city and state');
      return;
    }

    if (!formData.contact.email || !formData.contact.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    console.log('Form data:', formData);
    console.log('Available categories:', categories);
    
    // The category is already an ID, so we can use it directly
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    // Prepare ad data with proper category ID
    const adData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category, // Already an ID
      location: formData.location,
      contact: formData.contact,
      images: formData.images || [], // Only use uploaded images, empty array if none
      expireIn: formData.expireIn,
      // Include dynamic fields based on category
      ...(dynamicFieldType === 'vehicle' && { vehicleDetails: formData.vehicleDetails }),
      ...(dynamicFieldType === 'property' && { propertyDetails: formData.propertyDetails }),
      ...(dynamicFieldType === 'job' && { jobDetails: formData.jobDetails }),
      ...(dynamicFieldType === 'pet' && { petDetails: formData.petDetails })
    };

    console.log('Final ad data being submitted:', adData);
    console.log('Category ID type:', typeof adData.category);
    console.log('Category ID value:', adData.category);

    createAdMutation.mutate(adData);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Ad</h1>
            <p className="text-gray-600">Fill in the details below to create your listing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input pl-10"
                  placeholder="Enter a descriptive title for your ad"
                  maxLength={100}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">{formData.title.length}/100 characters</p>
            </div>

            {/* Topic Selection */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Topic *
              </label>
              <select
                id="topic"
                name="topic"
                required
                value={formData.topic}
                onChange={handleTopicChange}
                className="input"
              >
                <option value="">Select a topic</option>
                {mainCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="input"
                disabled={!formData.topic}
              >
                <option value="">
                  {formData.topic ? 'Select a category' : 'Please select a topic first'}
                </option>
                {formData.topic && (() => {
                  const filteredSubcategories = subcategories.filter(cat => {
                    const parentId = typeof cat.parentCategory === 'object' ? cat.parentCategory._id : cat.parentCategory;
                    return parentId === formData.topic;
                  });
                  console.log('Filtered subcategories for topic', formData.topic, ':', filteredSubcategories);
                  return filteredSubcategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ));
                })()}
              </select>
            </div>

            {/* Dynamic Fields Based on Category */}
            {dynamicFieldType === 'vehicle' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vehicleDetails.make" className="block text-sm font-medium text-gray-700 mb-2">
                      Make *
                    </label>
                    <input
                      type="text"
                      id="vehicleDetails.make"
                      name="vehicleDetails.make"
                      required
                      value={formData.vehicleDetails.make}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., Honda, Toyota"
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicleDetails.model" className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      id="vehicleDetails.model"
                      name="vehicleDetails.model"
                      required
                      value={formData.vehicleDetails.model}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., Civic, Camry"
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicleDetails.year" className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      id="vehicleDetails.year"
                      name="vehicleDetails.year"
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.vehicleDetails.year}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., 2020"
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicleDetails.mileage" className="block text-sm font-medium text-gray-700 mb-2">
                      Mileage
                    </label>
                    <input
                      type="number"
                      id="vehicleDetails.mileage"
                      name="vehicleDetails.mileage"
                      min="0"
                      value={formData.vehicleDetails.mileage}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., 50000"
                    />
                  </div>
                  <div>
                    <label htmlFor="vehicleDetails.fuelType" className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Type
                    </label>
                    <select
                      id="vehicleDetails.fuelType"
                      name="vehicleDetails.fuelType"
                      value={formData.vehicleDetails.fuelType}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select fuel type</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vehicleDetails.transmission" className="block text-sm font-medium text-gray-700 mb-2">
                      Transmission
                    </label>
                    <select
                      id="vehicleDetails.transmission"
                      name="vehicleDetails.transmission"
                      value={formData.vehicleDetails.transmission}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select transmission</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="vehicleDetails.condition" className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <select
                      id="vehicleDetails.condition"
                      name="vehicleDetails.condition"
                      value={formData.vehicleDetails.condition}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select condition</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {dynamicFieldType === 'property' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="propertyDetails.bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      id="propertyDetails.bedrooms"
                      name="propertyDetails.bedrooms"
                      min="0"
                      value={formData.propertyDetails.bedrooms}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., 2"
                    />
                  </div>
                  <div>
                    <label htmlFor="propertyDetails.bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      id="propertyDetails.bathrooms"
                      name="propertyDetails.bathrooms"
                      min="0"
                      step="0.5"
                      value={formData.propertyDetails.bathrooms}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., 2.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="propertyDetails.squareFeet" className="block text-sm font-medium text-gray-700 mb-2">
                      Square Feet
                    </label>
                    <input
                      type="number"
                      id="propertyDetails.squareFeet"
                      name="propertyDetails.squareFeet"
                      min="0"
                      value={formData.propertyDetails.squareFeet}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., 1500"
                    />
                  </div>
                  <div>
                    <label htmlFor="propertyDetails.propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      id="propertyDetails.propertyType"
                      name="propertyDetails.propertyType"
                      value={formData.propertyDetails.propertyType}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select property type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Condo">Condo</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Studio">Studio</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="propertyDetails.furnished"
                        checked={formData.propertyDetails.furnished}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Furnished</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {dynamicFieldType === 'job' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="jobDetails.jobType" className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type *
                    </label>
                    <select
                      id="jobDetails.jobType"
                      name="jobDetails.jobType"
                      required
                      value={formData.jobDetails.jobType}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select job type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="jobDetails.experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      id="jobDetails.experience"
                      name="jobDetails.experience"
                      value={formData.jobDetails.experience}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select experience level</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="jobDetails.salary" className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      id="jobDetails.salary"
                      name="jobDetails.salary"
                      value={formData.jobDetails.salary}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., $50,000 - $70,000"
                    />
                  </div>
                  <div>
                    <label htmlFor="jobDetails.company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="jobDetails.company"
                      name="jobDetails.company"
                      value={formData.jobDetails.company}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., Tech Corp"
                    />
                  </div>
                </div>
              </div>
            )}

            {dynamicFieldType === 'pet' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pet Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="petDetails.breed" className="block text-sm font-medium text-gray-700 mb-2">
                      Breed
                    </label>
                    <input
                      type="text"
                      id="petDetails.breed"
                      name="petDetails.breed"
                      value={formData.petDetails.breed}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., Golden Retriever"
                    />
                  </div>
                  <div>
                    <label htmlFor="petDetails.age" className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="text"
                      id="petDetails.age"
                      name="petDetails.age"
                      value={formData.petDetails.age}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g., 2 years old"
                    />
                  </div>
                  <div>
                    <label htmlFor="petDetails.gender" className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      id="petDetails.gender"
                      name="petDetails.gender"
                      value={formData.petDetails.gender}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="petDetails.vaccinated"
                        checked={formData.petDetails.vaccinated}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Vaccinated</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="petDetails.neutered"
                        checked={formData.petDetails.neutered}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Neutered/Spayed</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Expiration */}
            <div>
              <label htmlFor="expireIn" className="block text-sm font-medium text-gray-700 mb-2">
                Expire in
              </label>
              <select
                id="expireIn"
                name="expireIn"
                value={formData.expireIn}
                onChange={handleInputChange}
                className="input"
              >
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
                <option value="Never">Never</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="location.city"
                      required
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className="input pl-10"
                      placeholder="City"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name="location.state"
                    required
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="State"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea pl-10"
                  placeholder="Describe your item in detail. Include condition, features, and any other relevant information..."
                  maxLength={1000}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload images
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PNG, JPG, GIF up to 5MB each (max 5 images)
                      </span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Contact Information *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      name="contact.email"
                      required
                      value={formData.contact.email}
                      onChange={handleInputChange}
                      className="input pl-10"
                      placeholder="Contact email"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="tel"
                      name="contact.phone"
                      value={formData.contact.phone}
                      onChange={handleInputChange}
                      className="input pl-10"
                      placeholder="Phone number (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/ads')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createAdMutation.isLoading}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createAdMutation.isLoading ? 'Posting...' : 'Post Ad'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostAd;
