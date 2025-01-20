// Importing necessary modules
import { genSalt, hash } from "bcrypt"; // For password hashing
import mongoose from "mongoose"; // Mongoose for MongoDB interaction

// Defining the schema for the 'User' model
const userSchema = new mongoose.Schema({
  // Defining the 'email' field, which is a required string and should be unique
  email: {
    type: String,
    required: [true, "Email is Required"], // Custom error message if the email is not provided
    unique: true, // Ensures that no two users can have the same email
  },

  // Defining the 'password' field, which is a required string
  password: {
    type: String,
    required: [true, "Password is Required"], // Custom error message if the password is not provided
  },

  // Defining the 'firstName' field, which is optional
  firstName: {
    type: String,
    required: [false], // This field is not required
  },

  // Defining the 'lastName' field, which is optional
  lastName: {
    type: String,
    required: [false], // This field is not required
  },

  // Defining the 'image' field, which is optional
  image: {
    type: String,
    required: false, // This field is not required
  },

  // Defining the 'color' field, which is optional and stores a number
  color: {
    type: Number,
    required: false, // This field is not required
  },

  // Defining the 'profileSetup' field, which is a boolean indicating whether the profile is set up, defaults to false
  profileSetup: {
    type: Boolean,
    default: false, // The default value is false
  },
});

// Pre-save middleware to hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  const salt = await genSalt(); // Generate a salt to secure the password
  this.password = await hash(this.password, salt); // Hash the password with the generated salt
  next(); // Move to the next middleware or save operation
});

// Exporting the 'User' model based on the userSchema
export default mongoose.model("User", userSchema);
