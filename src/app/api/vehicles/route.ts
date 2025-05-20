import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Vehicle from '@/app/models/Vehicle';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    const query = type ? { type } : {};
    const vehicles = await Vehicle.find(query);
    
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
} 