// Importing necessary modules
import Message from "../models/MessageModel.js"; // Importing the Message model for interacting with the Message collection
import { mkdirSync, renameSync } from "fs"; // Importing fs methods for file system operations (mkdirSync and renameSync)

// Controller for getting messages between two users (sender and recipient)
export const getMessages = async (req, res, next) => {
  try {
    // Extracting the current user ID and the recipient user ID from the request
    const currentUserId = req.userId;
    const otherUserId = req.body.id;

    // If either user ID is missing, return a 400 error
    if (!currentUserId || !otherUserId) {
      return res.status(400).send("Both sender and recipient are required");
    }

    // Querying the Message collection to find messages between the two users
    const messages = await Message.find({
      $or: [
        {
          sender: currentUserId, // If the current user is the sender
          recipient: otherUserId, // And the other user is the recipient
        },
        {
          sender: otherUserId, // Or if the other user is the sender
          recipient: currentUserId, // And the current user is the recipient
        },
      ],
    }).sort({ timestamp: 1 }); // Sorting the messages by timestamp in ascending order (oldest first)

    // Returning the list of messages in the response
    return res.status(200).json({ messages });
  } catch (error) {
    // Logging the error and returning a generic server error message
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};

// Controller for uploading a file
export const uploadFile = async (req, res, next) => {
  try {
    // If no file is uploaded, return a 400 error
    if (!req.file) {
      return res.status(400).send("File is required!");
    }

    // Getting the current date and time to create a unique directory for the file
    const date = Date.now();
    const fileDir = `uploads/files/${date}`; // Creating a directory path using the current timestamp
    let fileName = `${fileDir}/${req.file.originalname}`; // Setting the file name with its original name

    // Creating the directory if it doesn't exist (recursive option ensures all nested directories are created)
    mkdirSync(fileDir, { recursive: true });

    // Renaming the uploaded file to the desired file path
    renameSync(req.file.path, fileName);

    // Returning the file path in the response
    return res.status(200).json({ filePath: fileName });
  } catch (error) {
    // Logging the error and returning a generic server error message
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};
