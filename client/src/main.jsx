import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/toaster";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <App />
    <Toaster />
  </SocketProvider>
);
