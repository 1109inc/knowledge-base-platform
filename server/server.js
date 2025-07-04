// Import necessary modules
const express = require("express"); // Express framework for building the server
const dotenv = require("dotenv"); // For loading environment variables from a .env file
const connectDB = require("./config/db"); // Function to connect to MongoDB
const cors = require("cors"); // Middleware for enabling Cross-Origin Resource Sharing

// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB database
connectDB();

// Initialize the Express application
const app = express();

// --- Middleware ---
// Enable CORS for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// --- Route Imports ---
const authRoutes = require("./routes/authRoutes"); // Routes for authentication
const documentRoutes = require("./routes/documentRoutes"); // Routes for document management

// --- API Routes ---
// Mount authentication routes under /api/auth
app.use("/api/auth", authRoutes);
// Mount document routes under /api/documents
app.use("/api/documents", documentRoutes);

// --- Root Route ---
// Simple GET route for the root URL to confirm the API is running
app.get("/", (req, res) => {
  res.send("Knowledge Base Platform API is running");
});

// --- Server Initialization ---
// Define the port for the server, using environment variable or defaulting to 5000
const PORT = process.env.PORT || 5000;
// Start the server and listen on the defined port
app.listen(PORT, () => {
  // Log a message to the console when the server starts (optional, consider a logger for production)
  // console.log(`Server running on port ${PORT}`)
});
