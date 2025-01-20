import { useAppStore } from "@/store"; // Custom hook to access application state from the store
import { Avatar, AvatarImage } from "./ui/avatar"; // Avatar component and AvatarImage for profile pictures
import { HOST } from "@/utils/constants"; // HOST constant used for constructing the image URL
import { getColor } from "@/lib/utils"; // Utility function for generating a color for the avatar

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData, // Stores the currently selected chat (contact or channel)
    setSelectedChatData, // Function to set selected chat data
    setSelectedChatType, // Function to set the type of selected chat (either 'contact' or 'channel')
    setSelectedChatMessages, // Function to reset chat messages when selecting a new chat
  } = useAppStore(); // Using the app store to manage state

  // Handle click on a contact/channel
  const handleClick = contact => {
    // Setting the chat type depending on whether it's a channel or contact
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatData(contact); // Setting the selected contact data

    // If the currently selected chat is different from the clicked contact, reset the messages
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]); // Clear chat messages for the new selection
    }
  };

  return (
    <div className="mt-5">
      {contacts.map(contact => (
        <div
          key={contact._id} // Unique key for each contact/channel
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]" // Highlight the selected contact/channel
              : "hover:bg-[#f1f1f111]" // Light hover effect for unselected items
          }`}
          onClick={() => handleClick(contact)} // On click, update selected chat and reset messages if necessary
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {/* Avatar section */}
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`} // Display profile image from server
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`${
                      selectedChatData && selectedChatData._id === contact._id
                        ? "bg-[#ffffff22] border border-white/70" // Selected contact
                        : getColor(contact.color) // Custom color for the avatar background
                    }
                      uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full `}
                  >
                    {/* Display the first letter of the first name or email if no image */}
                    {contact.firstName
                      ? contact.firstName.split("").shift() // First letter of first name
                      : contact.email.split("").shift()}{" "}
                    {/* First letter of email */}
                  </div>
                )}
              </Avatar>
            )}
            {/* Channel section */}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                # {/* Display "#" symbol for channels */}
              </div>
            )}
            {/* Display name or email based on whether it's a contact or channel */}
            {isChannel ? (
              <span>{contact.name}</span> // Channel name
            ) : (
              <span className="text-ellipsis whitespace-nowrap overflow-x-hidden">
                {/* Display contact's full name or email */}
                {contact.firstName
                  ? `${contact.firstName} ${contact.lastName}` // Contact full name
                  : `${contact.email}`}{" "}
                {/* Email if no name is provided */}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
