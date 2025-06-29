// server/server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();       // Load .env file
connectDB();           // Connect to MongoDB

const app = express();

app.use(cors());
app.use(express.json()); // To parse JSON bodies

const authRoutes = require("./routes/authRoutes"); // Add this line
const documentRoutes = require("./routes/documentRoutes"); // Add this line

// after middleware
app.use("/api/auth", authRoutes); // Add this line
app.use("/api/documents", documentRoutes); // Add this line

app.get("/", (req, res) => {
  res.send("Knowledge Base Platform API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
