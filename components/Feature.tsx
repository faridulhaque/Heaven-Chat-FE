import Image from "next/image";
import React from "react";

function Feature() {
  return (
    <div className="py-14 mx-auto w-11/12">
      <h2 className="text-center text-3xl md:text-4xl text-white py-3">
        Features for you
      </h2>

      <p className="text-center text-white text-base opacity-80 pb-16 max-w-xl mx-auto">
        Discover the simple joys that make chatting feel natural and secure.
      </p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        {/* Feature Card */}
        <div className="w-full h-64 rounded-md relative">
          
          <div className="absolute h-1/4 w-full border border-[#FF4F4F]/50 border-b-0 rounded-t-md"></div>

          <div className="absolute inset-0 z-10 flex flex-col px-6 py-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-10 h-10 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>

            <h2 className="text-white text-xl mb-2">Chat Safely</h2>
            <p className="text-white text-sm opacity-80">
              Connect through text without sharing your name — just your
              thoughts.
            </p>
          </div>
        </div>

        {/* Feature Card */}
        <div className="w-full h-64 rounded-md relative">
          <div className="absolute h-1/4 w-full border border-[#FF4F4F]/50 border-b-0 rounded-t-md"></div>

          <div className="absolute inset-0 z-10 flex flex-col px-6 py-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-10 h-10 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>

            <h2 className="text-white text-xl mb-2">Talk Freely</h2>
            <p className="text-white text-sm opacity-80">
              Talk in real time with complete privacy — no identity, no
              judgment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feature;
