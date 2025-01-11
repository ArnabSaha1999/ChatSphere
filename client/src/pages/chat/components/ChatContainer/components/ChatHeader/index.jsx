import { IoMdClose } from "react-icons/io";
const ChatHeader = () => {
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center"></div>
        <div className="flex items-center justify-center gap-5">
          <button className="text-neutral-500 bg-transparent hover:bg-transparent focus:border-none focus:outline-none focus:text-white duration-300 transition-all p-2 rounded-lg">
            <IoMdClose className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
