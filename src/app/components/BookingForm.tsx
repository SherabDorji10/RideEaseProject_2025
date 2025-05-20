'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaTaxi, FaBus, FaMapMarkerAlt, FaFlagCheckered, FaCalendarDay, FaUsers, FaSpinner, FaCheck, FaWifi, FaSnowflake, FaUserTie, FaCar } from 'react-icons/fa';
import BookingReceipt from './BookingReceipt';

interface Vehicle {
  id: number;
  name: string;
  type: 'taxi' | 'bus' | 'sedan' | 'suv' | 'luxury';
  image: string;
  capacity: string;
  basePrice: number;
  pricePerKm: number;
  features: string[];
  estimatedTime: string;
  available: number;
}

interface BookingDetails {
  from: string;
  to: string;
  date: string;
  passengers: string;
  vehicleType: 'taxi' | 'bus' | 'sedan' | 'suv' | 'luxury';
}

// Mock vehicle data with real images
const mockVehicles: Vehicle[] = [
  {
    id: 1,
    name: "WagonR Taxi",
    type: "taxi",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    capacity: "3 passengers",
    basePrice: 50,
    pricePerKm: 10,
    features: ["AC", "Local driver", "Comfortable seats"],
    estimatedTime: "1h 15m",
    available: 5
  },
  {
    id: 2,
    name: "Bumpa Bus",
    type: "bus",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    capacity: "12 passengers",
    basePrice: 150,
    pricePerKm: 8,
    features: ["AC", "WiFi", "Shared ride"],
    estimatedTime: "1h 30m",
    available: 2
  },
  {
    id: 3,
    name: "Luxury Taxi",
    type: "taxi",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    capacity: "4 passengers",
    basePrice: 100,
    pricePerKm: 15,
    features: ["Premium AC", "Professional driver", "Leather seats"],
    estimatedTime: "1h 15m",
    available: 3
  }
];

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleType, setVehicleType] = useState<'all' | 'taxi' | 'bus' | 'sedan' | 'suv' | 'luxury'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    from: '',
    to: '',
    date: '',
    passengers: '1',
    vehicleType: 'taxi'
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);

  useEffect(() => {
    // Read URL parameters
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const date = searchParams.get('date') || '';
    const passengers = searchParams.get('passengers') || '1';
    const vehicleType = (searchParams.get('vehicleType') as 'taxi' | 'bus' | 'sedan' | 'suv' | 'luxury') || 'taxi';

    setBookingDetails({
      from,
      to,
      date,
      passengers,
      vehicleType
    });

    // Set initial vehicle type filter
    setVehicleType(vehicleType);
  }, [searchParams]);

  const calculateVehiclePrice = (vehicle: Vehicle) => {
    const distance = 55; // km (Thimphu to Paro)
    return vehicle.basePrice + (vehicle.pricePerKm * distance);
  };

  const handleBooking = async () => {
    if (!selectedVehicle) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to book a ride');
      }

      // Create the booking payload
      const bookingPayload = {
        pickupLocation: bookingDetails.from,
        dropoffLocation: bookingDetails.to,
        pickupTime: bookingDetails.date,
        price: calculateVehiclePrice(selectedVehicle),
        status: 'pending',
        paymentStatus: 'pending',
        vehicleType: selectedVehicle.type,
        vehicleName: selectedVehicle.name,
        passengers: parseInt(bookingDetails.passengers)
      };

      console.log('Selected Vehicle:', selectedVehicle);
      console.log('Booking Details:', bookingDetails);
      console.log('Sending booking payload:', bookingPayload);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('Received booking data:', data.booking);

      // Ensure the booking data has all required fields
      const bookingData = {
        ...data.booking,
        vehicleType: selectedVehicle.type,
        vehicleName: selectedVehicle.name,
        passengers: parseInt(bookingDetails.passengers)
      };

      console.log('Final booking data being passed to receipt:', bookingData);
      setBookingData(bookingData);
      setBookingSuccess(true);
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicleType === 'all' 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.type === vehicleType);

  if (bookingSuccess && bookingData) {
    return (
      <section className="py-12 px-4 relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-90 z-0"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <BookingReceipt booking={bookingData} />
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-90 z-0"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Booking Header */}
        <div className="mb-8 text-emerald-800">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Your Ride</h1>
          <div className="flex items-center text-emerald-700">
            <FaMapMarkerAlt className="text-emerald-600 mr-2" />
            <span className="font-medium">{bookingDetails.from} to {bookingDetails.to}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Vehicle Selection */}
          <div className="lg:w-2/3">
            <div className="bg-emerald-100 rounded-xl shadow-lg p-6 mb-6 border border-emerald-300">
              <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Available Vehicles</h2>
              
              {/* Vehicle Type Tabs */}
              <div className="flex border-b border-emerald-400 mb-6">
                <button 
                  className={`px-6 py-3 font-medium text-lg transition-all duration-300 ${
                    vehicleType === 'all' 
                      ? 'text-emerald-800 border-b-2 border-emerald-600' 
                      : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                  onClick={() => setVehicleType('all')}
                >
                  All Vehicles
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-lg transition-all duration-300 ${
                    vehicleType === 'taxi' 
                      ? 'text-emerald-800 border-b-2 border-emerald-600' 
                      : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                  onClick={() => setVehicleType('taxi')}
                >
                  <FaTaxi className="mr-2 inline" /> Taxis
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-lg transition-all duration-300 ${
                    vehicleType === 'bus' 
                      ? 'text-emerald-800 border-b-2 border-emerald-600' 
                      : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                  onClick={() => setVehicleType('bus')}
                >
                  <FaBus className="mr-2 inline" /> Buses
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-lg transition-all duration-300 ${
                    vehicleType === 'sedan' 
                      ? 'text-emerald-800 border-b-2 border-emerald-600' 
                      : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                  onClick={() => setVehicleType('sedan')}
                >
                  <FaCar className="mr-2 inline" /> Sedans
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-lg transition-all duration-300 ${
                    vehicleType === 'suv' 
                      ? 'text-emerald-800 border-b-2 border-emerald-600' 
                      : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                  onClick={() => setVehicleType('suv')}
                >
                  <FaCar className="mr-2 inline" /> SUVs
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-lg transition-all duration-300 ${
                    vehicleType === 'luxury' 
                      ? 'text-emerald-800 border-b-2 border-emerald-600' 
                      : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                  onClick={() => setVehicleType('luxury')}
                >
                  <FaCar className="mr-2 inline" /> Luxury
                </button>
              </div>
              
              {/* Vehicle Listing */}
              <div className="space-y-4">
                {filteredVehicles.map(vehicle => (
                  <div 
                    key={vehicle.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedVehicle?.id === vehicle.id 
                        ? 'bg-emerald-200 border-2 border-emerald-600' 
                        : 'bg-white border border-emerald-300 hover:bg-emerald-50'
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name} 
                          className="w-full h-48 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-emerald-800 mb-1">{vehicle.name}</h3>
                            <p className="text-emerald-700">{vehicle.capacity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600">
                              Nu.{calculateVehiclePrice(vehicle).toLocaleString()}
                            </p>
                            <p className="text-emerald-700">Estimated time: {vehicle.estimatedTime}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.features.map((feature, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-emerald-200 rounded-full text-emerald-800 text-sm"
                            >
                              {feature}
                            </span>
                          ))}
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
            <div className="bg-emerald-100 rounded-xl shadow-lg p-6 border border-emerald-300">
              <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Booking Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700">From:</span>
                  <span className="font-medium text-emerald-800">{bookingDetails.from}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700">To:</span>
                  <span className="font-medium text-emerald-800">{bookingDetails.to}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700">Date:</span>
                  <span className="font-medium text-emerald-800">{new Date(bookingDetails.date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700">Passengers:</span>
                  <span className="font-medium text-emerald-800">{bookingDetails.passengers}</span>
                </div>
                {selectedVehicle && (
                  <>
                    <div className="border-t border-emerald-300 my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-700">Selected Vehicle:</span>
                      <span className="font-medium text-emerald-800">{selectedVehicle.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-700">Total Price:</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        Nu.{calculateVehiclePrice(selectedVehicle).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedVehicle || loading}
                className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                  selectedVehicle 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-emerald-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 