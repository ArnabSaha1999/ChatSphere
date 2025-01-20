import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";
import mongoose from "mongoose";

export const searchContacts = async (req, res, next) => {
  try {
    const { searchItem } = req.body;
    if (searchItem === undefined || searchItem === null) {
      return res.status(400).send("Search item is required!");
    }
    const sanitizedSearchItem = searchItem.replace(
      /[.&+?^${}()|[\][\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchItem, "i");
    const contacts = await User.find({
      $and: [{ _id: { $ne: req.userId } }],
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    });
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};

export const getContactsForDMList = async (req, res, next) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      // Stage 1: Match messages where the user is either the sender or recipient
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },

      // Stage 2: Sort the messages by timestamp in descending order, so the most recent messages come first
      {
        $sort: { timestamp: -1 },
      },

      // Stage 3: Group the messages by the other user (either the sender or recipient depending on the userId)
      {
        $group: {
          // Group by the user who is not the current user
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

      // Stage 4: Perform a lookup to get contact info (user details) for each contact (from the 'users' collection)
      {
        $lookup: {
          from: "users", // Join with the 'users' collection
          localField: "_id", // The field in this pipeline is the _id of the contact
          foreignField: "_id", // Match with the _id field in the users collection
          as: "contactInfo", // The result will be stored in the contactInfo array
        },
      },

      // Stage 5: Unwind the contactInfo array to simplify the structure
      {
        $unwind: "$contactInfo",
      },

      // Stage 6: Project the required fields in the final output
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

      // Stage 7: Sort the contacts by the last message timestamp in descending order
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      "firstName lastName email _id"
    );
    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};
