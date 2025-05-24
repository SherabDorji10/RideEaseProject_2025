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

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = verifyToken(req);

    // Verify that the user is a driver
    if (!isJwtPayloadWithRole(user) || user.role !== 'driver') {
      return NextResponse.json(
        { message: 'Only drivers can access their rides' },
        { status: 403 }
      );
    }

    // Find all rides accepted by this driver
    const rides = await Booking.find({
      driver: user.userId,
      status: { $in: ['confirmed', 'completed'] }
    })
    .sort({ createdAt: -1 })
    .populate('user', 'name email phone')
    .lean();

    return NextResponse.json({ rides });
  } catch (error: any) {
    console.error('Get accepted rides error:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 