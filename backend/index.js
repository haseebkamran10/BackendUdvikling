
require('dotenv').config();
const express = require('express');
const authRoutes = require('./user-auth/routes/authRoutes');
const orderRoutes = require('./order-management/routes/orderRoutes'); // Add this line
const productRoutes = require('./product-catalog/routes/productRoutes');

const supabase = require('./user-auth/services/supabaseClient');


const app = express();

app.use(express.json());


app.use('/auth', authRoutes);

app.use('/', productRoutes);

app.use(orderRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the DTU Cricket Web App Backend!');
});


app.use((req, res) => {
  res.status(404).send('Page not found');
});

if (process.env.NODE_ENV !== 'test') {
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}
module.exports = app; 