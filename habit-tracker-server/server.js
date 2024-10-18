const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const habitRoutes = require('./routes/habits');
const habitController = require('./controllers/habitController');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);

// Add a route to set a custom test date (only in testing mode)
app.post('/api/set-test-date', habitController.setTestDate);

// Add a route to get the current date
app.get('/api/current-date', habitController.getCurrentDate);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

module.exports = app;