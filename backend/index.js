// index.js

// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const authRoutes = require('./user-auth/routes/authRoutes');
const orderRoutes = require('./order-management/routes/orderRoutes'); // Add this line

// Import Supabase client (before authRoutes)
const supabase = require('./user-auth/services/supabaseClient');

// Initialize the express application
const app = express();

// Use JSON parsing middleware to parse request bodies
app.use(express.json());

// Register the authentication routes with the app
// This will prefix all routes defined in `authRoutes` with `/auth`
app.use('/auth', authRoutes);

// Register the order routes with the app
app.use(orderRoutes); // Add this line

// Add a simple route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the DTU Cricket Web App Backend!');
});

// Define a 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server to listen on a given port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
