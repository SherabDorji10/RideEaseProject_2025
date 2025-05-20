// src/components/about/AboutSection.tsx
'use client';

import { useState } from 'react';
import { FaShieldAlt, FaLeaf, FaHeart, FaUserTie, FaTaxi, FaHeadset } from 'react-icons/fa';

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState('mission');
  const [mainImage, setMainImage] = useState('https://www.regent-holidays.co.uk/upload-files/blog-sections/section-89_1081.jpg');

  return (
    <section className="py-16 px-4 bg-white" id="about">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Connecting Bhutan through reliable and comfortable transportation</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Image Gallery */}
          <div className="lg:w-1/2 relative">
            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={mainImage} 
                alt="Our Team" 
                className="w-full h-full object-cover transition-opacity duration-500 opacity-100"
              />
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {[
                  "https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                ].map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`w-3 h-3 rounded-full ${mainImage === img ? 'bg-white' : 'bg-white bg-opacity-60'} hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content with Tabs */}
          <div className="lg:w-1/2">
            <div className="flex border-b border-gray-200 mb-6">
              <button 
                onClick={() => setActiveTab('mission')}
                className={`about-tab px-6 py-3 font-medium ${activeTab === 'mission' ? 'text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-600'}`}
              >
                Mission
              </button>
              <button 
                onClick={() => setActiveTab('values')}
                className={`about-tab px-6 py-3 font-medium ${activeTab === 'values' ? 'text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-600'}`}
              >
                Values
              </button>
              <button 
                onClick={() => setActiveTab('team')}
                className={`about-tab px-6 py-3 font-medium ${activeTab === 'team' ? 'text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-600'}`}
              >
                Team
              </button>
            </div>

            <div className="about-content space-y-6">
              {/* Mission Tab Content */}
              {activeTab === 'mission' && (
                <div id="mission">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Redefining Transportation in Bhutan</h3>
                  <p className="text-gray-600 mb-4">Founded in 2025, RideEase has grown from a small taxi service to Bhutan's most trusted transportation network, serving thousands of happy customers across the country.</p>
                  <p className="text-gray-600">Our mission is to provide safe, reliable, and affordable transportation solutions while preserving Bhutan's unique cultural and environmental heritage.</p>
                </div>
              )}

              {/* Values Tab Content */}
              {activeTab === 'values' && (
                <div id="values">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Core Values</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-emerald-100 p-2 rounded-full mr-4">
                        <FaShieldAlt className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Safety First</h4>
                        <p className="text-gray-600">Rigorous driver screening and regular vehicle maintenance ensure your peace of mind.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-emerald-100 p-2 rounded-full mr-4">
                        <FaLeaf className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Eco-Friendly</h4>
                        <p className="text-gray-600">We're transitioning to electric vehicles to reduce our carbon footprint.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-emerald-100 p-2 rounded-full mr-4">
                        <FaHeart className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Community Focused</h4>
                        <p className="text-gray-600">10% of profits go towards local education and infrastructure projects.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              )}

              {/* Team Tab Content */}
              {activeTab === 'team' && (
                <div id="team">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Meet Our Team</h3>
                  <p className="text-gray-600 mb-4">Our diverse team of 50+ professionals is united by a passion for service excellence.</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2">
                        <FaUserTie className="text-emerald-600 text-2xl" />
                      </div>
                      <h4 className="font-medium text-gray-800">Management</h4>
                      <p className="text-gray-600 text-sm">50 members</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2">
                        <FaTaxi className="text-emerald-600 text-2xl" />
                      </div>
                      <h4 className="font-medium text-gray-800">Drivers</h4>
                      <p className="text-gray-600 text-sm">500+ professionals</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2">
                        <FaHeadset className="text-emerald-600 text-2xl" />
                      </div>
                      <h4 className="font-medium text-gray-800">Support</h4>
                      <p className="text-gray-600 text-sm">24/7 available</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-emerald-600 font-bold text-2xl mb-1">1+</div>
                <div className="text-gray-600 text-sm">Years Serving</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-emerald-600 font-bold text-2xl mb-1">130+</div>
                <div className="text-gray-600 text-sm">Rides Completed</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-emerald-600 font-bold text-2xl mb-1">20</div>
                <div className="text-gray-600 text-sm">Dzongkhags Covered</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-emerald-600 font-bold text-2xl mb-1">1000+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}