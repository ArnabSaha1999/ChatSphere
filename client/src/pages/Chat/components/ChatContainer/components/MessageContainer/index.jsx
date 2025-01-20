// Import necessary components and libraries
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Avatar components for user display
import { apiClient } from "@/lib/apiClient"; // API client for making HTTP requests
import { getColor } from "@/lib/utils"; // Utility function to get colors (likely for user identification or UI styling)
import { useAppStore } from "@/store"; // Custom hook to access the global application state

// Import constants for API routes and base URL
import {
  GET_ALL_MESSAGES_ROUTE, // Route to fetch all messages for a chat
  GET_CHANNEL_MESSAGES, // Route to fetch messages for a channel
  HOST, // Base URL for API requests
} from "@/utils/constants";

// Import moment.js for date and time formatting
import moment from "moment";

// React hooks for component functionality
import { useEffect, useRef, useState } from "react"; // useEffect for side effects, useRef for DOM references, and useState for state management

// Icons from react-icons for UI elements like download button and close button
import { IoMdArrowRoundDown } from "react-icons/io"; // Download icon
import { IoCloseSharp } from "react-icons/io5"; // Close icon for UI elements
import { MdFolderZip } from "react-icons/md"; // Folder icon for file messages

// MessageContainer component: Handles message rendering, file downloads, and message display
const MessageContainer = () => {
  const scrollRef = useRef(null); // Ref to scroll to the latest message
  const {
    selectedChatType, // Type of the selected chat (contact or channel)
    selectedChatData, // Data for the selected chat (contact/channel)
    userInfo, // Information of the logged-in user
    selectedChatMessages, // Messages for the selected chat
    setSelectedChatMessages, // Function to update the messages
    setIsDownloading, // Function to set the downloading state
    setFileDownloadProgress, // Function to update the file download progress
  } = useAppStore(); // Accessing the global state through the custom store hook

  const [showImage, setShowImage] = useState(false); // State to show/hide image viewer
  const [imageURL, setImageURL] = useState(null); // State to store image URL for viewing

  // useEffect to fetch messages when the selected chat changes
  useEffect(() => {
    const getMessages = async () => {
      try {
        // Fetch all messages for the selected chat (contact)
        const res = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        // If fetched messages are different from the current state, update them
        if (
          JSON.stringify(res.data.messages) !==
          JSON.stringify(selectedChatMessages)
        ) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error); // Handle error fetching messages
      }
    };

    const getChannelMessages = async () => {
      try {
        // Fetch messages for a channel
        const res = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );

        // If fetched messages are different from the current state, update them
        if (
          JSON.stringify(res.data.messages) !==
          JSON.stringify(selectedChatMessages)
        ) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.log({ error }); // Handle error fetching channel messages
      }
    };

    // Conditionally fetch messages based on chat type (contact or channel)
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages(); // Fetch messages for contact
      } else if (selectedChatType === "channel") {
        getChannelMessages(); // Fetch messages for channel
      }
    }
  }, [selectedChatData._id, selectedChatType, setSelectedChatMessages]); // Re-run on changes to selectedChatData or selectedChatType

  // useEffect to scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" }); // Scroll to latest message
    }
  }, [selectedChatMessages]); // Re-run whenever selectedChatMessages changes

  // Function to render the list of messages
  const renderMessages = () => {
    let lastDate = null; // Variable to track last displayed message date
    return selectedChatMessages.map((message, index) => {
      // Format message timestamp to display the date
      const messageDate = moment
        .utc(message.timestamp)
        .local()
        .format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate; // Determine if a new date should be displayed
      lastDate = messageDate; // Update the last date to current message's date

      // Render each message along with the date if applicable
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment.utc(message.timestamp).local().format("LL")}{" "}
              {/* Show formatted date */}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}{" "}
          {/* Render contact messages */}
          {selectedChatType === "channel" &&
            renderChannelMessages(message)}{" "}
          {/* Render channel messages */}
        </div>
      );
    });
  };

  // Helper function to check if a file is an image
  const checkIfImage = filePath => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath); // Return true if the file is an image
  };

  // Function to handle file download
  const downloadFile = async fileURL => {
    setIsDownloading(true); // Set downloading state to true
    setFileDownloadProgress(0); // Reset the download progress
    const res = await apiClient.get(`${HOST}/${fileURL}`, {
      responseType: "blob", // Request the file as a blob
      onDownloadProgress: ProgressEvent => {
        const { loaded, total } = ProgressEvent; // Track the download progress
        const percentCompleted = Math.round((100 * loaded) / total);
        setFileDownloadProgress(percentCompleted); // Update the download progress
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([res.data])); // Create a blob URL for the downloaded file
    const link = document.createElement("a"); // Create a link to trigger the download
    link.href = urlBlob;
    link.setAttribute("download", fileURL.split("/").pop()); // Set file name for download
    link.click(); // Trigger download
    link.remove(); // Remove the link after downloading
    window.URL.revokeObjectURL(urlBlob); // Clean up the blob URL
    setIsDownloading(false); // Reset downloading state
    setFileDownloadProgress(0); // Reset download progress
  };

  // Function to render direct message (DM) messages
  const renderDMMessages = message => (
    <div
      className={
        // Apply different alignment styles based on sender
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }
    >
      {/* Render message content based on message type */}
      {message.messageType === "text" && (
        <div
          className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content} {/* Display text content */}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {/* If the file is an image, display it in a clickable div */}
          {checkIfImage(message.fileURL) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true); // Set state to show image viewer
                setImageURL(message.fileURL); // Set image URL for viewing
              }}
            >
              <img
                src={`${HOST}/${message.fileURL}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            // Render non-image file with download button
            <div className="flex items-center justify-center gap-4">
              <span className="text-white text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip /> {/* Folder icon for files */}
              </span>
              <span className="text-wrap max-w-[100%] overflow-hidden">
                {message.fileURL.split("/").pop()} {/* Display file name */}
              </span>
              <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300">
                <IoMdArrowRoundDown
                  onClick={() => downloadFile(message.fileURL)} // Trigger file download on click
                />
              </span>
            </div>
          )}
        </div>
      )}
      {/* Display message timestamp */}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")} {/* Format and display time */}
      </div>
    </div>
  );

  // Function to render channel messages
  const renderChannelMessages = message => {
    return (
      // Wrapper for each message, aligns left for others and right for the current user
      <div
        className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}
      >
        {/* Rendering text message */}
        {message.messageType === "text" && (
          <div
            className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}

        {/* Rendering file message */}
        {message.messageType === "file" && (
          <div
            className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {/* Check if the file is an image */}
            {checkIfImage(message.fileURL) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true); // Show image when clicked
                  setImageURL(message.fileURL); // Set the image URL for preview
                }}
              >
                <img
                  src={`${HOST}/${message.fileURL}`} // Image source URL
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              // Non-image files will show a folder icon and download option
              <div className="flex items-center justify-center gap-4">
                <span className="text-white text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip /> {/* Folder icon */}
                </span>
                <span className="text-wrap max-w-[100%] overflow-hidden">
                  {message.fileURL.split("/").pop()} {/* Display file name */}
                </span>
                <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300">
                  <IoMdArrowRoundDown
                    onClick={() => downloadFile(message.fileURL)} // File download on click
                  />
                </span>
              </div>
            )}
          </div>
        )}

        {/* Display sender info for messages not from the current user */}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            {/* Avatar and name of the sender */}
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`} // Profile image source
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift() // First letter of first name
                  : message.sender.email.split("").shift()}{" "}
                {/* First letter of email if no first name */}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">
              {`${message.sender.firstName} ${message.sender.lastName}`}{" "}
              {/* Sender's full name */}
            </span>
            <span className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}{" "}
              {/* Timestamp of message */}
            </span>
          </div>
        ) : (
          // Only timestamp for current user's message
          <div className="text-xs text-white/60">
            {moment(message.timestamp).format("LT")}{" "}
            {/* Timestamp for current user's message */}
          </div>
        )}
      </div>
    );
  };

  return (
    // Container that holds the messages and handles image preview modal
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw]">
      {renderMessages()} {/* Render messages */}
      <div ref={scrollRef}>
        {/* Image preview modal if showImage is true */}
        {showImage && (
          <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
            <div>
              <img
                src={`${HOST}/${imageURL}`} // Preview the selected image
                className="w-[80vw] h-auto bg-cover"
              />
            </div>
            <div className="flex gap-5 fixed top-0 mt-5">
              {/* Button to download the image */}
              <button
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(imageURL)} // Download image on click
              >
                <IoMdArrowRoundDown />
              </button>
              {/* Button to close the image preview */}
              <button
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => {
                  setShowImage(false); // Close image preview
                  setImageURL(null); // Reset image URL
                }}
              >
                <IoCloseSharp />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer; // Export the MessageContainer component
