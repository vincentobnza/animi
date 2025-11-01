import React from "react";

export default function Navbar() {
  return (
    <div className="w-full h-20 flex items-center justify-between px-5 md:px-10 lg:px-20">
      {/* LOGO */}
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold bg-linear-to-r from-purple-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent font-mono">
        ANIMI.
      </h1>
    </div>
  );
}
