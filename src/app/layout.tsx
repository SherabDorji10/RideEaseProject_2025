// src/app/(main)/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/common/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RideEase - Your Smart Ride Booking Platform',
  description: 'Book rides easily and efficiently with RideEase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-white border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center text-gray-600 text-sm">
                © {new Date().getFullYear()} RideEase. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}