import Image from "next/image";
import React from "react";

export default function About() {
  return (
    <div id='about' className="w-11/12 h-content relative mx-auto">
      <div className="w-full h-full flex items-center justify-center absolute top-20">
        <div
          className="w-full h-2/5 bg-[#FF5F5F]
      blur-2xl opacity-50
      rounded-2xl"
        ></div>
      </div>
      <div className="bg-black">
        <div className="w-11/12 h-content pb-10 mx-auto relative z-5 bg-black">
          <div className="absolute h-2/5 w-full border border-[#FF4F4F]/50 border-b-0 rounded-t-lg"></div>

          <h2 className="text-4xl text-white text-center pt-10">
            About Heaven Chat
          </h2>
          <p className=" py-10 text-white opacity-80 text-center text-sm sm:w-3/5 mx-auto">
            we believe conversations should feel easy, safe, and meaningful. Our
            mission is to create a space where people can connect freely without
            fear, judgment, or the need to share personal details. Built with
            privacy at its heart, HeavenChat lets you talk, share, and listen
            just like real life, but simpler.
          </p>
          <Image
            className="w-11/12 sm:w-8/12 h-auto mx-auto"
            alt="ss"
            src="/assets/chatview.webp"
            width={600}
            height={400}
          ></Image>
        </div>
      </div>
    </div>
  );
}
