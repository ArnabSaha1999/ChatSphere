// Import required modules and models
import { Socket, Server as SocketIOServer } from "socket.io"; // Import Socket.IO for real-time communication
import Message from "./models/MessageModel.js"; // Import the Message model to interact with messages in the database
import Channel from "./models/ChannelModel.js"; // Import the Channel model to interact with channels in the database

// Function to set up Socket.IO and manage WebSocket connections
const setupSocket = (server) => {
  // Initialize the Socket.IO server with the given HTTP server and CORS options
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN, // Allow cross-origin requests from the specified origin
      methods: ["GET", "POST"], // Allow only GET and POST HTTP methods
      credentials: true, // Allow credentials such as cookies to be sent
    },
  });

  // Create a map to associate users with their socket IDs
  const userSocketMap = new Map();

  // Function to handle user disconnections and clean up socket mapping
  const disconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`); // Log when a client disconnects
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId); // Remove the user from the map when they disconnect
        break;
      }
    }
  };

  // Function to send a message between a sender and a recipient
  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender); // Get the socket ID of the sender
    const recipientSocketId = userSocketMap.get(message.recipient); // Get the socket ID of the recipient
    const createdMessage = await Message.create(message); // Save the message to the database
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color") // Populate sender details
      .populate("recipient", "id email firstName lastName image color"); // Populate recipient details

    // Emit the message to the recipient's socket if they are online
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    // Emit the message to the sender's socket if they are online
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  // Function to send a message to a channel and notify its members
  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileURL } = message; // Destructure the message data
    const createdMessage = await Message.create({
      sender, // Store the sender's information
      recipient: null, // Channel messages don't have a specific recipient
      content, // Store the content of the message
      messageType, // Store the type of message (e.g., text, file)
      timestamp: new Date(), // Add the timestamp for when the message was created
      fileURL, // If there is a file, store its URL
    });

    // Retrieve the full message data from the database after it's created
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color") // Populate sender details
      .exec();

    // Add the new message ID to the channel's messages array
    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    // Retrieve the channel details and its members
    const channel = await Channel.findById(channelId).populate("members");

    // Prepare the final message data to include the channel ID
    const finalData = { ...messageData._doc, channelId: channel._id };

    // Loop through each member of the channel and send them the new message
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData); // Emit to the member's socket
        }
      });

      // Ensure the channel admin also receives the message
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData); // Emit to the admin's socket
      }
    }
  };

  // Handle the connection event for incoming WebSocket connections
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId; // Retrieve the user ID from the query parameters
    if (userId) {
      userSocketMap.set(userId, socket.id); // Associate the user ID with the socket ID
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`); // Log the user's connection
    } else {
      console.log("User ID not provided during connection!"); // Log if no user ID is provided
    }

    // Listen for incoming messages and channel messages
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);

    // Handle user disconnection
    socket.on("disconnect", () => disconnect(socket));
  });
};

// Export the setupSocket function for use elsewhere in the app
export default setupSocket;
