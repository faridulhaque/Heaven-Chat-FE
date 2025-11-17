import React from "react";
import Image from "next/image";

export default function ReceivedMessage() {
  return (
    <div className="w-full flex justify-start my-2 px-4">
      <Image
        className="rounded-full mr-3"
        src="/assets/avatar-1.webp"
        alt="avatar"
        width={30}
        height={30}
      />

      <div className="bg-[#2b2b2f] max-w-[75%] px-3 py-2 text-white rounded-r-lg">
        Lorem ipsum dolor sit amet...
      </div>
    </div>
  );
}
