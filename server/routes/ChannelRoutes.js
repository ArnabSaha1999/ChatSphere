// Importing necessary modules
import { Router } from "express"; // Express router for route handling
import { verifyToken } from "../middlewares/AuthMiddleware.js"; // Middleware to verify JWT token
import {
  createChannel, // Controller function to create a new channel
  getChannelMessages, // Controller function to get messages from a specific channel
  getUserChannels, // Controller function to get all channels a user is part of
} from "../controllers/ChannelControllers.js"; // Importing controller functions for channel-related operations

// Creating a new router instance for channel-related routes
const channelRoutes = Router();

// Defining routes for channel operations, all protected by token verification
channelRoutes.post("/create-channel", verifyToken, createChannel); // Route to create a new channel
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels); // Route to fetch all channels a user belongs to
channelRoutes.get(
  "/get-channel-messages/:channelId", // Route to get messages for a specific channel, channelId passed in URL
  verifyToken,
  getChannelMessages
);

// Exporting the channel routes
export default channelRoutes;
