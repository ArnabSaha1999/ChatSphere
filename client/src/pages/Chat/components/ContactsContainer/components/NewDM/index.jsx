import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Importing Tooltip components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Importing Dialog components for modal
import { useState } from "react"; // Importing useState hook for managing component state
import { FaPlus } from "react-icons/fa"; // Importing the plus icon from react-icons
import { Input } from "@/components/ui/input"; // Importing Input component for search
import Lottie from "react-lottie"; // Importing Lottie animation for loading state
import { animationDefaultOptions, getColor } from "@/lib/utils"; // Importing helper functions
import { apiClient } from "@/lib/apiClient"; // Importing API client for making requests
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants"; // Importing constants
import { ScrollArea } from "@/components/ui/scroll-area"; // Importing ScrollArea for scrolling functionality
import { Avatar, AvatarImage } from "@/components/ui/avatar"; // Importing Avatar component for user images
import { useAppStore } from "@/store"; // Importing app state management from store

const NewDM = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false); // State for controlling modal visibility
  const [searchedContacts, setSearchedContacts] = useState([]); // State for storing search results
  const { setSelectedChatType, setSelectedChatData } = useAppStore(); // Accessing store for chat state

  // Function to search contacts based on user input
  const searchContacts = async searchItem => {
    try {
      if (searchItem.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchItem },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.contacts) {
          setSearchedContacts(res.data.contacts); // Setting searched contacts
        }
      } else {
        setSearchedContacts([]); // Clearing search results if input is empty
      }
    } catch (error) {
      console.log(error); // Logging errors
    }
  };

  // Function to handle selection of a contact from the search results
  const selectNewContact = contact => {
    setOpenNewContactModal(false); // Closing the modal
    setSelectedChatType("contact"); // Setting the chat type to contact
    setSelectedChatData(contact); // Storing selected contact data
    setSearchedContacts([]); // Clearing search results after selection
  };

  return (
    <>
      {/* Tooltip for new chat button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)} // Opening the modal on click
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            New chat {/* Tooltip text */}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Dialog modal for selecting a new contact */}
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>{" "}
            {/* Title of the modal */}
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Search contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none mt-2"
              onChange={e => searchContacts(e.target.value)} // Trigger search on input change
            />
          </div>
          {searchedContacts.length <= 0 ? (
            // Loading state when no contacts are found
            <div className="flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all mt-5">
              <Lottie
                isClickToPauseDisabled={true}
                height={150}
                width={150}
                options={animationDefaultOptions} // Default animation options for loading
              />
              <div className="text-opacity-80 flex flex-col gap-5 items-center my-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi! Please search new contact
                </h3>
              </div>
            </div>
          ) : (
            // Displaying search results in a scrollable area
            <ScrollArea className="h-[250px] ">
              <div className="flex flex-col gap-5">
                {searchedContacts.map(contact => (
                  <div
                    className="flex gap-3 items-center cursor-pointer"
                    key={contact._id}
                    onClick={() => selectNewContact(contact)} // Selecting contact on click
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {/* Displaying contact's avatar */}
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="Profile"
                            className="object-cover w-full h-full bg-black rounded-full"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}
                          >
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}{" "}
                            {/* Displaying first letter of contact's name */}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM; // Exporting the NewDM component
