'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaCar, FaMoneyBillWave } from 'react-icons/fa';
import DashboardLayout from '../components/common/DashboardLayout';

interface Booking {
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
  driver?: {
    name: string;
    phone: string;
  };
}

export default function RideHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view your ride history');
        }

        const response = await fetch('/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        // Filter only confirmed bookings
        const confirmedBookings = data.bookings ? data.bookings.filter((booking: Booking) => booking.status === 'confirmed') : [];
        setBookings(confirmedBookings);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setBookings([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="passenger">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="passenger">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="passenger">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Ride History</h1>
        
        {!bookings || bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No confirmed rides found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <div className="flex flex-col gap-6">
                  {/* Vehicle Information */}
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <FaCar className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.vehicleName}</h3>
                      <p className="text-sm text-gray-500">{booking.vehicleType}</p>
                    </div>
                  </div>

                  {/* Route Information */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="mt-1 text-gray-600" />
                      <div>
                        <span className="font-medium block text-gray-600">Pickup:</span>
                        <span className="block mt-1 text-gray-900">{booking.pickupLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="mt-1 text-gray-600" />
                      <div>
                        <span className="font-medium block text-gray-600">Dropoff:</span>
                        <span className="block mt-1 text-gray-900">{booking.dropoffLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Information */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start gap-2">
                      <FaCalendarAlt className="mt-1 text-gray-600" />
                      <div>
                        <span className="font-medium block text-gray-600">Pickup Time:</span>
                        <span className="block mt-1 text-gray-900">{new Date(booking.pickupTime).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Booking Details</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <span className="text-gray-600 block">Booking ID:</span>
                        <span className="text-gray-900 block mt-1 text-sm break-all">{booking._id}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600 block">Booked On:</span>
                          <span className="text-gray-900 block mt-1">{new Date(booking.createdAt).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Status:</span>
                          <span className="text-gray-900 block mt-1 capitalize">{booking.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Information */}
                  {booking.driver && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Driver Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600 block">Name:</span>
                          <span className="text-gray-900 block mt-1">{booking.driver.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Phone:</span>
                          <span className="text-gray-900 block mt-1">{booking.driver.phone}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price Information */}
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <FaMoneyBillWave className="text-green-600" />
                      <span>Nu.{booking.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 