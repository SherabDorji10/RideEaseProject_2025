import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Middleware to verify JWT token
const verifyToken = (req: Request): string | JwtPayload => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Type guard function to check if user is JwtPayload with a 'userId' property
function isJwtPayloadWithUserId(user: any): user is JwtPayload & { userId: string } {
  return typeof user === 'object' && user !== null && 'userId' in user && typeof user.userId === 'string';
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = verifyToken(req);

    // Check if user has userId property
    if (!isJwtPayloadWithUserId(user)) {
      return NextResponse.json(
        { message: 'Invalid user token' },
        { status: 401 }
      );
    }

    // Find user by ID
    const userData = await User.findById(user.userId)
      .select('-password') // Exclude password from response
      .lean();

    if (!userData) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: userData });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const user = verifyToken(req);
    
    // Check if user has userId property
    if (!isJwtPayloadWithUserId(user)) {
      return NextResponse.json(
        { message: 'Invalid user token' },
        { status: 401 }
      );
    }
    
    const data = await req.json();

    // Find user by ID
    const userData = await User.findById(user.userId);
    if (!userData) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Update basic information
    userData.name = data.name;
    userData.phone = data.phone;

    // Update driver details if user is a driver
    if (userData.role === 'driver' && data.driverDetails) {
      userData.driverDetails = {
        licenseNumber: data.driverDetails.licenseNumber,
        vehicleType: data.driverDetails.vehicleType,
        vehicleNumber: data.driverDetails.vehicleNumber,
        experience: data.driverDetails.experience
      };
    }

    await userData.save();

    // Return updated user data without password
    const updatedUser = await User.findById(user.userId)
      .select('-password')
      .lean();

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 