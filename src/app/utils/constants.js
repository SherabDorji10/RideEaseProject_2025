// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  DRIVER: {
    RIDES: '/api/driver/rides',
    ACCEPT_RIDE: '/api/driver/accept-ride',
    EARNINGS: '/api/driver/earnings',
    COMPLETE_RIDE: '/api/driver/complete-ride',
  },
  PASSENGER: {
    BOOK_RIDE: '/api/bookings',
    RIDE_HISTORY: '/api/bookings/history',
  },
  USER: {
    PROFILE: '/api/user/profile',
    NOTIFICATIONS: '/api/user/notifications',
  },
};

// User Roles
export const USER_ROLES = {
  DRIVER: 'driver',
  PASSENGER: 'passenger',
};

// Ride Status
export const RIDE_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Vehicle Types
export const VEHICLE_TYPES = {
  SEDAN: 'sedan',
  SUV: 'suv',
  VAN: 'van',
  LUXURY: 'luxury',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  RIDE_ACCEPTED: 'ride_accepted',
  RIDE_COMPLETED: 'ride_completed',
  RIDE_CANCELLED: 'ride_cancelled',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_FAILED: 'payment_failed',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DRIVER_DASHBOARD: '/driver/dashboard',
  BOOK_RIDE: '/book',
  RIDE_HISTORY: '/rides',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

// API Response Messages
export const API_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SUCCESS: 'Operation successful',
};

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^\+?[\d\s-]{10,}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// UI Constants
export const UI = {
  MAX_PASSENGERS: 4,
  MIN_FARE: 5,
  MAX_FARE: 1000,
  CURRENCY: 'USD',
  DATE_FORMAT: 'MMM dd, yyyy',
  TIME_FORMAT: 'hh:mm a',
  DATETIME_FORMAT: 'MMM dd, yyyy hh:mm a',
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PASSWORD_REQUIREMENTS: 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  SESSION_EXPIRED: 'Your session has expired. Please log in again',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  REGISTER_SUCCESS: 'Account created successfully',
  BOOKING_SUCCESS: 'Ride booked successfully',
  RIDE_ACCEPTED: 'Ride request accepted',
  RIDE_COMPLETED: 'Ride completed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
};

// Popular Bhutan Locations
export const BHUTAN_LOCATIONS = {
  THIMPHU: {
    name: 'Thimphu',
    popularPlaces: [
      'Memorial Chorten',
      'Tashichho Dzong',
      'Buddha Dordenma',
      'Motithang Takin Preserve',
      'National Library',
      'Folk Heritage Museum',
      'Weekend Market',
      'Changangkha Lhakhang',
      'Dechen Phodrang Monastery',
      'Simtokha Dzong'
    ]
  },
  PARO: {
    name: 'Paro',
    popularPlaces: [
      'Paro Taktsang (Tiger\'s Nest)',
      'Rinpung Dzong',
      'National Museum',
      'Drukgyel Dzong',
      'Kyichu Lhakhang',
      'Paro Airport',
      'Dumtse Lhakhang',
      'Chele La Pass',
      'Paro Valley Viewpoint',
      'Ugyen Pelri Palace'
    ]
  },
  PUNAKHA: {
    name: 'Punakha',
    popularPlaces: [
      'Punakha Dzong',
      'Chimi Lhakhang',
      'Khamsum Yulley Namgyal Chorten',
      'Suspension Bridge',
      'Sangchhen Dorji Lhuendrup Lhakhang',
      'Talo Monastery',
      'Limbukha Village',
      'Ritsha Village',
      'Mochhu River',
      'Phochhu River'
    ]
  },
  PHUENTSHOLING: {
    name: 'Phuentsholing',
    popularPlaces: [
      'Zangto Pelri Lhakhang',
      'Karbandi Monastery',
      'Border Gate',
      'Gedu Viewpoint',
      'Amochhu River',
      'Phuentsholing Market',
      'Bhutan Gate',
      'Kharbandi Goemba',
      'Torsa River',
      'Phuentsholing Town'
    ]
  },
  BUMTHANG: {
    name: 'Bumthang',
    popularPlaces: [
      'Jakar Dzong',
      'Jambay Lhakhang',
      'Kurjey Lhakhang',
      'Tamshing Lhakhang',
      'Mebar Tsho (Burning Lake)',
      'Chakhar Lhakhang',
      'Tang Valley',
      'Ura Valley',
      'Bumthang Brewery',
      'Bumthang Cheese Factory'
    ]
  },
  TRONGSA: {
    name: 'Trongsa',
    popularPlaces: [
      'Trongsa Dzong',
      'Ta Dzong Museum',
      'Chendebji Chorten',
      'Kuenga Rabten Palace',
      'Trongsa Viewpoint',
      'Mangde Chhu River',
      'Trongsa Market',
      'Yutong La Pass',
      'Thruepang Palace',
      'Trongsa Town'
    ]
  },
  WANGDUE: {
    name: 'Wangdue',
    popularPlaces: [
      'Wangdue Phodrang Dzong',
      'Gangtey Monastery',
      'Phobjikha Valley',
      'Black Necked Crane Center',
      'Gangtey Nature Trail',
      'Rinchengang Village',
      'Adha Village',
      'Dangchu Valley',
      'Sephu Village',
      'Wangdue Town'
    ]
  },
  HAA: {
    name: 'Haa',
    popularPlaces: [
      'Haa Dzong',
      'Lhakhang Karpo',
      'Lhakhang Nagpo',
      'Haa Valley',
      'Chele La Pass',
      'Katsho Village',
      'Uesu Village',
      'Haa Town',
      'Dochula Pass',
      'Haa River'
    ]
  }
};
