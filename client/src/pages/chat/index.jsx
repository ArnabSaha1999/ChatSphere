import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { toast } = useToast();
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast({
        variant: "destructive",
        title: "Please setup profile to continue!",
      });
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return <div>Chat Page</div>;
};

export default Chat;
