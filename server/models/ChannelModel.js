// Importing mongoose module for MongoDB object modeling
import mongoose from "mongoose";

// Defining the schema for the 'Channel' model
const channelSchema = new mongoose.Schema({
  // Defining the 'name' field for the channel which is a required string
  name: {
    type: String,
    required: [true, "Channel name is required!"], // Custom error message if not provided
  },

  // Defining the 'members' field which is an array of ObjectId references to the 'User' model
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Reference to the 'User' model
      required: true, // This field is required
    },
  ],

  // Defining the 'admin' field which is an ObjectId reference to the 'User' model and is required
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // Reference to the 'User' model
    required: true, // This field is required
  },

  // Defining the 'messages' field which is an array of ObjectId references to the 'Message' model
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Message", // Reference to the 'Message' model
      required: false, // This field is optional
    },
  ],

  // Defining the 'createdAt' field, which is a date and defaults to the current date
  createdAt: {
    type: Date,
    default: () => new Date(), // Sets the current date when the channel is created
  },

  // Defining the 'updatedAt' field, which is a date and defaults to the current date
  updatedAt: {
    type: Date,
    default: () => new Date(), // Sets the current date when the channel is updated
  },
});

// Middleware to update the 'updatedAt' field before saving the channel
channelSchema.pre("save", function (next) {
  this.updatedAt = new Date(); // Sets 'updatedAt' to the current date before saving
  next(); // Proceed to the next middleware or save the document
});

// Middleware to update the 'updatedAt' field before updating the channel
channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() }); // Sets 'updatedAt' to the current date before update
  next(); // Proceed to the next middleware or update the document
});

// Exporting the model 'Channel' which is based on the defined schema
export default mongoose.model("Channel", channelSchema);
