import React, { useState } from "react";
import background from "@/assets/login2.png";
import victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
const Auth = () => {
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { toast } = useToast();

  const validateLogin = () => {
    if (!email.length) {
      toast({
        variant: "destructive",
        title: "Email is required",
      });
      return false;
    }
    if (!password.length) {
      toast({
        variant: "destructive",
        title: "Password is required",
      });
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast({
        variant: "destructive",
        title: "Email is required",
      });
      return false;
    }
    if (!password.length) {
      toast({
        variant: "destructive",
        title: "Password is required",
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password and Confirm Password should be same",
      });
      return false;
    }
    return true;
  };
  const handleLogin = async () => {
    if (validateLogin()) {
      const res = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.user.id) {
        setUserInfo(res.data.user);
        if (res.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
      console.log(res);
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      const res = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setUserInfo(res.data.user);
        navigate("/profile");
      }
      console.log(res);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="rounded-full p-6"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="rounded-full p-6"
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>

              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="rounded-full p-6"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="rounded-full p-6"
                />

                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="rounded-full p-6"
                />

                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="xl:flex justify-center items-center hidden">
          <img src={background} alt="Background Image" className="h-[700px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
