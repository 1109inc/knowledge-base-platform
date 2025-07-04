// Import mongoose library for MongoDB interaction
const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database.
 * Uses the MONGO_URI environment variable for the connection string.
 * Exits the process with an error if the connection fails.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log successful connection (optional, consider a more robust logging solution for production)
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log error if connection fails
    // console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process with a failure code (1) if connection is unsuccessful
    process.exit(1);
  }
};

// Export the connectDB function to be used in other parts of the application
module.exports = connectDB;
