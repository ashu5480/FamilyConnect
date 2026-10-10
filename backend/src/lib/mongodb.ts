import dns from 'dns';
import mongoose from 'mongoose';

// Node 24+ prefers IPv6 when resolving DNS. Some MongoDB Atlas clusters are
// unreachable over IPv6, so force IPv4-first resolution before connecting.
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore — DNS tuning is best-effort (e.g. in edge runtimes).
}

const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'familyconnect';

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  return uri;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

// Lazily connect on first use (never at import time) so that importing this
// module — e.g. during `next build` — cannot crash the build when env vars
// are absent, and so a failed attempt is retried on the next request.
function connectMongoose(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }
  if (!global._mongoosePromise) {
    const promise = mongoose.connect(getMongoUri(), {
      dbName: MONGODB_DB_NAME,
      maxPoolSize: 10,
      // Serverless cold starts + Atlas TLS handshake can exceed 5s.
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    global._mongoosePromise = promise;
    // Allow a later request to retry after a failure instead of caching
    // a permanently rejected promise for the lifetime of the instance.
    promise.catch(() => {
      if (global._mongoosePromise === promise) {
        global._mongoosePromise = undefined;
      }
    });
  }
  return global._mongoosePromise;
}

// Ensures the mongoose connection is ready before a route runs its queries.
export async function getDb(): Promise<void> {
  await connectMongoose();
}

export default { getDb };
