const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_system';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB at ${mongoURI}`);
    console.error(`Reason: ${error.message}`);
    console.error(`Tip: Ensure MongoDB service is running locally ('mongod --dbpath <data-dir>') or provide a valid MONGODB_URI in .env`);
    // Do not exit immediately so app can provide friendly error or start MongoDB
    throw error;
  }
};

module.exports = connectDB;
