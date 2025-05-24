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

// Type guard function to check if user is JwtPayload with a 'role' property
function isJwtPayloadWithRole(user: any): user is JwtPayload & { role: string, userId: string } {
  return typeof user === 'object' && user !== null && 'role' in user && typeof user.role === 'string';
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = verifyToken(req);

    // Verify that the user is a driver
    if (!isJwtPayloadWithRole(user) || user.role !== 'driver') {
      return NextResponse.json(
        { message: 'Only drivers can accept rides' },
        { status: 403 }
      );
    }

    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Find the booking and check if it's still available
    const booking = await Booking.findOne({
      _id: bookingId,
      status: 'pending',
      driver: { $exists: false }
    });

    if (!booking) {
      return NextResponse.json(
        { message: 'Ride request is no longer available' },
        { status: 404 }
      );
    }

    // Update the booking with the driver's ID and change status to confirmed
    booking.driver = user.userId;
    booking.status = 'confirmed';
    await booking.save();

    return NextResponse.json({
      message: 'Ride request accepted successfully',
      booking
    });
  } catch (error: any) {
    console.error('Accept ride error:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 