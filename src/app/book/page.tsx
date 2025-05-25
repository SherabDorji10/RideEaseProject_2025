'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import BookingForm from '../components/BookingForm';

export default function BookPage() {
  const router = useRouter();

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
      }
      return;
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
} 