import { useEffect } from "react";
import Logo from "./components/LogoContainer";
import NewDM from "./components/NewDM";
import ProfileInfo from "./components/ProfileInfo";
import Title from "./components/Title";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";

const ContactsContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts } = useAppStore();
  useEffect(() => {
    console.log("readloding");
    const getContacts = async () => {
      const res = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      if (
        res.data.contacts &&
        JSON.stringify(res.data.contacts) !==
          JSON.stringify(directMessagesContacts)
      ) {
        setDirectMessagesContacts(res.data.contacts);
      }
    };

    getContacts();
  }, [directMessagesContacts]);

  return (
    <div className="relative md:w-[35vw] lg:w[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;
