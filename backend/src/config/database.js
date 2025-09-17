const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  // Construct the connection string from environment variables
  const mongoURI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`;

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connection SUCCESS');
  } catch (error) {
    console.error('MongoDB connection FAIL:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;