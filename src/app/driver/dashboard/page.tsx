'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/common/DashboardLayout';
import { FaCar, FaMoneyBillWave, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import Link from 'next/link';

interface RideRequest {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  vehicleType: string;
  vehicleName: string;
  passengers: number;
  createdAt: string;
}

interface AcceptedRide extends RideRequest {
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Earnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export default function DriverDashboard() {
  const router = useRouter();
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [acceptedRides, setAcceptedRides] = useState<AcceptedRide[]>([]);
  const [earnings, setEarnings] = useState<Earnings>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check user role
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'driver') {
      router.push('/dashboard');
      return;
    }

    const fetchRideRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view ride requests');
        }

        // Fetch all pending bookings that haven't been accepted by any driver
        const response = await fetch('/api/bookings/pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch ride requests');
        }

        const data = await response.json();
        // Ensure we have an array of bookings
        const pendingRequests = Array.isArray(data) ? data : [];
        setRideRequests(pendingRequests);
      } catch (err: any) {
        console.error('Error fetching ride requests:', err);
        setRideRequests([]);
      }
    };

    const fetchAcceptedRides = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view accepted rides');
        }

        const response = await fetch('/api/driver/accepted-rides', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch accepted rides');
        }

        const data = await response.json();
        setAcceptedRides(data.rides || []);
        
        // Update earnings
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const todayEarnings = data.rides
          .filter((ride: AcceptedRide) => new Date(ride.createdAt) >= startOfDay)
          .reduce((sum: number, ride: AcceptedRide) => sum + (ride.price || 0), 0);

        const weekEarnings = data.rides
          .filter((ride: AcceptedRide) => new Date(ride.createdAt) >= startOfWeek)
          .reduce((sum: number, ride: AcceptedRide) => sum + (ride.price || 0), 0);

        const monthEarnings = data.rides
          .filter((ride: AcceptedRide) => new Date(ride.createdAt) >= startOfMonth)
          .reduce((sum: number, ride: AcceptedRide) => sum + (ride.price || 0), 0);

        setEarnings({
          today: todayEarnings,
          thisWeek: weekEarnings,
          thisMonth: monthEarnings
        });
      } catch (err: any) {
        console.error('Error fetching accepted rides:', err);
        setAcceptedRides([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data immediately
    fetchRideRequests();
    fetchAcceptedRides();

    // Set up polling to check for new requests every 30 seconds
    const pollInterval = setInterval(() => {
      fetchRideRequests();
      fetchAcceptedRides();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(pollInterval);
  }, [router]);

  const handleAcceptRide = async (rideId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to accept rides');
      }

      const response = await fetch('/api/driver/accept-ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId: rideId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept ride');
      }

      // Remove the accepted ride from the list
      setRideRequests(prev => prev.filter(ride => ride._id !== rideId));
      
      // Add the accepted ride to the accepted rides list
      setAcceptedRides(prev => [data.booking, ...prev]);

      // Update earnings
      setEarnings(prev => ({
        ...prev,
        today: prev.today + (data.booking.price || 0),
        thisWeek: prev.thisWeek + (data.booking.price || 0),
        thisMonth: prev.thisMonth + (data.booking.price || 0)
      }));
      
      // Show success message
      alert(data.message || 'Ride request accepted successfully!');
    } catch (err: any) {
      console.error('Error accepting ride:', err);
      alert(err.message || 'Failed to accept ride. Please try again.');
    }
  };

  return (
    <DashboardLayout role="driver">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaMoneyBillWave className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                <p className="text-lg font-semibold text-gray-900">Nu.{earnings.today.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaMoneyBillWave className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-lg font-semibold text-gray-900">Nu.{earnings.thisWeek.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaMoneyBillWave className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-lg font-semibold text-gray-900">Nu.{earnings.thisMonth.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accepted Rides */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Accepted Rides</h2>
            <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
              {acceptedRides.length} Active Rides
            </span>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : acceptedRides.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No accepted rides at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {acceptedRides.map((ride) => (
                <div key={ride._id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-green-800">
                        <FaMapMarkerAlt className="mr-2" />
                        <span className="font-medium">{ride.pickupLocation} → {ride.dropoffLocation}</span>
                      </div>
                      <div className="flex items-center text-sm text-green-700">
                        <FaClock className="mr-2" />
                        <span>{new Date(ride.pickupTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-green-700">
                        <FaUsers className="mr-2" />
                        <span>{ride.passengers} {ride.passengers === 1 ? 'Passenger' : 'Passengers'}</span>
                      </div>
                      <div className="flex items-center text-sm text-green-700">
                        <FaCar className="mr-2" />
                        <span>
                          {ride.vehicleType ? ride.vehicleType.charAt(0).toUpperCase() + ride.vehicleType.slice(1) : 'Standard'} • {ride.vehicleName || 'Not specified'}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-green-900">
                        Fare: Nu.{ride.price?.toFixed(2) || '0.00'}
                      </div>
                      {ride.user && (
                        <div className="text-sm text-green-700">
                          <p>Passenger: {ride.user.name}</p>
                          <p>Contact: {ride.user.phone}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Ride Requests */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Available Ride Requests</h2>
            <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
              {rideRequests.length} Available Requests
            </span>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : rideRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No available ride requests at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rideRequests.map((ride) => (
                <div key={ride._id} className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 hover:border-emerald-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-emerald-800">
                        <FaMapMarkerAlt className="mr-2" />
                        <span className="font-medium">{ride.pickupLocation} → {ride.dropoffLocation}</span>
                      </div>
                      <div className="flex items-center text-sm text-emerald-700">
                        <FaClock className="mr-2" />
                        <span>{new Date(ride.pickupTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-emerald-700">
                        <FaUsers className="mr-2" />
                        <span>{ride.passengers} {ride.passengers === 1 ? 'Passenger' : 'Passengers'}</span>
                      </div>
                      <div className="flex items-center text-sm text-emerald-700">
                        <FaCar className="mr-2" />
                        <span>
                          {ride.vehicleType ? ride.vehicleType.charAt(0).toUpperCase() + ride.vehicleType.slice(1) : 'Standard'} • {ride.vehicleName || 'Not specified'}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-emerald-900">
                        Fare: Nu.{ride.price?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Available for Pickup
                      </span>
                      <button
                        onClick={() => handleAcceptRide(ride._id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Accept Ride
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 