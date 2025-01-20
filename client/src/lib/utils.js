import { clsx } from "clsx"; // Importing clsx for conditionally combining class names
import { twMerge } from "tailwind-merge"; // Importing twMerge to merge Tailwind CSS class names intelligently
import animationData from "@/assets/lottie-json.json"; // Importing the animation data for Lottie animation

// Function to combine and merge class names, applying both clsx and tailwind-merge
export function cn(...inputs) {
  return twMerge(clsx(inputs)); // Returns a combined class name after merging conflicting Tailwind CSS classes
}

// Array of predefined color combinations using Tailwind CSS classes
export const colors = [
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]", // Color scheme 1
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]", // Color scheme 2
  "bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]", // Color scheme 3
  "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]", // Color scheme 4
  "bg-[#ffffff2a] text-[#ffffff] border-[1px] border-[#ffffffbb]", // Color scheme 5
];

// Function to get a specific color class based on an index
export const getColor = color => {
  if (color >= 0 && color < colors.length) {
    // Checking if the index is valid
    return colors[color]; // Return the color class at the given index
  }
  return colors[0]; // If index is invalid, return the default color (first item in the array)
};

// Default configuration options for Lottie animation
export const animationDefaultOptions = {
  loop: true, // Loop the animation infinitely
  autoplay: true, // Autoplay the animation once it's loaded
  animationData, // Load the animation data from the imported JSON file
};
