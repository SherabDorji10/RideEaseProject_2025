import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  pickupLocation: {
    type: String,
    required: [true, 'Please provide pickup location'],
  },
  dropoffLocation: {
    type: String,
    required: [true, 'Please provide dropoff location'],
  },
  pickupTime: {
    type: Date,
    required: [true, 'Please provide pickup time'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
  },
  vehicleType: {
    type: String,
    required: [true, 'Please provide vehicle type'],
  },
  vehicleName: {
    type: String,
    required: [true, 'Please provide vehicle name'],
  },
  passengers: {
    type: Number,
    required: [true, 'Please provide number of passengers'],
    min: 1,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking; 