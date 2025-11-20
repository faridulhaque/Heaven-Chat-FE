"use client";
import { Context } from "@/app/layout";
import { handleSignOut, signInWithGoogle } from "@/services/firebase.config";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

type NavbarComponent = {
  handleGoogleSignIn: () => any;
};

export default function Navbar({ handleGoogleSignIn }: NavbarComponent) {
  const value = useContext(Context);

  const { loggedInUser, setLoggedInUser } = value;

  return (
    <div className="w-11/12 h-20 text-white flex items-center justify-between mx-auto font-inter relative">
      <div className="w-3/12 h-full flex items-center">
        <Image width={200} height={50} alt="logo" src="/assets/logo.webp" />
      </div>

      <div className="w-6/12 hidden lg:flex h-full">
        <ul className="h-full flex items-center justify-around w-full">
          <li>
            <Link href="/" className="hover:text-[#FF5F5F]">
              Home
            </Link>
          </li>
          <li>
            <Link href="#features" className="hover:text-[#FF5F5F]">
              Features
            </Link>
          </li>
          <li>
            <Link href="#resources" className="hover:text-[#FF5F5F]">
              Resources
            </Link>
          </li>
          <li>
            <Link href="#about" className="hover:text-[#FF5F5F]">
              About us
            </Link>
          </li>
        </ul>
      </div>

      <div className="lg:w-3/12 w-auto flex items-center justify-end h-full">
        {!loggedInUser ? (
          <button
            onClick={handleGoogleSignIn}
            className="cursor-pointer bg-[#FF4F4F] rounded-lg text-white py-2 px-4 flex items-center gap-2 text-sm"
          >
            <Image
              src="/assets/google-icon.webp"
              alt="google"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span className="hidden sm:block">Sign In With Google</span>
            <span className="sm:hidden">Sign In</span>
          </button>
        ) : (
          <button
            onClick={() => {
              handleSignOut();
              setLoggedInUser(null);
            }}
            className="cursor-pointer bg-[#FF4F4F] rounded-lg text-white py-2 px-4 flex items-center gap-2 text-sm"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
