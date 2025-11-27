"use client";
import { Context } from "@/app/layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
type HeaderComponent = {
  handleGoogleSignIn: () => any;
};

export default function Header({ handleGoogleSignIn }: HeaderComponent) {
  const value = useContext(Context);

  const { loggedInUser, setLoggedInUser } = value;
  const router = useRouter();
  return (
    <div className="pt-10 relative z-5">
      <div className="w-11/12 mx-auto lg:w-3/4">
        <p className="text-center text-base text-[#E5E5E5] opacity-80">
          It's free, simple, and always open for good vibes.
        </p>

        <h2 className="text-center text-4xl md:text-5xl font-semibold text-[#E5E5E5] py-4 leading-tight">
          Where <span className="text-[#FF4F4F]">Conversation</span> Blooms
        </h2>

        <p className="text-center text-base text-[#E5E5E5] opacity-80 max-w-2xl mx-auto">
          Welcome to Heaven Chat — a friendly space where every chat feels
          fresh, light, and full of life.
        </p>

        <div className="w-full h-20 flex items-center justify-center">
          {loggedInUser ? (
            <button
              onClick={() => router.push("/chat")}
              className="bg-[#FF4F4F] rounded-3xl cursor-pointer text-white py-3 px-7 text-sm"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="bg-[#FF4F4F] cursor-pointer rounded-3xl text-white py-3 px-7 text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
