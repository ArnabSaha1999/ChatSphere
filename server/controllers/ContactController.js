// Importing necessary models and modules
import User from "../models/UserModel.js"; // User model for interacting with the User collection
import Message from "../models/MessageModel.js"; // Message model for interacting with the Message collection
import mongoose from "mongoose"; // Mongoose for working with MongoDB

// Controller for searching contacts based on a search item (name or email)
export const searchContacts = async (req, res, next) => {
  try {
    // Extracting the search item from the request body
    const { searchItem } = req.body;

    // If the search item is not provided, return a 400 error
    if (searchItem === undefined || searchItem === null) {
      return res.status(400).send("Search item is required!");
    }

    // Sanitizing the search item to escape special characters
    const sanitizedSearchItem = searchItem.replace(
      /[.&+?^${}()|[\][\\]/g,
      "\\$&"
    );

    // Creating a case-insensitive regex pattern for the sanitized search item
    const regex = new RegExp(sanitizedSearchItem, "i");

    // Searching the User collection for users matching the regex (first name, last name, or email)
    const contacts = await User.find({
      $and: [{ _id: { $ne: req.userId } }], // Exclude the current user from the search
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    });

    // Returning the list of found contacts
    return res.status(200).json({ contacts });
  } catch (error) {
    // Logging the error and returning a generic server error
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};

// Controller for getting a list of contacts for direct messaging (DM)
export const getContactsForDMList = async (req, res, next) => {
  try {
    // Extracting userId from the request (logged-in user)
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId); // Converting userId to an ObjectId type

    // Using aggregation to retrieve contact details from the Message collection
    const contacts = await Message.aggregate([
      // Stage 1: Match messages where the user is either the sender or recipient
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },

      // Stage 2: Sort messages by timestamp in descending order (most recent first)
      {
        $sort: { timestamp: -1 },
      },

      // Stage 3: Group messages by the other user (sender or recipient)
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] }, // If the sender is the current user
              then: "$recipient", // The recipient is the contact
              else: "$sender", // Otherwise, the sender is the contact
            },
          },
          // Get the timestamp of the last message for each contact
          lastMessageTime: { $first: "$timestamp" },
        },
      },

      // Stage 4: Perform a lookup to retrieve user details for each contact
      {
        $lookup: {
          from: "users", // Join with the 'users' collection
          localField: "_id", // The field in this pipeline is the _id of the contact
          foreignField: "_id", // Match with the _id field in the users collection
          as: "contactInfo", // Store the result in the 'contactInfo' array
        },
      },

      // Stage 5: Unwind the 'contactInfo' array to simplify the structure
      {
        $unwind: "$contactInfo",
      },

      // Stage 6: Project the required fields in the final output (contact info)
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },

      // Stage 7: Sort the contacts by the last message timestamp (most recent first)
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    // Returning the list of contacts sorted by the last message timestamp
    return res.status(200).json({ contacts });
  } catch (error) {
    // Logging the error and returning a generic server error
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};

// Controller for getting all contacts (excluding the logged-in user)
export const getAllContacts = async (req, res, next) => {
  try {
    // Finding all users except the logged-in user
    const users = await User.find(
      { _id: { $ne: req.userId } }, // Excluding the current user from the result
      "firstName lastName email _id" // Selecting specific fields (first name, last name, email, and user ID)
    );

    // Mapping the user data to create a list of contacts in the desired format
    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email, // Display name
      value: user._id, // User ID
    }));

    // Returning the list of contacts
    return res.status(200).json({ contacts });
  } catch (error) {
    // Logging the error and returning a generic server error
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};
