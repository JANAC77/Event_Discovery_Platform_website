const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_discovery';

  try {
    // Set connection options with timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected successfully to ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[Database] Local MongoDB connection failed: ${err.message}. Initializing MongoMemoryServer fallback...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] In-Memory MongoDB Connected at ${inMemoryUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to connect to In-Memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
