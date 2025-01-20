// Importing necessary modules
import { Router } from "express"; // Express router for route handling
import { verifyToken } from "../middlewares/AuthMiddleware.js"; // Middleware to verify JWT token
import { getMessages, uploadFile } from "../controllers/MessageControllers.js"; // Controller functions to handle messages and file uploads
import multer from "multer"; // Multer for handling file uploads

// Configuring multer for file upload with destination set to "uploads/files"
const upload = multer({ dest: "uploads/files" });

// Creating a new router instance for message-related routes
const messageRoutes = Router();

// Defining routes for message operations
messageRoutes.post("/get-messages", verifyToken, getMessages); // Route to fetch messages between users
messageRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"), // Handling a single file upload under the field name "file"
  uploadFile // Controller method to handle file upload
);

// Exporting the message routes
export default messageRoutes;
