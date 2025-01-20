// Importing necessary modules
import { Router } from "express"; // Express router for route handling
import multer from "multer"; // Multer for handling file uploads
import {
  signup,
  login,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout,
} from "../controllers/AuthControllers.js"; // Importing controller functions for auth-related operations
import { verifyToken } from "../middlewares/AuthMiddleware.js"; // Importing middleware to verify JWT token

// Setting up the destination folder for profile image uploads
const upload = multer({ dest: "uploads/profiles/" });

// Creating a new router instance for authentication routes
const authRoutes = Router();

// Defining the routes for user authentication and profile management
authRoutes.post("/signup", signup); // Route for user signup
authRoutes.post("/login", login); // Route for user login
authRoutes.get("/user-info", verifyToken, getUserInfo); // Route to get user info, protected by token verification
authRoutes.post("/update-profile", verifyToken, updateProfile); // Route to update user profile, protected by token verification
authRoutes.post(
  "/add-profile-image", // Route to add profile image, protected by token verification and using multer for file upload
  verifyToken,
  upload.single("profile-image"), // Expecting a single file with the name 'profile-image'
  addProfileImage
);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage); // Route to remove profile image, protected by token verification
authRoutes.post("/logout", logout); // Route to log out the user

// Exporting the authentication routes
export default authRoutes;
