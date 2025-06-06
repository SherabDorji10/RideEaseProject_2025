import mongoose from 'mongoose';

// Check if MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Define the mongoose connection cache interface
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add mongoose to the NodeJS global type
declare global {
  var mongooseConnection: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

// Initialize the connection cache
if (!global.mongooseConnection) {
  global.mongooseConnection = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using mongoose
 */
async function connectDB(): Promise<typeof mongoose> {
  // If we have a connection, return it
  if (global.mongooseConnection.conn) {
    return global.mongooseConnection.conn;
  }

  // If we don't have a promise to connect yet, create one
  if (!global.mongooseConnection.promise) {
    global.mongooseConnection.promise = mongoose.connect(process.env.MONGODB_URI!, {
      bufferCommands: false,
    });
  }

  try {
    // Wait for the connection
    const mongoose = await global.mongooseConnection.promise;
    global.mongooseConnection.conn = mongoose;
    return mongoose;
  } catch (error) {
    // If there's an error, clear the promise so we can try again
    global.mongooseConnection.promise = null;
    throw error;
  }
}

export default connectDB;