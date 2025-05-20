// src/components/common/Footer.tsx
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import {FaShuttleVan} from 'react-icons/fa';
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <div className="p-2 bg-emerald-500 rounded-lg mr-3">
                <FaShuttleVan />
              </div>
              RideEase
            </h3>
            <p className="text-gray-400 mb-6">
              Your trusted partner for smart transportation solutions across Bhutan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition">
                <FaLinkedin />
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/booking" className="text-gray-400 hover:text-emerald-400 transition">City Taxi</Link></li>
              <li><Link href="/booking" className="text-gray-400 hover:text-emerald-400 transition">Intercity Bus</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/faqs" className="text-gray-400 hover:text-emerald-400 transition">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} RideEase. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-500 hover:text-emerald-400 transition">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-emerald-400 transition">Privacy Policy</Link>
            <Link href="/cookies" className="text-gray-500 hover:text-emerald-400 transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}