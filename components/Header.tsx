import Image from "next/image";
import React from "react";

export default function Header() {
  return (
    <div className="pt-5 relative z-5">
      <div className="w-11/12 mx-auto lg:w-3/4 relative z-5">
        <p className="text-center text-lg text-white opacity-80">
          It's free, simple, and always open for good vibes.
        </p>

        <h2 className="text-center text-5xl md:text-5xl text-white py-3 leading-tight">
          Where <span className="text-[#FF4F4F]">Conversation</span> Blooms
        </h2>

        <p className="text-center text-lg text-white opacity-80">
          Welcome to Heaven Chat — a friendly space where every chat feels
          fresh, light, and full of life.
        </p>
        <div className=" w-full h-20 flex items-center justify-center">
          <button className="cursor-pointer bg-[#FF4F4F] rounded-4xl text-white py-3 px-6 flex  text-sm">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
