// src/components/home/HowItWorks.tsx
import { FaTaxi, FaMapMarkedAlt, FaExchangeAlt, FaCheckCircle } from 'react-icons/fa';

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gradient-to-br from-green-100 to-green-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-800 max-w-2xl mx-auto">Get your ride in just a few simple steps</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-emerald-100 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Choose Service</h3>
            <p className="text-gray-800 text-sm">Select taxi or bus</p>
          </div>
          
          {/* Step 2 */}
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-emerald-100 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Enter Details</h3>
            <p className="text-gray-800 text-sm">Pickup, destination, date & time</p>
          </div>
          
          {/* Step 3 */}
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-emerald-100 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Compare Options</h3>
            <p className="text-gray-800 text-sm">View available vehicles and prices</p>
          </div>
          
          {/* Step 4 */}
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-emerald-100 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              4
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Book & Enjoy</h3>
            <p className="text-gray-800 text-sm">Confirm and track your ride</p>
          </div>
        </div>
      </div>
    </section>
  );
}