import Image from "next/image";
import React from "react";

export default function ChatListItem() {
  return (
    <div className="w-full h-16 flex items-center px-3 relative cursor-pointer hover:bg-[#2A2B32]">
      <Image
        className="rounded-full"
        src="/assets/avatar-1.webp"
        alt="avatar"
        width={36}
        height={36}
      />

      <div className="ml-3 text-white w-[70%] overflow-hidden">
        <h2 className="text-sm font-medium truncate">Matt White</h2>
        <span className="opacity-70 text-xs truncate">hello man</span>
      </div>

      <span className="text-white absolute right-3 top-3 opacity-60 text-xs">
        10:05 pm
      </span>
    </div>
  );
}
