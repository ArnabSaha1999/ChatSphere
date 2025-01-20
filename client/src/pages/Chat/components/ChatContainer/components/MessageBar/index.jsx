// Importing necessary hooks, icons, components, and utilities
import { useRef, useState, useEffect } from "react"; // React hooks for managing state and refs
import { IoSend } from "react-icons/io5"; // Send icon for sending messages
import { GrEmoji } from "react-icons/gr"; // Emoji icon for opening the emoji picker
import { GrAttachment } from "react-icons/gr"; // Attachment icon for file upload
import EmojiPicker from "emoji-picker-react"; // Emoji picker component
import { useAppStore } from "@/store"; // Accessing global state from the app store
import { useSocket } from "@/context/SocketContext"; // Custom hook for socket functionality
import { Input } from "@/components/ui/input"; // Input component for file input
import { UPLOAD_FILE_ROUTE } from "@/utils/constants"; // Constant for file upload route
import { apiClient } from "@/lib/apiClient"; // API client for making HTTP requests

const MessageBar = () => {
  // Refs for emoji picker and file input
  const emojiRef = useRef();
  const fileInputRef = useRef();

  // Socket connection for emitting messages
  const socket = useSocket();

  // Extracting state from the app store
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();

  // Local state for message content and emoji picker visibility
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  // Handling clicks outside the emoji picker to close it
  const handleClickOutside = event => {
    if (emojiRef.current && !emojiRef.current.contains(event.target)) {
      setEmojiPickerOpen(false);
    }
  };

  // Adding event listener to detect outside clicks for closing the emoji picker
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  // Adding emoji to the message input field
  const handleAddEmoji = emoji => {
    setMessage(msg => msg + emoji.emoji); // Append emoji to the message text
  };

  // Handling the sending of a text message to the selected chat
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      // Emitting message to the contact
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileURL: undefined,
      });
    } else if (selectedChatType === "channel") {
      // Emitting message to the channel
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileURL: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage(""); // Clear the message input field after sending
  };

  // Handling the file input click to trigger file selection
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click event
    }
  };

  // Handling file input change event and uploading the selected file
  const handleAttachementChange = async event => {
    try {
      const file = event.target.files[0]; // Get the selected file
      if (file) {
        const formData = new FormData();
        formData.append("file", file); // Prepare form data with the file
        setIsUploading(true); // Set uploading state to true
        // Upload the file using the API client
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: data =>
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total)), // Update upload progress
        });
        if (res.status === 200 && res.data) {
          setIsUploading(false); // Set uploading state to false
          // Emit file message after successful upload
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileURL: res.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileURL: res.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false); // Set uploading state to false on error
      console.log(error); // Log error to console
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        {/* Message input field */}
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md border-none focus:border-none focus:outline-none items-center"
          placeholder="Enter message"
          value={message}
          onChange={e => setMessage(e.target.value)} // Update message state on input change
        />
        {/* Attachment button */}
        <button
          onClick={() => handleAttachmentClick()}
          className="text-2xl text-neutral-500 hover:text-white focus:text-white duration-300 transition-all"
        >
          <GrAttachment />
        </button>
        {/* Hidden file input for attachments */}
        <Input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachementChange} // Handle file input change
        />
        {/* Emoji picker button */}
        <div className="relative">
          <button
            className="text-2xl text-neutral-500 hover:text-white focus:text-white duration-300 transition-all mt-2"
            onClick={() => setEmojiPickerOpen(true)} // Open emoji picker on click
          >
            <GrEmoji />
          </button>
          {/* Emoji picker */}
          <div ref={emojiRef} className="absolute bottom-16 transition-all">
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji} // Add emoji to message on click
              autoFocusSearch={false} // Disable autofocus for search
            />
          </div>
        </div>
      </div>
      {/* Send message button */}
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] hover:bg-[#5d2a96] border-none outline-none text-2xl p-5 rounded-md duration-300 transition-all"
      >
        <IoSend />
      </button>
    </div>
  );
};

export default MessageBar;
