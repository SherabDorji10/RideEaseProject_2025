import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
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

// Create a new booking
export async function POST(req: Request) {
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
    
    const bookingData = await req.json();

    const booking = await Booking.create({
      ...bookingData,
      user: user.userId,
    });

    return NextResponse.json(
      { message: 'Booking created successfully', booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Get all bookings for the authenticated user
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

    const bookings = await Booking.find({ user: user.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 