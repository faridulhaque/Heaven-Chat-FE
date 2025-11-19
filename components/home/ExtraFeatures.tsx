import Image from "next/image";
import React from "react";

export default function ExtraFeatures() {
  return (
    <div id="resources" className="mx-auto w-11/12  h-auto">
      <div className="w-full mx-auto py-1">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 ">
          <div className="md:w-1/2 w-full flex">
            <div className="relative w-full max-w-md h-96 rounded-lg">
              <div className="absolute top-0 left-0 h-1/4 w-full border border-[#FF4F4F]/40 border-b-0 rounded-t-lg"></div>

              <div className="absolute bottom-0 left-0 h-1/4 w-full border border-[#FF4F4F]/40 border-t-0 rounded-b-lg"></div>

              <Image
                src="/assets/feature-1.webp"
                alt="woman"
                width={400}
                height={300}
                className="relative z-10 w-10/12 h-10/12 mx-auto mt-8 object-cover"
              />
            </div>
          </div>

          <div className="text-white md:w-1/2 w-full">
            <h2 className="text-3xl md:text-4xl font-semibold my-4">
              How Our Chat Feature Helps
            </h2>
            <p className="opacity-80 leading-relaxed w-11/12 text-sm mt-5">
              Just sign in with your Google account we never store any personal
              data beyond your email. Choose a nickname, start chatting freely,
              and connect with real people without revealing your identity.
              Every conversation is securely encrypted for your privacy.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto py-16 ">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 ">
          {/* Text Section */}
          <div className="text-white md:w-1/2 w-full order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-semibold my-4">
              Experience Voice Calls with Total Privacy
            </h2>
            <p className="opacity-80 leading-relaxed w-11/12 text-sm mt-5">
              Speak your heart out without fear or judgment. Our anonymous voice
              call feature lets you connect with others instantly — no phone
              number, no identity. Simply tap to call and have real, human
              conversations in a safe and private space.
            </p>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 w-full flex justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-md h-96 rounded-lg">
              <div className="absolute top-0 left-0 h-1/4 w-full border border-[#FF4F4F]/40 border-b-0 rounded-t-lg"></div>
              <div className="absolute bottom-0 left-0 h-1/4 w-full border border-[#FF4F4F]/40 border-t-0 rounded-b-lg"></div>

              <Image
                src="/assets/feature-2.webp"
                alt="woman"
                width={400}
                height={300}
                className="relative z-10 w-10/12 h-10/12 mx-auto mt-8 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
