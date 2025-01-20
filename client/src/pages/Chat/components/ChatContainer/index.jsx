// Importing necessary child components for the ChatContainer page
import ChatHeader from "./components/ChatHeader"; // Header component for the chat interface (e.g., displaying user info)
import MessageBar from "./components/MessageBar"; // Message input bar component for composing new messages
import MessageContainer from "./components/MessageContainer"; // Container component to display the list of messages

// ChatContainer component that encapsulates the chat layout and UI elements
const ChatContainer = () => {
  return (
    // Main container for the chat page, styled to take up the full viewport height and width
    // The flex column layout ensures the child components are stacked vertically
    // The fixed positioning is used for keeping the container fixed at the top (for the chat header and messages)
    // The media query ensures it adjusts when the screen size is small (i.e., on mobile devices)
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      {/* ChatHeader is the header that displays the title, user info, or chat controls */}
      <ChatHeader />

      {/* MessageContainer is responsible for displaying all the chat messages */}
      <MessageContainer />

      {/* MessageBar is the input bar that allows users to type and send new messages */}
      <MessageBar />
    </div>
  );
};

// Exporting the ChatContainer component for use in other parts of the application
export default ChatContainer;
