import React, { useState } from "react"; // Importing React and useState hook
import background from "@/assets/login2.png"; // Importing background image
import victory from "@/assets/victory.svg"; // Importing victory SVG image
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Importing Tabs components from the UI library
import { Input } from "@/components/ui/input"; // Importing Input component from the UI library
import { Button } from "@/components/ui/button"; // Importing Button component from the UI library
import { useToast } from "@/hooks/use-toast"; // Importing the custom toast hook
import { apiClient } from "@/lib/apiClient"; // Importing the API client for making requests
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants"; // Importing constants for login and signup routes
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook from react-router-dom for navigation
import { useAppStore } from "@/store"; // Importing the application store

const Auth = () => {
  // Setting up state variables for email, password, and confirmPassword
  const { setUserInfo } = useAppStore(); // Extracting the setUserInfo function from the store
  const navigate = useNavigate(); // Initializing the navigate function for navigation
  const [email, setEmail] = useState(""); // State for storing email input
  const [password, setPassword] = useState(""); // State for storing password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State for storing confirm password input

  const { toast } = useToast(); // Initializing the toast function for displaying messages

  // Function to validate login form
  const validateLogin = () => {
    if (!email.length) {
      toast({
        variant: "destructive",
        title: "Email is required", // Displaying an error message if email is empty
      });
      return false; // Returning false to prevent further execution
    }
    if (!password.length) {
      toast({
        variant: "destructive",
        title: "Password is required", // Displaying an error message if password is empty
      });
      return false; // Returning false to prevent further execution
    }
    return true; // Returning true if validation passes
  };

  // Function to validate signup form
  const validateSignup = () => {
    if (!email.length) {
      toast({
        variant: "destructive",
        title: "Email is required", // Displaying an error message if email is empty
      });
      return false; // Returning false to prevent further execution
    }
    if (!password.length) {
      toast({
        variant: "destructive",
        title: "Password is required", // Displaying an error message if password is empty
      });
      return false; // Returning false to prevent further execution
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password and Confirm Password should be same", // Displaying an error if passwords do not match
      });
      return false; // Returning false to prevent further execution
    }
    return true; // Returning true if validation passes
  };

  // Function to handle login
  const handleLogin = async () => {
    if (validateLogin()) {
      // Proceed if login validation passes
      const res = await apiClient.post(
        // Sending a POST request to the login API
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.user.id) {
        // Checking if the user ID exists in the response
        setUserInfo(res.data.user); // Setting the user info in the app store
        if (res.data.user.profileSetup) {
          navigate("/chat"); // Navigate to the chat page if profile is set up
        } else {
          navigate("/profile"); // Navigate to the profile page if profile is not set up
        }
      }
    }
  };

  // Function to handle signup
  const handleSignup = async () => {
    if (validateSignup()) {
      // Proceed if signup validation passes
      const res = await apiClient.post(
        // Sending a POST request to the signup API
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 201) {
        // If the response status is 201, indicating successful signup
        setUserInfo(res.data.user); // Setting the user info in the app store
        navigate("/profile"); // Navigate to the profile page
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      {/* Main container for the login/signup page */}
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        {/* Left section with form for login/signup */}
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            {/* Title and victory image */}
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          {/* Tabs for switching between login and signup */}
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                {/* Tab for Login */}
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                {/* Tab for Sign Up */}
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              {/* Content for the Login tab */}
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)} // Updating email state
                  className="rounded-full p-6"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)} // Updating password state
                  className="rounded-full p-6"
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>

              {/* Content for the Sign Up tab */}
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)} // Updating email state
                  className="rounded-full p-6"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)} // Updating password state
                  className="rounded-full p-6"
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} // Updating confirm password state
                  className="rounded-full p-6"
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Right section with background image */}
        <div className="xl:flex justify-center items-center hidden">
          <img src={background} alt="Background Image" className="h-[700px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
