// Handle authentication and validation.

const app = express();
const orderRoutes = require ('/routes/orderRoutes'); // Importing order routes

//middleware to parse json
app.use(express.json());

//routes
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(PORT,() => console.log('Server running on port ${PORT}'));
