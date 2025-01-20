// Importing mongoose module for MongoDB object modeling
import mongoose from "mongoose";

// Defining the schema for the 'Message' model
const messageSchema = new mongoose.Schema({
  // Defining the 'sender' field, which is an ObjectId reference to the 'User' model and is required
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the 'User' model
    required: [true, "Message should have a sender"], // Custom error message if not provided
  },

  // Defining the 'recipient' field, which is an ObjectId reference to the 'User' model and is optional
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the 'User' model
    required: false, // This field is optional
  },

  // Defining the 'messageType' field, which must be either 'text' or 'file'
  messageType: {
    type: String,
    enum: ["text", "file"], // Only accepts 'text' or 'file' as valid values
    required: true, // This field is required
  },

  // Defining the 'content' field, which is required only if the messageType is 'text'
  content: {
    type: String,
    required: function () {
      return this.messageType === "text"; // Required only if messageType is 'text'
    },
  },

  // Defining the 'fileURL' field, which is required only if the messageType is 'file'
  fileURL: {
    type: String,
    required: function () {
      return this.messageType === "file"; // Required only if messageType is 'file'
    },
  },

  // Defining the 'timestamp' field, which is a date and defaults to the current date
  timestamp: {
    type: Date,
    default: () => new Date(), // Sets the current date when the message is created
  },
});

// Exporting the model 'Message' which is based on the defined schema
export default mongoose.model("Message", messageSchema);
