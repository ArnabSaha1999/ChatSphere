import { useEffect } from "react"; // Importing useEffect hook
import Logo from "./components/LogoContainer"; // Importing Logo component
import NewDM from "./components/NewDM"; // Importing NewDM component for creating a new direct message
import ProfileInfo from "./components/ProfileInfo"; // Importing ProfileInfo component to display user's profile info
import Title from "./components/Title"; // Importing Title component for section titles
import { apiClient } from "@/lib/apiClient"; // Importing apiClient to make API calls
import {
  GET_DM_CONTACTS_ROUTE, // Constant for direct messages API route
  GET_USER_CHANNELS_ROUTE, // Constant for user channels API route
} from "@/utils/constants"; // Importing constants for API routes
import { useAppStore } from "@/store"; // Importing custom store hook for state management
import ContactList from "@/components/ContactList"; // Importing ContactList component to display contacts or channels
import CreateChannel from "./components/CreateChannel"; // Importing CreateChannel component for creating a new channel

const ContactsContainer = () => {
  const {
    setDirectMessagesContacts, // State setter for direct message contacts
    directMessagesContacts, // State for direct message contacts
    channels, // State for user channels
    setChannels, // State setter for channels
  } = useAppStore(); // Custom hook to access the application store

  useEffect(() => {
    // Function to fetch contacts
    const getContacts = async () => {
      const res = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true, // Include credentials for secure requests
      });
      // Check if the response data is different from the current state
      if (
        res.data.contacts &&
        JSON.stringify(res.data.contacts) !==
          JSON.stringify(directMessagesContacts)
      ) {
        setDirectMessagesContacts(res.data.contacts); // Update contacts state
      }
    };

    // Function to fetch channels
    const getChannels = async () => {
      const res = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true, // Include credentials for secure requests
      });
      // Check if the response data is different from the current state
      if (
        res.data.channels &&
        JSON.stringify(res.data.channels) !== JSON.stringify(channels)
      ) {
        setChannels(res.data.channels); // Update channels state
      }
    };

    // Fetch contacts and channels
    getContacts();
    getChannels();
  }, [directMessagesContacts, channels]); // Dependency array to re-run when contacts or channels change

  return (
    // Main container for contacts section
    <div className="relative md:w-[35vw] lg:w[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      {/* Logo container */}
      <div className="pt-3">
        <Logo /> {/* Logo component */}
      </div>
      {/* Direct Messages Section */}
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />{" "}
          {/* Title for Direct Messages section */}
          <NewDM /> {/* Button to create a new direct message */}
        </div>
        {/* Scrollable list of direct message contacts */}
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />{" "}
          {/* Contact list for direct messages */}
        </div>
      </div>
      {/* Channels Section */}
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" /> {/* Title for Channels section */}
          <CreateChannel /> {/* Button to create a new channel */}
        </div>
        {/* Scrollable list of channels */}
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />{" "}
          {/* Contact list for channels */}
        </div>
      </div>
      {/* Profile Info Section */}
      <ProfileInfo /> {/* Profile information of the user */}
    </div>
  );
};

export default ContactsContainer; // Exporting ContactsContainer component
