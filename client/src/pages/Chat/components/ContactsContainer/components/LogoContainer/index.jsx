import logo from "@/assets/ChatSphere_Logo.jpg"; // Importing the logo image file

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      {/* Flex container to align logo and text with padding */}
      <img className="w-16 h-16" src={logo} alt="ChatSphere Logo" />{" "}
      {/* Displaying the logo image */}
      <span className="text-3xl font-semibold ">ChatSphere</span>{" "}
      {/* Displaying the "ChatSphere" text with large font size */}
    </div>
  );
};

export default Logo; // Exporting the Logo component
