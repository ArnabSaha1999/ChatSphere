import logo from "@/assets/ChatSphere_Logo.jpg";

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <img className="w-16 h-16" src={logo} alt="ChatSphere Logo" />
      <span className="text-3xl font-semibold ">ChatSphere</span>
    </div>
  );
};

export default Logo;
