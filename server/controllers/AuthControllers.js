// Importing necessary modules
import { compare } from "bcrypt"; // bcrypt compare function to compare passwords
import User from "../models/UserModel.js"; // User model to interact with the User collection
import jwt from "jsonwebtoken"; // JWT library for creating and verifying tokens
import { renameSync, unlinkSync } from "fs"; // File system operations to rename and delete files

// Defining maximum token age (3 days in milliseconds)
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Function to create JWT token with email and userId, expires in maxAge
const createToken = (email, userid) => {
  return jwt.sign({ email, userid }, process.env.JWT_KEY, {
    expiresIn: maxAge, // Set token expiry time
  });
};

// Controller for user signup
export const signup = async (req, res, next) => {
  try {
    // Destructuring email and password from the request body
    const { email, password } = req.body;

    // Checking if email and password are provided
    if (!email || !password) {
      return res.status(400).send("Email and Password are required");
    }

    // Creating new user in the database
    const user = await User.create({ email, password });

    // Setting JWT token as a cookie
    res.cookie("jwt", createToken(email, user.id), {
      maxAge, // Token expiration time
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: "None", // Allows the cookie to be sent in cross-origin requests
    });

    // Responding with the user data
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error"); // Internal server error if something goes wrong
  }
};

// Controller for user login
export const login = async (req, res, next) => {
  try {
    // Destructuring email and password from the request body
    const { email, password } = req.body;

    // Checking if email and password are provided
    if (!email || !password) {
      return res.status(400).send("Email and Password are required");
    }

    // Finding the user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User with the given email not found!"); // If user is not found
    }

    // Comparing provided password with stored hash
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).send("Password is incorrect!"); // If password doesn't match
    }

    // Setting JWT token as a cookie
    res.cookie("jwt", createToken(email, user.id), {
      maxAge, // Token expiration time
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: "None", // Allows the cookie to be sent in cross-origin requests
    });

    // Responding with the user data on successful login
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error"); // Internal server error if something goes wrong
  }
};

// Controller to get user info based on JWT token
export const getUserInfo = async (req, res, next) => {
  try {
    // Finding the user by ID from the JWT token
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User with the given email not found!"); // If user is not found
    }

    // Responding with user data
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error"); // Internal server error if something goes wrong
  }
};

// Controller for updating user profile (firstName, lastName, color)
export const updateProfile = async (req, res, next) => {
  try {
    // Destructuring userId from the request and profile fields from the body
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    // Checking if required fields are provided
    if (!firstName || !lastName) {
      return res
        .status(400)
        .send("Firstname, LastName and Color are required!"); // If fields are missing
    }

    // Updating user data in the database
    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      {
        new: true, // Return the updated user data
        runValidators: true, // Ensure validators are run on the updated fields
      }
    );

    // Responding with updated user data
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error"); // Internal server error if something goes wrong
  }
};

// Controller for adding a profile image
export const addProfileImage = async (req, res, next) => {
  try {
    // Checking if the file is provided in the request
    if (!req.file) {
      return res.status(400).send("File is required!"); // If file is missing
    }

    // Generating a unique filename using current timestamp
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;

    // Renaming the uploaded file
    renameSync(req.file.path, fileName);

    // Updating user profile with the new image
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true } // Ensure the updated user is returned
    );

    // Responding with the new image path
    return res.status(200).json({ image: updatedUser.image });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error"); // Internal server error if something goes wrong
  }
};

// Controller for removing profile image
export const removeProfileImage = async (req, res, next) => {
  try {
    // Finding the user by userId
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found!"); // If user is not found
    }

    // If user has an image, delete the file from the filesystem
    if (user.image) {
      unlinkSync(user.image);
    }

    // Set the user's image field to null
    user.image = null;
    await user.save(); // Save the user with the updated image field

    // Responding with success message
    return res.status(200).send("Profile image removed successfully!");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error"); // Internal server error if something goes wrong
  }
};

// Controller for logging out the user by clearing JWT cookie
export const logout = async (req, res, next) => {
  try {
    // Clearing the JWT cookie by setting its expiry to the past
    res.cookie("jwt", {}, { maxAge: 1, secure: true, sameSite: "None" });

    // Responding with success message
    return res.status(200).send("Log out successful!");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error!"); // Internal server error if something goes wrong
  }
};
