'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCar, FaHistory, FaMapMarkerAlt, FaClock, FaCheck, FaSpinner, FaUsers } from 'react-icons/fa';
import DashboardLayout from '../components/common/DashboardLayout';
import Link from 'next/link';

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
}

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check user role
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'passenger') {
      if (user.role === 'driver') {
        router.push('/driver/dashboard');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      }
      return;
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
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
        setBookings(data.bookings);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="passenger">
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="passenger">
      <div className="space-y-6">
        {/* Success Message */}
        {searchParams.get('booking') === 'success' && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your booking has been confirmed successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900">Passenger Dashboard</h1>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">
                  No bookings found. Book your first ride!
                </li>
              ) : (
                bookings.map((booking) => (
                  <li key={booking._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {booking.vehicleName}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                          <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p className="truncate text-gray-900">
                            {booking.pickupLocation} → {booking.dropoffLocation}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            {new Date(booking.pickupTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-sm font-medium text-gray-900">
                          Nu. {booking.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 