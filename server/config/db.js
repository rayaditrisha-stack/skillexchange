const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillmesh';
    console.log(`[DB] Attempting MongoDB connection...`);

    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[DB] MongoDB connection warning (${err.message}). Launching Memory Server fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({
        binary: {
          version: '7.0.3'
        }
      });
      const uri = mongod.getUri();
      console.log(`[DB] MongoDB Memory Server started at: ${uri}`);
      const conn = await mongoose.connect(uri);
      console.log(`[DB] Fallback MongoDB Connected successfully.`);
      return conn;
    } catch (memErr) {
      console.error(`[DB] Memory Server initialization failed: ${memErr.message}`);
      throw memErr;
    }
  }
};

module.exports = connectDB;
