import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full py-6 px-6 md:px-12 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <h1 className="text-3xl font-black text-black tracking-wide">
          Mew
        </h1>

        <ul className="hidden md:flex items-center gap-10 text-sm text-gray-500 font-medium">
          <li className="text-black font-semibold cursor-pointer">Home</li>
          <li className="hover:text-black cursor-pointer transition">About</li>
          <li className="hover:text-black cursor-pointer transition">Services</li>
          <li className="hover:text-black cursor-pointer transition">Practice</li>
        </ul>

        <button className="bg-transparent border-2 border-black px-6 py-2.5 rounded-xl text-black font-bold text-sm hover:bg-black hover:text-white transition-colors duration-300">
          Sign up
        </button>

      </div>
    </nav>
  );
}