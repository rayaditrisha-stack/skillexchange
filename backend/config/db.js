import mongoose from 'mongoose';

let mongod = null;

const connectDB = async (retryCount = 0) => {
  const maxRetries = 3;
  const connStr = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillmesh';

  try {
    console.log(`[DB] Connecting to MongoDB at ${connStr}...`);
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[DB Connection Warning]: ${err.message}`);

    if (retryCount < maxRetries) {
      console.log(`[DB] Retrying connection attempt ${retryCount + 1}/${maxRetries}...`);
      await new Promise(res => setTimeout(res, 1500));
      return connectDB(retryCount + 1);
    }

    console.warn('[DB] Local MongoDB daemon unavailable. Initializing MongoDB Memory Server fallback...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      console.log(`[DB] MongoDB Memory Server active at ${memUri}`);
      const conn = await mongoose.connect(memUri);
      console.log('[DB] Fallback In-Memory Database Connected successfully.');
      return conn;
    } catch (memErr) {
      console.error(`[DB Fatal Error]: Failed to start fallback MongoDB instance: ${memErr.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
