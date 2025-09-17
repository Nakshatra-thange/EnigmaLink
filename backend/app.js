// --- Dependency Imports ---
const dotenv = require('dotenv');
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Immediately validate the environment variables
const validateEnv = require('./src/utils/validateEnv');
validateEnv();// Load environment variables
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/utils/database');

// --- Route and Middleware Imports ---
const mainApiRouter = require('./src/routes/index');

app.get('/', (req, res) => res.send('EnigmaLink API is alive!'));
const errorHandler = require('./src/middleware/errorHandler');

// --- Initializations ---
connectDB(); // Connect to MongoDB
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:4200", // Allow requests from our Angular app
    methods: ["GET", "POST"]
  }
});


// --- Server Configuration ---
// Set security-related HTTP headers
app.use(helmet());
// Trust the first proxy in front of the app, e.g., for Heroku or Nginx
app.set('trust proxy', 1);


// --- Middleware Stack ---
// 1. CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:4200", // Be more specific in production
  credentials: true
}));

// 2. Body Parsers & Cookie Parser
app.use(express.json({ limit: '20kb' })); // Limit request body size
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Custom Logging Middleware (Example)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// --- Route Handlers ---
app.get('/', (req, res) => res.send('EnigmaLink API is alive!'));
app.use('/api', mainApiRouter);


// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Placeholder for chat logic (e.g., joining rooms, sending messages)
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// --- Error Handling Middleware ---
// 404 Not Found Handler (must be after routes)
app.all('*', (req, res, next) => {
  res.status(404);
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  next(error);
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);


// --- Start Server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// --- Graceful Shutdown ---
process.on('SIGINT', async () => {
  try {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('MongoDB connection closed successfully.');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

// --- Export for Testing ---
module.exports = app;