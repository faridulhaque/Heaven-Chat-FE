import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <div className="bg-black w-full relative mt-20 py-10 flex flex-col items-center">
      <div className="w-3/12 sm:w-2/12 h-1/4 bg-[#FF5F5F] blur-2xl opacity-50 rounded-2xl absolute bottom-0 right-0"></div>

      <div className="flex justify-center mt-6">
        <Image
          width={160}
          height={40}
          alt="logo"
          src="/assets/logo.webp"
          className="w-32 sm:w-40"
        />
      </div>

      <div className="w-full sm:w-3/5 flex flex-wrap items-center justify-center gap-4 mt-8 text-xs sm:text-sm">
        <span className="text-white opacity-80">Twitter</span>
        <span className="text-white opacity-80">Facebook</span>
        <span className="text-white opacity-80">Instagram</span>
        <span className="text-white opacity-80">Github</span>
      </div>

      <h2 className="text-white text-2xl sm:text-4xl text-center mt-8 px-4">
        Ready to enter a different world? Let's start!
      </h2>

      <div className="w-full flex items-center justify-center mt-6">
        <button className="cursor-pointer bg-[#FF4F4F] rounded-lg text-white py-2 px-4 flex items-center gap-2 text-sm">
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
      </div>

      <div className="w-11/12 border-[#FF5F5F] border-t opacity-40 flex flex-col sm:flex-row justify-between items-center mt-10 pt-4">
        <h2 className="text-xs text-white opacity-75">
          2025 HeavenChat. All Rights Reserved.
        </h2>
        <h2 className="text-xs text-white opacity-75 mt-2 sm:mt-0">
          <span className="mr-4 sm:mr-10">Privacy Policy</span>
          <span>Terms & Condition</span>
        </h2>
      </div>
    </div>
  );
}

export default Footer;
