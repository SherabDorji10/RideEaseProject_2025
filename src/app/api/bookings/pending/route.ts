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
function isJwtPayloadWithRole(user: any): user is JwtPayload & { role: string } {
  return typeof user === 'object' && user !== null && 'role' in user && typeof user.role === 'string';
}

// Get all pending bookings that haven't been accepted by any driver
export async function GET(req: Request) {
  try {
    await connectDB();

    const user = verifyToken(req);

    // Verify that the user is a driver safely
    if (!isJwtPayloadWithRole(user) || user.role !== 'driver') {
      return NextResponse.json(
        { message: 'Only drivers can access pending bookings' },
        { status: 403 }
      );
    }

    // Find all pending bookings that haven't been assigned to any driver
    const pendingBookings = await Booking.find({
      status: 'pending',
      driver: { $exists: false }
    })
      .select('pickupLocation dropoffLocation pickupTime status price vehicleType vehicleName passengers createdAt')
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .lean();

    // Ensure all required fields are present
    const formattedBookings = pendingBookings.map(booking => ({
      ...booking,
      vehicleType: booking.vehicleType || 'standard',
      vehicleName: booking.vehicleName || 'Not specified',
      price: booking.price || 0,
      passengers: booking.passengers || 1
    }));

    return NextResponse.json(formattedBookings);
  } catch (error: any) {
    console.error('Get pending bookings error:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
