// src/components/home/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaTaxi, FaBus, FaMapMarkerAlt, FaCalendarDay, FaUsers, FaSearch, FaArrowRight, FaCar } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BHUTAN_LOCATIONS } from '@/app/utils/constants';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Location {
  name: string;
  popularPlaces: string[];
}

interface LocationSuggestion {
  city: string;
  place: string;
}

export default function HeroSection() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'passenger' | 'driver' | null>(null);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: new Date(),
    passengers: '1',
    vehicleType: 'taxi'
  });

  // State for dropdowns
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle location suggestions
    if (name === 'from' || name === 'to') {
      const suggestions: LocationSuggestion[] = [];
      Object.values(BHUTAN_LOCATIONS).forEach((city: Location) => {
        // Add city name
        if (city.name.toLowerCase().includes(value.toLowerCase())) {
          suggestions.push({ city: city.name, place: city.name });
        }
        // Add popular places
        city.popularPlaces.forEach(place => {
          if (place.toLowerCase().includes(value.toLowerCase())) {
            suggestions.push({ city: city.name, place });
          }
        });
      });
      
      if (name === 'from') {
        setFromSuggestions(suggestions);
        setShowFromDropdown(true);
      } else {
        setToSuggestions(suggestions);
        setShowToDropdown(true);
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };

  const handleLocationSelect = (suggestion: LocationSuggestion, type: 'from' | 'to') => {
    setFormData(prev => ({
      ...prev,
      [type]: suggestion.place
    }));
    if (type === 'from') {
      setShowFromDropdown(false);
    } else {
      setShowToDropdown(false);
    }
  };

  const handleVehicleTypeChange = (type: 'taxi' | 'bus') => {
    setFormData(prev => ({
      ...prev,
      vehicleType: type
    }));
  };

  const handleFindRide = () => {
    const queryParams = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.date.toISOString(),
      passengers: formData.passengers,
      vehicleType: formData.vehicleType
    });

    router.push(`/book?${queryParams.toString()}`);
  };

  if (userRole === 'driver') {
    return (
      <section className="relative bg-gradient-to-br from-green-100 to-green-50 min-h-screen flex items-center justify-center py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-90 z-0"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="bg-emerald-100 rounded-xl shadow-lg overflow-hidden hover:scale-[1.01] transition-transform border border-emerald-300">
            <div className="p-8 bg-gradient-to-r from-emerald-400 to-emerald-500 text-gray-900">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome to RideEase</h1>
              <p className="text-lg text-gray-800">Your trusted partner in transportation</p>
            </div>
            
            <div className="p-8">
              <div className="bg-emerald-50 rounded-lg p-6 text-gray-900 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-emerald-300">
                    <FaCar className="text-2xl" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold">Start Earning</h3>
                </div>
                <p className="text-gray-800 mb-4">Join our network of professional drivers and start earning today.</p>
                <Link 
                  href="/driver/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                >
                  Go to Dashboard
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-green-100 to-green-50 min-h-screen flex items-center justify-center py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-90 z-0"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="bg-emerald-100 rounded-xl shadow-lg overflow-hidden hover:scale-[1.01] transition-transform border border-emerald-300">
          <div className="p-8 bg-gradient-to-r from-emerald-400 to-emerald-500 text-gray-900">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Where would you like to go?</h1>
            <p className="text-lg text-gray-800">Smart booking for taxis and buses</p>
          </div>
          
          <div className="p-8">
            {/* Booking Tabs */}
            <div className="flex border-b border-emerald-400 mb-6">
              <button 
                style={{ color: '#000000' }}
                className={`booking-tab px-6 py-3 font-bold flex items-center border-b-2 transition-all duration-300 ${
                  formData.vehicleType === 'taxi' 
                    ? 'border-[#000000] bg-emerald-100' 
                    : 'hover:bg-emerald-50 border-transparent'
                }`}
                onClick={() => handleVehicleTypeChange('taxi')}
              >
                <FaTaxi className="mr-3 text-xl" style={{ color: '#000000' }} /> Taxi
              </button>
              <button 
                style={{ color: '#000000' }}
                className={`booking-tab px-6 py-3 font-bold flex items-center border-b-2 transition-all duration-300 ${
                  formData.vehicleType === 'bus' 
                    ? 'border-[#000000] bg-emerald-100' 
                    : 'hover:bg-emerald-50 border-transparent'
                }`}
                onClick={() => handleVehicleTypeChange('bus')}
              >
                <FaBus className="mr-3 text-xl" style={{ color: '#000000' }} /> Bus
              </button>
            </div>
            
            {/* Booking Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-900 mb-2 font-semibold">From</label>
                <div className="relative">
                  <input
                    type="text"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    onFocus={() => setShowFromDropdown(true)}
                    placeholder="Enter pickup location"
                    className="w-full px-4 py-3 bg-emerald-50 border border-emerald-400 rounded-lg text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <FaMapMarkerAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
                </div>
                {showFromDropdown && fromSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                    {fromSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-emerald-100 cursor-pointer text-gray-900"
                        onClick={() => handleLocationSelect(suggestion, 'from')}
                      >
                        <div className="font-medium">{suggestion.place}</div>
                        {suggestion.place !== suggestion.city && (
                          <div className="text-sm text-gray-700">{suggestion.city}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-gray-900 mb-2 font-semibold">To</label>
                <div className="relative">
                  <input
                    type="text"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    onFocus={() => setShowToDropdown(true)}
                    placeholder="Enter destination"
                    className="w-full px-4 py-3 bg-emerald-50 border border-emerald-400 rounded-lg text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <FaMapMarkerAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
                </div>
                {showToDropdown && toSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                    {toSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-emerald-100 cursor-pointer text-gray-900"
                        onClick={() => handleLocationSelect(suggestion, 'to')}
                      >
                        <div className="font-medium">{suggestion.place}</div>
                        {suggestion.place !== suggestion.city && (
                          <div className="text-sm text-gray-700">{suggestion.city}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-gray-900 mb-2 font-semibold">Date & Time</label>
                <div className="relative">
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    wrapperClassName="w-full"
                    className="w-full px-4 py-3 bg-emerald-50 border border-emerald-400 rounded-lg text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholderText="Select date and time"
                    popperClassName="react-datepicker-popper"
                    popperPlacement="bottom-start"
                    customInput={
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.date ? formData.date.toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          }) : ''}
                          className="w-full px-4 py-3 bg-emerald-50 border border-emerald-400 rounded-lg text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          readOnly
                        />
                        <FaCalendarDay className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
                      </div>
                    }
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-900 mb-2 font-semibold">Passengers</label>
                <div className="relative">
                  <select
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-emerald-50 border border-emerald-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num} className="bg-emerald-50 text-gray-900">
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                  <FaUsers className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                onClick={handleFindRide}
                className="w-full md:w-auto px-8 py-4 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Find Ride
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}