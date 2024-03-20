// Handle authentication and validation.

const express = require('express');
const app = express();
const orderRoutes = require ('/routes/orderRoutes');

//middleware 
app.use(express.json());

//routes
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,() => console.log('Server running on port ${PORT}'));
