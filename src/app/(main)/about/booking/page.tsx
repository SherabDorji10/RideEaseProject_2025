// src/app/(main)/booking/page.tsx
'use client';

import { useEffect } from 'react';
import { useState} from 'react';
import { useRouter } from 'next/navigation';
import { FaTaxi, FaBus, FaMapMarkerAlt, FaFlagCheckered, FaCalendarDay, FaUsers, FaSearch, FaArrowRight, FaSpinner } from 'react-icons/fa';

// Mock vehicle data - replace with your actual data source
const vehicles = [
  {
    id: 1,
    name: "WagonR Taxi",
    type: "taxi",
    image: "https://example.com/taxi.jpg",
    capacity: "3 passengers",
    basePrice: 50,
    pricePerKm: 10,
    features: ["AC", "Local driver"],
    estimatedTime: "1h 15m",
    available: 5
  },
  {
    id: 2,
    name: "Bumpa Bus",
    type: "bus",
    image: "https://example.com/bus.jpg",
    capacity: "12 passengers",
    basePrice: 150,
    pricePerKm: 8,
    features: ["Reliable", "Shared ride"],
    estimatedTime: "1h 30m",
    available: 2
  },
  // Add more vehicles as needed
];

export default function BookingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[0] | null>(null);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Mock route data - replace with actual data from your state/context
  const routeDetails = {
    from: "Clock Tower Square, Thimphu",
    to: "Paro Airport, Paro",
    distance: 55, // km
    date: "2023-11-15"
  };

  const calculatePrice = (vehicle: typeof vehicles[0]) => {
    return vehicle.basePrice + (vehicle.pricePerKm * routeDetails.distance);
  };

  const handleBookNow = () => {
    if (!selectedVehicle) return;
    
    setLoading(true);
    // Simulate booking processing
    setTimeout(() => {
      alert(`Booking confirmed!\n\n${selectedVehicle.name} from ${routeDetails.from} to ${routeDetails.from}\nTotal: Nu.${calculatePrice(selectedVehicle)}`);
      setLoading(false);
      // router.push('/booking-confirmation'); // Uncomment to redirect after booking
    }, 1500);
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Booking Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Your Ride</h1>
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="text-emerald-500 mr-2" />
            <span className="font-medium">{routeDetails.from} to {routeDetails.to}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Vehicle Selection */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Vehicles</h2>
              
              {/* Vehicle Type Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button 
                  className={`px-6 py-3 font-medium flex items-center ${vehicleTypeFilter === 'all' ? 'text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-600'}`}
                  onClick={() => setVehicleTypeFilter('all')}
                >
                  All Vehicles
                </button>
                <button 
                  className={`px-6 py-3 font-medium flex items-center ${vehicleTypeFilter === 'taxi' ? 'text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-600'}`}
                  onClick={() => setVehicleTypeFilter('taxi')}
                >
                  <FaTaxi className="mr-2" /> Taxis
                </button>
                <button 
                  className={`px-6 py-3 font-medium flex items-center ${vehicleTypeFilter === 'bus' ? 'text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-600'}`}
                  onClick={() => setVehicleTypeFilter('bus')}
                >
                  <FaBus className="mr-2" /> Buses
                </button>
              </div>
              
              {/* Vehicle Listing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="vehicleListing">
                {vehicles
                  .filter(vehicle => vehicleTypeFilter === 'all' || vehicle.type === vehicleTypeFilter)
                  .map(vehicle => (
                    <div 
                      key={vehicle.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedVehicle?.id === vehicle.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 mb-4 md:mb-0 md:mr-4">
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.name} 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg text-gray-800">{vehicle.name}</h3>
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
                              {vehicle.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <FaUsers className="mr-2" />
                            <span>{vehicle.capacity}</span>
                            <FaClock className="ml-4 mr-2" />
                            <span>{vehicle.estimatedTime}</span>
                          </div>
                          <div className="my-3">
                            {vehicle.features.map(feature => (
                              <span key={feature} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">{vehicle.available} available</span>
                            <span className="font-bold text-emerald-600">Nu.{calculatePrice(vehicle)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Booking Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Summary</h2>
              
              {/* Route Details */}
              <div className="mb-6">
                <div className="flex items-start mb-4">
                  <div className="bg-emerald-100 p-2 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">From</h3>
                    <p className="text-gray-600">{routeDetails.from}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-full mr-4">
                    <FaFlagCheckered className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">To</h3>
                    <p className="text-gray-600">{routeDetails.to}</p>
                  </div>
                </div>
              </div>
              
              {/* Selected Vehicle */}
              <div className="mb-6 border-t border-gray-200 pt-6">
                <h3 className="font-medium text-gray-800 mb-3">Your Vehicle</h3>
                {selectedVehicle ? (
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          {selectedVehicle.type === 'bus' ? (
                            <FaBus className="text-emerald-600" />
                          ) : (
                            <FaTaxi className="text-emerald-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{selectedVehicle.name}</h3>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{selectedVehicle.capacity}</span>
                          <span className="font-medium text-emerald-600">Nu.{calculatePrice(selectedVehicle)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                    <p className="text-gray-600 text-center">No vehicle selected</p>
                  </div>
                )}
              </div>
              
              {/* Price Breakdown */}
              {selectedVehicle && (
                <>
                  <div className="mb-6 border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-800 mb-3">Price Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Fare</span>
                        <span className="font-medium">Nu.{selectedVehicle.basePrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance ({routeDetails.distance}km)</span>
                        <span className="font-medium">Nu.{selectedVehicle.pricePerKm * routeDetails.distance}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Price */}
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        Nu.{calculatePrice(selectedVehicle)}
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={!selectedVehicle || loading}
                className={`w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-bold hover:shadow-lg transition-all ${!selectedVehicle || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 inline" />
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}