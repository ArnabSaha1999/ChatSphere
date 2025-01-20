// Importing necessary icons, hooks, components, and utilities
import { IoMdClose } from "react-icons/io"; // Close icon for closing the chat
import { useAppStore } from "@/store"; // Accessing app store to get global states like selected chat data
import { Avatar, AvatarImage } from "@/components/ui/avatar"; // Avatar component for displaying user profile image
import { getColor } from "@/lib/utils"; // Utility function for getting a color based on the user's data
import { HOST } from "@/utils/constants"; // Constant for the base URL for images (e.g., profile images)

// ChatHeader component that renders the header section of a chat
const ChatHeader = () => {
  // Extracting values from the app store (e.g., selected chat data, chat type, and closeChat function)
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    // Main container for the chat header, styled with height, border, and flex layout
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-10">
      {/* Left side of the header displaying the chat's avatar and name */}
      <div className="flex gap-5 items-center w-full justify-between">
        {/* Avatar section that conditionally renders the user's avatar or a default icon */}
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            {/* Check if the selected chat is a contact */}
            {selectedChatType === "contact" ? (
              // Avatar component for contact chat, showing profile image or initials if no image is available
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  // Displaying the image from the server if available
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  // Displaying initials with background color if no image is found
                  <div
                    className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}
                  >
                    {/* Display the first character of the first name or email */}
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              // Default icon for group or channel chats
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>

          {/* Chat name or email display */}
          <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px] md:max-w-[350px] lg:max-w-[600px] xl:max-w-[850px]">
            {/* Conditionally render chat name for channel or contact */}
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
        </div>

        {/* Right side of the header containing the close button */}
        <div className="flex items-center justify-center gap-5">
          <button className="text-neutral-500 bg-transparent hover:bg-transparent focus:border-none focus:outline-none focus:text-white duration-300 transition-all p-2 rounded-lg">
            {/* Close button for exiting or closing the chat */}
            <IoMdClose onClick={closeChat} className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Exporting ChatHeader component for use in other parts of the app
export default ChatHeader;
