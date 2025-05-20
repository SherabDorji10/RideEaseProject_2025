'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/common/DashboardLayout';
import { FaUser, FaEnvelope, FaPhone, FaCar, FaIdCard } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'passenger' | 'driver';
  driverDetails?: {
    licenseNumber: string;
    vehicleType: 'taxi' | 'bus';
    vehicleNumber: string;
    experience: number;
  };
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout role={user?.role || 'passenger'}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role={user?.role || 'passenger'}>
        <div className="text-red-500 text-center py-8">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={user?.role || 'passenger'}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

        {/* Profile Information */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FaUser className="text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">
                {user?.role === 'driver' ? 'Driver' : 'Passenger'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <FaEnvelope className="mr-3 text-gray-400" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaPhone className="mr-3 text-gray-400" />
              <span>{user?.phone || 'Not provided'}</span>
            </div>

            {user?.role === 'driver' && user?.driverDetails && (
              <>
                <div className="border-t border-gray-200 my-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                <div className="flex items-center text-gray-700">
                  <FaCar className="mr-3 text-gray-400" />
                  <span>{user.driverDetails.vehicleNumber} ({user.driverDetails.vehicleType})</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaIdCard className="mr-3 text-gray-400" />
                  <span>License Number: {user.driverDetails.licenseNumber}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaUser className="mr-3 text-gray-400" />
                  <span>Experience: {user.driverDetails.experience} years</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push('/profile/edit')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 