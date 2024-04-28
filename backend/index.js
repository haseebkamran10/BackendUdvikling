
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./user-auth/routes/authRoutes');
const orderRoutes = require('./order-management/routes/orderRoutes');
const productRoutes = require('./product-catalog/routes/productRoutes'); 
const stripeRoutes = require('./stripe/routes/stripeRoutes');
const supabase = require('./user-auth/services/supabaseClient');
const webhookRoutes = require('./stripe/routes/webHookRoutes');


const app = express();
app.use(cors());

app.use(express.json());

console.log('Registering /auth routes');
app.use('/auth', authRoutes);

console.log('Registering /orders routes');
app.use('/orders', orderRoutes);

console.log('Registering /products routes');
app.use('/', productRoutes);

console.log('Registering Stripe Payment');
app.use('/', stripeRoutes);

console.log('Registering Stripe Webhook');
app.use('/', webhookRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the DTU Cricket Web App Backend!');
});


app.use((req, res) => {
  res.status(404).send('Page not found');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
