// Importing necessary modules
import Channel from "../models/ChannelModel.js"; // Channel model for interacting with the Channel collection
import User from "../models/UserModel.js"; // User model for interacting with the User collection
import mongoose from "mongoose"; // Mongoose for working with MongoDB

// Controller for creating a new channel
export const createChannel = async (req, res, next) => {
  try {
    // Destructuring 'name' and 'members' from the request body
    const { name, members } = req.body;
    // Getting the userId of the logged-in user (admin) from the request
    const userId = req.userId;

    // Finding the user who will be the admin of the channel
    const admin = await User.findById(userId);

    // If the admin user is not found, send an error message
    if (!admin) {
      return res.status(400).send("Admin user not found!");
    }

    // Finding all users who are valid members of the channel by matching userIds
    const validMembers = await User.find({
      _id: { $in: [...new Set(members)] }, // Ensure unique member IDs
    });

    // If the number of valid members doesn't match the number of provided members, return an error
    if (validMembers.length !== members.length) {
      return res.status(400).send("Some members are not valid Users!");
    }

    // Creating a new channel document with name, members, and admin userId
    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    // Saving the newly created channel to the database
    await newChannel.save();

    // Responding with the newly created channel data
    return res.status(201).json({ channel: newChannel });
  } catch (error) {
    // Handling any errors and logging them
    console.log({ error });
    return res.status(500).send("Internal Server Error!"); // Sending a generic error message
  }
};

// Controller to fetch all channels for a specific user
export const getUserChannels = async (req, res, next) => {
  try {
    // Converting the userId to ObjectId type
    const userId = new mongoose.Types.ObjectId(req.userId);

    // Finding channels where the user is either the admin or a member
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 }); // Sorting channels by the most recently updated

    // Returning the list of channels found for the user
    return res.status(201).json({ channels });
  } catch (error) {
    // Handling any errors
    console.log(error);
  }
};

// Controller to fetch messages of a specific channel
export const getChannelMessages = async (req, res, next) => {
  try {
    // Extracting channelId from the request parameters
    const { channelId } = req.params;

    // Finding the channel by its ID and populating the messages field with sender information
    const channel = await Channel.findById(channelId).populate({
      path: "messages", // Populate the messages field in the channel
      populate: {
        path: "sender", // Populate the sender of each message
        select: "firstName lastName email _id image color", // Select only specific sender fields to include in the response
      },
    });

    // If the channel is not found, return an error
    if (!channel) {
      return res.status(404).send("Channel not found!");
    }

    // Retrieving the messages from the populated channel
    const messages = channel.messages;

    // Responding with the list of messages in the channel
    return res.status(201).json({ messages });
  } catch (error) {
    // Handling any errors
    console.log(error);
  }
};
