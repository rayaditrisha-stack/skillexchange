import mongoose from 'mongoose';

let mongod = null;

const connectDB = async (retryCount = 0) => {
  const maxRetries = 2;
  const connStr = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillmesh';

  try {
    console.log(`[DB] Connecting to MongoDB...`);
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[DB Connection Warning]: ${err.message}`);

    if (retryCount < maxRetries && (process.env.MONGODB_URI || process.env.MONGO_URI)) {
      console.log(`[DB] Retrying connection attempt ${retryCount + 1}/${maxRetries}...`);
      await new Promise(res => setTimeout(res, 2000));
      return connectDB(retryCount + 1);
    }

    console.warn('[DB] Local MongoDB daemon unavailable. Initializing In-Memory Database Fallback...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      // Set explicit binary version >= 7.0.3 for Debian 12 / Render OS compatibility
      mongod = await MongoMemoryServer.create({
        binary: {
          version: '7.0.3'
        }
      });
      const memUri = mongod.getUri();
      console.log(`[DB] MongoDB Memory Server active at ${memUri}`);
      const conn = await mongoose.connect(memUri);
      console.log('[DB] Fallback In-Memory Database Connected successfully.');
      return conn;
    } catch (memErr) {
      console.error(`[DB Fatal Error]: Failed to start fallback MongoDB instance: ${memErr.message}`);
      // Return null or process exit depending on mode
      throw memErr;
    }
  }
};

export default connectDB;
