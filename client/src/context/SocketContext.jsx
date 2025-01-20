import { useAppStore } from "@/store"; // Importing the custom store hook to access global state
import { HOST } from "@/utils/constants"; // Importing the host URL from constants
import { createContext, useContext, useEffect, useRef } from "react"; // Importing React hooks and Context API
import { io } from "socket.io-client"; // Importing socket.io client library

// Creating a context to provide the socket instance to the rest of the app
const SocketContext = createContext(null);

// Custom hook to access the socket context
export const useSocket = () => {
  return useContext(SocketContext); // Returning the socket instance from context
};

// SocketProvider component to manage the socket connection and provide it to the children
export const SocketProvider = ({ children }) => {
  const socket = useRef(); // Ref to store the socket connection
  const { userInfo } = useAppStore(); // Accessing user info from the global store

  // Effect hook to establish socket connection when userInfo is available
  useEffect(() => {
    if (userInfo) {
      // Initializing the socket connection with the host and user id in query
      socket.current = io(HOST, {
        withCredentials: true, // Enabling credentials for cross-origin requests
        query: { userId: userInfo.id }, // Sending user id to the server
      });

      // Event listener to log a message when the socket connects successfully
      socket.current.on("connect", () => {
        console.log("Connected to socket server!");
      });

      // Handler function to process the received message for direct messages (DM)
      const handleReceiveMessage = message => {
        const {
          selectedChatData, // Current selected chat data from the global store
          selectedChatType, // Type of the selected chat (contact or channel)
          addMessage, // Function to add a message to the selected chat
          addContactsInDMContacts, // Function to add contacts in DM list
        } = useAppStore.getState();

        // Check if the message is from the selected chat (either contact or DM)
        if (
          (selectedChatType !== undefined &&
            selectedChatData._id === message.sender._id) ||
          selectedChatData._id === message.recipient._id
        ) {
          addMessage(message); // Add message to the selected chat
        }

        addContactsInDMContacts(message); // Add message to the DM contacts list
      };

      // Handler function to process the received message for channels
      const handleReceiveChannelMessage = message => {
        const {
          selectedChatData, // Current selected chat data from the global store
          selectedChatType, // Type of the selected chat (contact or channel)
          addMessage, // Function to add a message to the selected chat
          addChannelInChannelList, // Function to add the channel to the list
        } = useAppStore.getState();

        // Check if the message is from the selected channel
        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message); // Add message to the selected channel
        }

        addChannelInChannelList(message); // Add message to the channel list
      };

      // Listening to incoming messages and handling them appropriately
      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);

      // Cleanup function to disconnect the socket when the component unmounts or userInfo changes
      return () => {
        socket.current.disconnect(); // Disconnecting the socket
      };
    }
  }, [userInfo]); // Effect will run whenever userInfo changes

  // Providing the socket instance to the children components
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
