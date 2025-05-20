// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/app/models/User';
import connectDB from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, phone, password, userType } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      userType,
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
}