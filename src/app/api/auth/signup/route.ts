import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import User from '@/app/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    // Connect to database
    try {
      await connectDB();
    } catch (error: any) {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { 
          message: 'Unable to connect to the database. Please try again later.',
          error: 'DATABASE_CONNECTION_ERROR'
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { name, email, phone, password, role, driverDetails } = body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!password) missingFields.push('password');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          message: `Missing required fields: ${missingFields.join(', ')}`,
          error: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordErrors = [];
    if (password.length < 8) {
      passwordErrors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      passwordErrors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { 
          message: 'Password validation failed',
          errors: passwordErrors,
          error: 'PASSWORD_VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          message: 'Please provide a valid email address',
          error: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { 
          message: 'Please provide a valid 10-digit phone number',
          error: 'INVALID_PHONE'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    try {
      const existingUser = await User.findOne({ 
        $or: [{ email }, { phone }] 
      });
      
      if (existingUser) {
        return NextResponse.json(
          { 
            message: 'User with this email or phone number already exists',
            error: 'USER_EXISTS'
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error checking existing user:', error);
      return NextResponse.json(
        { 
          message: 'Error checking user existence',
          error: 'DATABASE_ERROR'
        },
        { status: 500 }
      );
    }

    // Validate driver details if role is driver
    if (role === 'driver') {
      if (!driverDetails) {
        return NextResponse.json(
          { 
            message: 'Driver details are required for driver registration',
            error: 'MISSING_DRIVER_DETAILS'
          },
          { status: 400 }
        );
      }

      const { licenseNumber, vehicleType, vehicleNumber, experience } = driverDetails;
      const missingDriverFields = [];
      
      if (!licenseNumber) missingDriverFields.push('license number');
      if (!vehicleType) missingDriverFields.push('vehicle type');
      if (!vehicleNumber) missingDriverFields.push('vehicle number');
      if (experience === undefined) missingDriverFields.push('experience');

      if (missingDriverFields.length > 0) {
        return NextResponse.json(
          { 
            message: `Missing driver details: ${missingDriverFields.join(', ')}`,
            error: 'INCOMPLETE_DRIVER_DETAILS'
          },
          { status: 400 }
        );
      }
    }

    // Create new user
    try {
      const user = await User.create({
        name,
        email,
        phone,
        password,
        role,
        driverDetails: role === 'driver' ? driverDetails : undefined
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          role: user.role,
          email: user.email 
        },
        process.env.NEXTAUTH_SECRET!,
        { expiresIn: '7d' }
      );

      // Return user data (excluding password) and token
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        driverDetails: user.driverDetails
      };

      return NextResponse.json({
        message: 'User registered successfully',
        user: userData,
        token
      }, { status: 201 });

    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return NextResponse.json(
          { 
            message: 'Validation failed',
            errors: messages,
            error: 'VALIDATION_ERROR'
          },
          { status: 400 }
        );
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        return NextResponse.json(
          { 
            message: 'User with this email or phone number already exists',
            error: 'DUPLICATE_USER'
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          message: 'Error creating user',
          error: 'USER_CREATION_ERROR'
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { 
        message: 'An unexpected error occurred',
        error: 'UNEXPECTED_ERROR'
      },
      { status: 500 }
    );
  }
} 