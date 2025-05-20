// src/components/faqs/FaqSection.tsx
'use client';

import { useState } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

export default function FaqSection() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: "How do I book a taxi or bus?",
      answer: "You can book through our website, or by calling our customer service. Online bookings are available 24/7 and provide instant confirmation."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, mobile payments (like PayPal), and cash payments. For online bookings, payment is required at the time of reservation."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify your booking through your account dashboard or by contacting customer service. Cancellation policies vary based on service type and timing."
    },
    {
      question: "How are your fares calculated?",
      answer: "Fares are calculated based on distance, vehicle type, and demand. You'll see the estimated fare before confirming your booking. Additional charges may apply for waiting time or extra stops."
    },
    {
      question: "What safety measures do you have in place?",
      answer: "All our vehicles are regularly sanitized, and drivers undergo health checks. We provide contactless payment options and require masks in vehicles when local regulations mandate them."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section id="faqs" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">Frequently Asked Questions</h2>
          <p className="text-black max-w-2xl mx-auto">Find quick answers to common questions about our transportation services.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* FAQ Search */}
          <div className="relative mb-8">
            <input 
              type="text" 
              placeholder="Search questions..." 
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-4 text-gray-400" />
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4" id="faqAccordion">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:border-emerald-300 transition-all">
                  <button 
                    className="faq-question w-full flex justify-between items-center p-6 text-left focus:outline-none"
                    onClick={() => toggleQuestion(index)}
                  >
                    <h3 className="text-lg font-semibold text-black">{faq.question}</h3>
                    <FaChevronDown className={`text-emerald-500 transition-transform duration-300 ${activeQuestion === index ? 'transform rotate-180' : ''}`} />
                  </button>
                  {activeQuestion === index && (
                    <div className="faq-answer px-6 pb-6">
                      <p className="text-black">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FaSearch className="text-gray-400 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-black mb-2">No questions found</h3>
                <p className="text-black">Try searching with different keywords or contact our support team.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}