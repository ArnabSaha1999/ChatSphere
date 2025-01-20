import { HOST } from "@/utils/constants"; // Importing the base URL for API requests from constants
import axios from "axios"; // Importing axios library for making HTTP requests

// Creating an axios instance to handle API requests
export const apiClient = axios.create({
  baseURL: HOST, // Setting the base URL for all requests to the value from constants
});
