const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
const videoRoutes = require('./routes/video');
app.use('/api/videos', videoRoutes);
const channelRoutes = require('./routes/channel');
app.use('/api/channels', channelRoutes);
const commentRoutes = require('./routes/comment');
app.use('/api/comments', commentRoutes);

// MongoDB Connection
const PORT = process.env.PORT || 5000;

// Add console.log to check if environment variables are loaded
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGO_URI ? 'URI exists' : 'URI is missing');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  });

// Add error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Add error handling for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});