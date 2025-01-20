// Importing necessary hooks, stores, and components for the Chat page
import { useToast } from "@/hooks/use-toast"; // Custom hook for showing toast notifications
import { useAppStore } from "@/store"; // Accessing app store to get global states (userInfo, chat state, etc.)
import { useEffect } from "react"; // useEffect hook for executing side effects (e.g., navigating based on conditions)
import { useNavigate } from "react-router-dom"; // useNavigate hook for navigating between pages
import ContactsContainer from "./components/ContactsContainer"; // Component for displaying the contacts list
import EmptyChatContainer from "./components/EmptyChatContainer"; // Component shown when no chat is selected
import ChatContainer from "./components/ChatContainer"; // Component that displays the selected chat's messages and input

// Chat component which acts as the main container for the chat application
const Chat = () => {
  const { toast } = useToast(); // Toast hook for displaying notifications
  const {
    userInfo, // User info fetched from the global state
    selectedChatType, // The selected type of chat (e.g., one-on-one, group chat)
    isUploading, // Flag indicating whether a file is being uploaded
    isDownloading, // Flag indicating whether a file is being downloaded
    fileUploadProgress, // Progress percentage for file uploads
    fileDownloadProgress, // Progress percentage for file downloads
  } = useAppStore(); // Accessing the global state for managing app data
  const navigate = useNavigate(); // Hook for navigating between routes

  // Side effect to check if the user profile is set up
  // If the user profile is not set up, navigate to the profile setup page
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast({
        variant: "destructive", // Destructive toast variant for critical messages
        title: "Please setup profile to continue!", // Displaying a message to prompt the user to set up their profile
      });
      navigate("/profile"); // Redirecting the user to the profile setup page
    }
  }, [userInfo, navigate]); // Dependencies: re-run when `userInfo` or `navigate` changes

  return (
    // Main container for the chat page, styled for full height with text color set to white
    // The overflow-hidden ensures that no scrollbars appear in the chat container
    <div className="flex h-[100vh] text-white overflow-hidden poppins-medium">
      {/* Displaying an overlay for file upload progress if a file is being uploaded */}
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>{" "}
          {/* Displaying the upload status */}
          {fileUploadProgress}%{" "}
          {/* Displaying the upload progress percentage */}
        </div>
      )}

      {/* Displaying an overlay for file download progress if a file is being downloaded */}
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>{" "}
          {/* Displaying the download status */}
          {fileDownloadProgress}%{" "}
          {/* Displaying the download progress percentage */}
        </div>
      )}

      {/* Contacts container that displays the list of available contacts */}
      <ContactsContainer />

      {/* Conditional rendering: Show either EmptyChatContainer or ChatContainer based on selectedChatType */}
      {selectedChatType === undefined ? (
        // If no chat is selected, show the EmptyChatContainer as a placeholder
        <EmptyChatContainer />
      ) : (
        // If a chat is selected, show the actual chat container with messages and input fields
        <ChatContainer />
      )}
    </div>
  );
};

// Exporting the Chat component for use in other parts of the application
export default Chat;
