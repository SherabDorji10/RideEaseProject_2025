import mongoose, { Document } from 'mongoose';

export interface IVehicle extends Document {
  name: string;
  type: 'taxi' | 'bus';
  image: string;
  capacity: string;
  basePrice: number;
  pricePerKm: number;
  features: string[];
  estimatedTime: string;
  available: number;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new mongoose.Schema<IVehicle>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['taxi', 'bus'], required: true },
    image: { type: String, required: true },
    capacity: { type: String, required: true },
    basePrice: { type: Number, required: true },
    pricePerKm: { type: Number, required: true },
    features: [{ type: String }],
    estimatedTime: { type: String, required: true },
    available: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', vehicleSchema); 