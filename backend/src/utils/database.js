const mongoose = require('mongoose');

// Mongoose connection events
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to DB in ${process.env.NODE_ENV} mode.`);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected.');
});

mongoose.connection.on('reconnected', () => {
    console.log('Mongoose has reconnected to the database.');
});

const connectDB = async () => {
  let mongoURI;
  if (process.env.NODE_ENV === 'production') {
    mongoURI = process.env.MONGO_URI;
  } else {
    mongoURI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`;
  }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
  } catch (error) {
    console.error(`Initial DB connection FAIL:`, error);
    // If the initial connection fails, we exit. Mongoose won't try to reconnect.
    process.exit(1);
  }
};

module.exports = connectDB;