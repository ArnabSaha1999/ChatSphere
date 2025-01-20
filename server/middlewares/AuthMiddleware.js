// Importing the jwt module for verifying JSON Web Tokens
import jwt from "jsonwebtoken";

// Middleware function to verify JWT tokens
export const verifyToken = (req, res, next) => {
  // Extracting the token from cookies (specifically from the 'jwt' cookie)
  const token = req.cookies.jwt;

  // If no token is found, send a 401 Unauthorized response
  if (!token) {
    return res.status(401).send("You are not authenticated");
  }

  // Verifying the token using the JWT secret key stored in the environment variable
  jwt.verify(token, process.env.JWT_KEY, async (error, payload) => {
    // If the token verification fails, send a 403 Forbidden response
    if (error) {
      return res.status(403).send("Token is not valid!");
    }

    // If the token is valid, store the user ID from the payload into the request object
    req.userId = payload.userid;

    // Proceed to the next middleware or route handler
    next();
  });
};
