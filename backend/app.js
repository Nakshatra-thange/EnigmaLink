const express = require('express');
const connectDB = require('./src/config/database');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// A simple test route
app.get('/', (req, res) => {
  res.send('EnigmaLink API is running...');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));