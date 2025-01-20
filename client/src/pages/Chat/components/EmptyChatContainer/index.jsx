// EmptyChatContainer component renders a placeholder animation and a welcome message when no chat is selected.

import { animationDefaultOptions } from "@/lib/utils"; // Importing default animation options for Lottie
import Lottie from "react-lottie"; // Importing the Lottie component to display animations

const EmptyChatContainer = () => {
  return (
    // Flex container with center alignment, hidden by default on small screens.
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      {/* Lottie animation to show a loading or empty state */}
      <Lottie
        isClickToPauseDisabled={true} // Disables the click-to-pause functionality for the animation
        height={200} // Set the height of the animation
        width={200} // Set the width of the animation
        options={animationDefaultOptions} // Applying the default animation options imported above
      />
      {/* Welcome message displayed below the animation */}
      <div className="text-opacity-80 flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          {/* Displaying the dynamic part of the message with a highlighted text */}
          Hi! Welcome to <span className="text-purple-500">ChatSphere</span>
        </h3>
      </div>
    </div>
  );
};

// Exporting the EmptyChatContainer component to be used in other parts of the application
export default EmptyChatContainer;
