// src/app/(main)/register/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'passenger',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      // Auto-login after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/');
    } catch (error) {
      setErrors({ 
        form: error instanceof Error ? error.message : 'Registration failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  // No session check here anymore

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md hover:scale-[1.02] transition-transform">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Join RideEase</h1>
          <p className="opacity-90">Create your account in just 2 minutes</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                {errors.form}
              </div>
            )}

            {step === 1 && (
              <div id="step1">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-3 text-emerald-500" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 !text-black placeholder-gray-500"
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-3 text-emerald-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 !text-black placeholder-gray-500"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-3 text-emerald-500" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 !text-black placeholder-gray-500"
                      placeholder="+975 17 123 456"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => validateStep1() && setStep(2)}
                  className="w-full px-6 py-4 bg-green-300 hover:bg-green-500 text-black rounded-lg font-bold transition-all shadow-md hover:shadow-lg mt-6"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div id="step2">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">I want to:</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="radio"
                        id="passenger"
                        name="userType"
                        value="passenger"
                        checked={formData.userType === 'passenger'}
                        onChange={handleChange}
                        className="hidden peer"
                      />
                      <label
                        htmlFor="passenger"
                        className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-emerald-500 peer-checked:bg-emerald-50 hover:bg-gray-50"
                      >
                        <FaUser className="text-2xl mb-2 text-emerald-600" />
                        <span>Book Rides</span>
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="driver"
                        name="userType"
                        value="driver"
                        checked={formData.userType === 'driver'}
                        onChange={handleChange}
                        className="hidden peer"
                      />
                      <label
                        htmlFor="driver"
                        className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-emerald-500 peer-checked:bg-emerald-50 hover:bg-gray-50"
                      >
                        <FaUser className="text-2xl mb-2 text-emerald-600" />
                        <span>Drive</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                    Create Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-3 text-emerald-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 !text-black placeholder-gray-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-gray-400 hover:text-emerald-500"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-3 text-emerald-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 !text-black placeholder-gray-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-3 text-gray-400 hover:text-emerald-500"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                
                <div className="flex items-start pt-2">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-600">
                      I agree to the{' '}
                      <Link href="/terms" className="text-emerald-600 hover:text-emerald-700">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition-all flex items-center justify-center"
                  >
                    <FaArrowLeft className="mr-2" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-green-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
          
          <div className="mt-8">
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or sign up with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-6">
              <button
                type="button"
                onClick={() => signIn('google')}
                className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
              >
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


