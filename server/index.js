// Importing required dependencies
import express from "express"; // Express framework for handling HTTP requests
import dotenv from "dotenv"; // dotenv to load environment variables from a .env file
import cors from "cors"; // CORS middleware to enable cross-origin requests
import cookieParser from "cookie-parser"; // Cookie parsing middleware
import mongoose from "mongoose"; // Mongoose to interact with MongoDB
import authRoutes from "./routes/AuthRoutes.js"; // Import authentication-related routes
import contactRoutes from "./routes/ContactRoutes.js"; // Import contact-related routes
import setupSocket from "./socket.js"; // Import the socket setup function
import messageRoutes from "./routes/MessageRoutes.js"; // Import message-related routes
import path from "path"; // Path module to handle file and directory paths
import channelRoutes from "./routes/ChannelRoutes.js"; // Import channel-related routes

// Resolving the directory path for static file serving
const __dirname = path.resolve();

// Load environment variables from .env file
dotenv.config();

// Create an Express application instance
const app = express();

// Define the port the server will run on, defaults to 3001 if not set
const port = process.env.PORT || 3001;

// Database connection URL from environment variables
const databaseURL = process.env.DATABASE_URL;

// Enable CORS with specified configurations
app.use(
  cors({
    origin: [process.env.ORIGIN], // Allow only specified origin(s)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow credentials like cookies to be sent
  })
);

// Serve static files for uploads (like images and files) with specific paths
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("upload/files"));

// Use cookie-parser middleware to parse cookies in requests
app.use(cookieParser());

// Use express.json() middleware to parse incoming JSON requests
app.use(express.json());

// Register API routes for different services (authentication, contacts, messages, channels)
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);

// Start the server and log the success message
const server = app.listen(port, () => {
  console.log(`Server is running at http//localhost:${port}`); // Log the server address
});

// Setup WebSocket functionality
setupSocket(server);

// Connect to MongoDB using Mongoose and log success or failure
mongoose
  .connect(databaseURL) // Attempt to connect to MongoDB with the connection URL
  .then(
    (res) => console.log(`MongoDB Connected! DB Host: ${res.connection.host}`) // Log success if connected
  )
  .catch((err) => console.log(err.message)); // Catch and log any connection error
