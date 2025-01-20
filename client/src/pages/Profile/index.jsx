// Importing necessary components and libraries for the Profile page
import { useAppStore } from "@/store"; // Custom hook to access app's global state for user info
import React, { useEffect, useRef, useState } from "react"; // React hooks for managing state, effects, and refs
import { useNavigate } from "react-router-dom"; // For navigating between different pages/routes
import { IoArrowBack } from "react-icons/io5"; // Back arrow icon component for navigation
import { Avatar, AvatarImage } from "@/components/ui/avatar"; // Avatar components for displaying profile image
import { colors, getColor } from "@/lib/utils"; // Utility functions for color management
import { FaTrash, FaPlus } from "react-icons/fa"; // Trash and Plus icons for image handling
import { Input } from "@/components/ui/input"; // Input component for text fields
import { Button } from "@/components/ui/button"; // Button component for actions like saving changes
import { useToast } from "@/hooks/use-toast"; // Toast notification for user feedback
import { apiClient } from "@/lib/apiClient"; // API client for making requests to the backend
import {
  ADD_PROFILE_IMAGE_ROUTE, // API route to add or update profile image
  HOST, // Base host URL for the API
  REMOVE_PROFILE_IMAGE_ROUTE, // API route to remove the profile image
  UPDATE_PROFILE_ROUTE, // API route to update the user's profile data (first name, last name, color)
} from "@/utils/constants"; // Constants for API routes and other configurations

// Profile Component
const Profile = () => {
  // Extract user information and state management from the global app store
  const { userInfo, setUserInfo } = useAppStore(); // Using the custom hook to access user info from the global state
  const navigate = useNavigate(); // Hook to navigate between different routes

  // Local state for managing form inputs and profile display
  const [firstName, setFirstName] = useState(""); // State for storing user's first name
  const [lastName, setLastName] = useState(""); // State for storing user's last name
  const [image, setImage] = useState(""); // State for storing profile image URL
  const [hovered, setHovered] = useState(false); // State to track if the avatar is being hovered over
  const [selectedColor, setSelectedColor] = useState(0); // State to store the selected color for the avatar background
  const fileInputRef = useRef(null); // Ref for file input element for selecting an image
  const { toast } = useToast(); // Hook for displaying toast notifications

  // useEffect to update profile data when userInfo changes
  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName); // Update the first name from the global state
      setLastName(userInfo.lastName); // Update the last name from the global state
      setSelectedColor(userInfo.color); // Set the selected color for the avatar from global state
      if (userInfo.image) {
        setImage(`${HOST}/${userInfo.image}`); // Set the profile image if it exists
      }
    }
  }, [userInfo]); // Dependency on userInfo, so it re-runs when userInfo changes

  // Function to validate the profile input fields
  const validateProfile = () => {
    if (!firstName) {
      toast({
        variant: "destructive",
        title: "First Name is required!", // Show a toast if first name is missing
      });
      return false; // Return false to prevent saving changes if validation fails
    }
    if (!lastName) {
      toast({
        variant: "destructive",
        title: "Last Name is required!", // Show a toast if last name is missing
      });
      return false; // Return false to prevent saving changes if validation fails
    }
    return true; // Return true if both first name and last name are valid
  };

  // Function to save profile changes (first name, last name, selected color)
  const saveChanges = async () => {
    if (validateProfile()) {
      // Only proceed if the profile is valid
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE_ROUTE, // API route to update the user's profile
          { firstName, lastName, color: selectedColor }, // Send the updated data
          { withCredentials: true } // Include credentials (cookies) for authenticated requests
        );
        if (res.status === 200 && res.data) {
          setUserInfo({ ...res.data }); // Update the global app state with the new profile data
          toast({
            variant: "success",
            title: "Profile Updated Successfully!", // Show success toast
          });
        }
      } catch (error) {
        console.log(error); // Log any errors during the API request
      }
    }
  };

  // Function to handle navigation to the chat page (if profile is set up)
  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat"); // Navigate to the chat page if profile is set up
      return true; // Return true to indicate successful navigation
    } else {
      toast({
        variant: "destructive",
        title: "Please setup profile", // Show toast asking user to set up profile
      });
      return false; // Return false if navigation is not allowed
    }
  };

  // Function to trigger the file input click event for selecting a profile image
  const handleFileInputClick = () => {
    fileInputRef.current.click(); // Simulate a click on the hidden file input element
  };

  // Function to handle profile image change (upload a new image)
  const handleImageChange = async event => {
    const file = event.target.files[0]; // Get the file selected by the user
    if (file) {
      const formData = new FormData(); // Create a new FormData object to send the file
      formData.append("profile-image", file); // Append the file to FormData
      const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true, // Include credentials for the authenticated request
      });
      if (res.status === 200 && res.data.image) {
        setUserInfo({ ...userInfo, image: res.data.image }); // Update user info with the new image
        toast({
          variant: "success",
          title: "Image updated successfully", // Show success toast
        });
      }
    }
  };

  // Function to delete the profile image (remove it from the server)
  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true, // Include credentials in the request
      });
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null }); // Clear the user's image in the app state
        toast({
          variant: "success",
          title: "Image removed successfully", // Show success toast
        });
        setImage(null); // Reset the image state to null
      }
    } catch (error) {
      console.log(error); // Log any errors during image removal
    }
  };

  // JSX structure for rendering the Profile page
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />{" "}
          {/* Back navigation icon */}
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)} // Show icons when the avatar is hovered
            onMouseLeave={() => setHovered(false)} // Hide icons when the avatar is not hovered
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                /> // If image is available, display it in the avatar
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}
                >
                  {firstName
                    ? firstName.split("").shift() // Use the first letter of the first name
                    : userInfo.email.split("").shift()}{" "}
                  {/* Use the first letter of email if no first name */}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 p-5 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                onClick={image ? handleDeleteImage : handleFileInputClick} // On click, either delete or upload image
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" /> // Trash icon if image is present
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" /> // Plus icon if no image
                )}
              </div>
            )}
            <Input
              type="file"
              ref={fileInputRef} // Reference to the file input element
              className="hidden" // Hide the file input element from the UI
              onChange={handleImageChange} // Handle file input change (image upload)
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp" // Supported image formats
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full flex flex-col gap-2">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />{" "}
              {/* Email input field (disabled) */}
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)} // Update first name on input change
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />{" "}
              {/* First name input field */}
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)} // Update last name on input change
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />{" "}
              {/* Last name input field */}
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
                  ${selectedColor === index ? "outline outline-white/60" : ""}`}
                  key={index}
                  onClick={() => setSelectedColor(index)} // Handle color selection for avatar background
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="w-full h-16 bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges} // Save changes when clicked
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
