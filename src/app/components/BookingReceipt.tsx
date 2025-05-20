'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload, FaCheckCircle } from 'react-icons/fa';

interface BookingReceiptProps {
  booking: {
    _id: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    pickupTime: string;
    passengers: number;
    vehicleType: string;
    status: string;
    price: number;
    driver?: {
      name: string;
      phone: string;
      vehicleDetails: string;
    };
    createdAt: string;
  };
}

export default function BookingReceipt({ booking }: BookingReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
        windowHeight: receiptRef.current.scrollHeight + 200,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('receipt');
          if (clonedElement) {
            clonedElement.style.width = '800px';
            clonedElement.style.padding = '40px';
            clonedElement.style.margin = '0';
            clonedElement.style.backgroundColor = '#ffffff';
          }
        },
      });

      const link = document.createElement('a');
      link.download = `booking-receipt-${booking._id}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200" ref={receiptRef} id="receipt">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-indigo-100">Your ride has been successfully booked</p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6">
          {/* Booking ID */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="text-lg font-semibold text-gray-900">{booking._id}</p>
            </div>
            <div className="flex items-center text-green-600">
              <FaCheckCircle className="mr-2" />
              <span className="font-medium">{booking.status}</span>
            </div>
          </div>

          {/* Journey Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="text-gray-900">{booking.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dropoff Location</p>
                  <p className="text-gray-900">{booking.dropoffLocation}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Vehicle Type</p>
                  <p className="text-gray-900 capitalize">{booking.vehicleType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Passengers</p>
                  <p className="text-gray-900">{booking.passengers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Time */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pickup Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-gray-900">{new Date(booking.pickupDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-gray-900">{booking.pickupTime}</p>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          {booking.driver && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Driver Name</p>
                  <p className="text-gray-900">{booking.driver.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p className="text-gray-900">{booking.driver.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Vehicle Details</p>
                  <p className="text-gray-900">{booking.driver.vehicleDetails}</p>
                </div>
              </div>
            </div>
          )}

          {/* Price Information */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-indigo-600">${booking.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Booking Date */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              Booked on {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleDownload}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <FaDownload className="mr-2" />
          Download Receipt
        </button>
      </div>
    </div>
  );
} 