// src/models/User.ts
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'passenger' | 'driver' | 'admin';
  isVerified: boolean;
  driverDetails?: {
    licenseNumber: string;
    vehicleType: 'taxi' | 'bus';
    vehicleNumber: string;
    experience: number;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: { 
      type: String, 
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: { 
      type: String, 
      required: [true, 'Please provide a phone number'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    password: { 
      type: String, 
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Don't include password in queries by default
    },
    role: { 
      type: String, 
      enum: ['passenger', 'driver', 'admin'], 
      default: 'passenger' 
    },
    isVerified: { 
      type: Boolean, 
      default: true 
    },
    driverDetails: {
      licenseNumber: {
        type: String,
        required: function() { return this.role === 'driver'; }
      },
      vehicleType: { 
        type: String, 
        enum: ['taxi', 'bus'],
        required: function() { return this.role === 'driver'; }
      },
      vehicleNumber: {
        type: String,
        required: function() { return this.role === 'driver'; }
      },
      experience: {
        type: Number,
        required: function() { return this.role === 'driver'; },
        min: [0, 'Experience cannot be negative']
      }
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 