// Importing necessary modules
import { Router } from "express"; // Express router for route handling
import { verifyToken } from "../middlewares/AuthMiddleware.js"; // Middleware to verify JWT token
import {
  getAllContacts, // Controller function to get all contacts of the user
  getContactsForDMList, // Controller function to get contacts for the Direct Message (DM) list
  searchContacts, // Controller function to search for contacts
} from "../controllers/ContactController.js"; // Importing controller functions for contact-related operations

// Creating a new router instance for contact-related routes
const contactRoutes = Router();

// Defining routes for contact operations, all protected by token verification
contactRoutes.post("/search", verifyToken, searchContacts); // Route to search for contacts
contactRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList); // Route to fetch contacts for DM list
contactRoutes.get("/get-all-contacts", verifyToken, getAllContacts); // Route to fetch all contacts of the user

// Exporting the contact routes
export default contactRoutes;
