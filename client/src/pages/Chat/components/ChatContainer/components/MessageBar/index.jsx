import { useRef, useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { GrEmoji } from "react-icons/gr";
import { GrAttachment } from "react-icons/gr";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { Input } from "@/components/ui/input";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import { apiClient } from "@/lib/api-client";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleClickOutside = event => {
    if (emojiRef.current && !emojiRef.current.contains(event.target)) {
      setEmojiPickerOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = emoji => {
    setMessage(msg => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileURL: undefined,
      });
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachementChange = async event => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
        });
        console.log(res.data);
        if (res.status === 200 && res.data) {
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileURL: res.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md border-none focus:border-none focus:outline-none items-center"
          placeholder="Enter message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          onClick={() => handleAttachmentClick()}
          className="text-2xl text-neutral-500 hover:text-white focus:text-white duration-300 transition-all"
        >
          <GrAttachment />
        </button>
        <Input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachementChange}
        />
        <div className="relative">
          <button
            className="text-2xl text-neutral-500 hover:text-white focus:text-white duration-300 transition-all mt-2"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <GrEmoji />
          </button>
          <div ref={emojiRef} className="absolute bottom-16 transition-all">
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
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
