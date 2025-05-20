'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaHome, FaCar, FaHistory, FaCog, FaBars, FaTimes } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'passenger' | 'driver';
}

export default function DashboardLayout({
  children,
  role
}: {
  children: React.ReactNode;
  role: 'passenger' | 'driver';
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getNavItems = () => {
    const commonItems = [
      { href: role === 'driver' ? '/driver/dashboard' : '/dashboard', label: 'Dashboard', icon: <FaHome /> },
      { href: '/profile', label: 'Profile', icon: <FaUser /> },
    ];

    switch (role) {
      case 'passenger':
        return [
          ...commonItems,
          { href: '/book', label: 'Book a Ride', icon: <FaCar /> },
          { href: '/rides', label: 'Ride History', icon: <FaHistory /> },
        ];
      case 'driver':
        return commonItems;
      default:
        return commonItems;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
              >
                {isSidebarOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>

            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 hidden sm:inline">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-indigo-600"
                  >
                    <FaSignOutAlt className="mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Mobile */}
          {isSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)}></div>
              <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
                <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Menu</span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-gray-500 hover:text-gray-600"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                  {getNavItems().map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {getNavItems().map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 