import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Importing Tooltip components for UI hints
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Importing Dialog components to create a modal for new channel
import { useEffect, useState } from "react"; // Importing React hooks for state and side-effects
import { FaPlus } from "react-icons/fa"; // Importing the plus icon for creating a new channel
import { Input } from "@/components/ui/input"; // Importing Input component for channel name input
import { apiClient } from "@/lib/apiClient"; // Importing apiClient for making API requests
import {
  CREATE_CHANNEL_ROUTE, // Constant for the route to create a new channel
  GET_ALL_CONTACTS_ROUTE, // Constant for the route to fetch all contacts
} from "@/utils/constants"; // Importing constants for API routes
import { useAppStore } from "@/store"; // Importing custom store hook to access application state
import { Button } from "@/components/ui/button"; // Importing Button component for submitting form
import MultipleSelector from "@/components/ui/multipleselect"; // Importing MultipleSelector component for selecting contacts

const CreateChannel = () => {
  // States to manage modal visibility, contacts, selected contacts, and channel name
  const { setSelectedChatType, setSelectedChatData, addChannels } =
    useAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false); // State for modal visibility
  const [allContacts, setAllContacts] = useState([]); // State for storing all contacts
  const [selectedContacts, setSelectedContacts] = useState([]); // State for storing selected contacts
  const [channelName, setChannelName] = useState(""); // State for storing the channel name

  // Fetch contacts when component mounts
  useEffect(() => {
    const getData = async () => {
      const res = await apiClient(GET_ALL_CONTACTS_ROUTE, {
        withCredentials: true, // Ensure credentials are included in the request
      });
      setAllContacts(res.data.contacts); // Set the contacts fetched from API
    };
    getData(); // Call the fetch function
  }, []); // Empty dependency array to run only once after initial render

  // Function to handle channel creation
  const CreateChannel = async () => {
    try {
      console.log(selectedContacts.map(contact => console.log(contact))); // Log selected contacts (for debugging)
      if (channelName.length > 0 && selectedContacts.length > 0) {
        // Validate channel name and selected contacts
        const res = await apiClient.post(
          CREATE_CHANNEL_ROUTE, // Send POST request to create a new channel
          {
            name: channelName, // Channel name
            members: selectedContacts.map(contact => contact.value), // Map selected contacts to their values
          },
          { withCredentials: true } // Include credentials in the request
        );
        if (res.status === 201) {
          // If channel is created successfully
          setChannelName(""); // Reset channel name input
          setSelectedContacts([]); // Clear selected contacts
          setNewChannelModal(false); // Close the modal
          addChannels(res.data.channel); // Add the new channel to the store
        }
      }
    } catch (error) {
      console.log({ error }); // Log any errors during the API call
    }
  };

  return (
    <>
      {/* Tooltip to show when the user hovers over the plus icon */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)} // Open modal when the icon is clicked
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel {/* Tooltip text */}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Modal for creating a new channel */}
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel {/* Modal title */}
            </DialogTitle>
          </DialogHeader>
          <div className="">
            {/* Input field for the channel name */}
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none mt-2"
              onChange={e => setChannelName(e.target.value)} // Handle input change
              value={channelName} // Bind value to state
            />
          </div>
          <div>
            {/* Multiple selector for selecting contacts */}
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts} // Populate selector with all contacts
              placeholder="Search Contacts"
              value={selectedContacts} // Bind value to state
              onChange={setSelectedContacts} // Handle contact selection change
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-grey-600">
                  No results Found {/* Message when no contacts are found */}
                </p>
              }
            />
          </div>
          <div>
            {/* Submit button for creating the channel */}
            <Button
              onClick={CreateChannel} // Call the CreateChannel function on click
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            >
              Create Channel {/* Button text */}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel; // Exporting the CreateChannel component
