import React from "react";
import Image from "next/image";
import { TMessageDataFE } from "@/services/types";

type ReceivedMessageComponent = {
  message: TMessageDataFE;
  avatar: string;
};

export default function ReceivedMessage({
  message,
  avatar,
}: ReceivedMessageComponent) {
  return (
    <div className="w-full flex items-start my-4">
      <div className="mr-3 shrink-0">
        <Image
          className="rounded-full"
          src={avatar || "/assets/avatar-1.webp"}
          alt="avatar"
          width={36}
          height={36}
        />
      </div>

      <div className="bg-[#2A2A2E] text-white px-4 py-2 rounded-lg rounded-bl-none max-w-[75%] inline-block break-words">
        {message.message}
      </div>
    </div>
  );
}
