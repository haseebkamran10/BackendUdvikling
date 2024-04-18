// index.js

// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const authRoutes = require('./user-auth/routes/authRoutes');
const orderRoutes = require('./order-management/routes/orderRoutes');
const productRoutes = require('./product-catalog/routes/productRoutes'); // Import product routes

// Import Supabase client (if needed here)
const supabase = require('./user-auth/services/supabaseClient');

// Initialize the express application
const app = express();
app.use(cors());

// Use JSON parsing middleware to parse request bodies
app.use(express.json());

console.log('Registering /auth routes');
app.use('/auth', authRoutes);

console.log('Registering /orders routes');
app.use('/orders', orderRoutes);

console.log('Registering /products routes');
app.use('/', productRoutes);


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
