import dns from 'dns';
import mongoose from 'mongoose';

// Node 24+ prefers IPv6 when resolving DNS. Some MongoDB Atlas clusters are
// unreachable over IPv6, so force IPv4-first resolution before connecting.
dns.setDefaultResultOrder('ipv4first');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'familyconnect';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

// Non-null asserted once above; keeps the narrowed value for connect().
const MONGODB_URI_VALUE = MONGODB_URI;

declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

function connectMongoose(): Promise<typeof mongoose> {
  if (!global._mongoosePromise) {
    global._mongoosePromise = mongoose.connect(MONGODB_URI_VALUE, {
      dbName: MONGODB_DB_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }
  return global._mongoosePromise;
}

// Start the connection as soon as the module loads so that
// mongoose models (User, Event, Task, ...) can run queries immediately.
connectMongoose();

// Ensures the mongoose connection is ready before a route runs its queries.
export async function getDb(): Promise<void> {
  await connectMongoose();
}

export default connectMongoose();
