// Importing components and utilities necessary for the ProfileInfo component
import { Avatar, AvatarImage } from "@/components/ui/avatar"; // Avatar component to display user profile picture
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Tooltip components for adding hover text for actions
import { getColor } from "@/lib/utils"; // Utility function to generate colors for initials
import { useAppStore } from "@/store"; // Global store to manage user data (userInfo and setUserInfo)
import { HOST, LOGOUT_ROUTE } from "@/utils/constants"; // Constants for host and logout API route
import React from "react"; // React library for building UI components
import { FaPen } from "react-icons/fa"; // Icon for editing profile
import { useNavigate } from "react-router-dom"; // Hook to navigate between pages
import { MdLogout } from "react-icons/md"; // Icon for logout action
import { apiClient } from "@/lib/apiClient"; // API client to interact with backend

// ProfileInfo component displays user information and handles logout functionality
const ProfileInfo = () => {
  // Access userInfo and setUserInfo from the store
  const { userInfo, setUserInfo } = useAppStore();
  // Hook for navigation
  const navigate = useNavigate();

  // Function to handle user logout
  const logOut = async () => {
    try {
      // Send a POST request to the logout route
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      // If the logout is successful, navigate to the login page and clear user info
      if (res.status === 200) {
        navigate("/auth");
        setUserInfo(null); // Reset user info in the store
      }
    } catch (error) {
      console.log(error, "UI"); // Log any errors that occur during logout
    }
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-5 w-full bg-[#2a2b33]">
      {/* User Profile Section */}
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {/* Check if user has an image, otherwise show the initial */}
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="Profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}
              >
                {/* Display the first letter of first name or email if no image */}
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        {/* Display user's name (first and last name if available) */}
        <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      {/* Actions Section (Edit Profile and Logout) */}
      <div className="flex gap-5">
        {/* Edit Profile Tooltip and Icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaPen
                onClick={() => navigate("/profile")} // Navigate to profile page on click
                className="text-purple-500 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* Logout Tooltip and Icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <MdLogout
                onClick={logOut} // Handle logout on click
                className="text-red-500 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-red-500">
              Log out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
