import React from "react";
import Image from "next/image";
import { TMessageDataFE } from "@/services/types";

type ReceivedMessageComponent = {
  message: TMessageDataFE;
};

export default function ReceivedMessage({ message }: ReceivedMessageComponent) {
  return (
    <div className="w-full flex justify-start my-2">
      <Image
        className="rounded-full mr-3"
        src="/assets/avatar-1.webp"
        alt="avatar"
        width={36}
        height={36}
      />

      <div className="bg-[#2A2A2E] text-white px-4 py-2 rounded-lg rounded-bl-none max-w-[75%] w-fit">
        {message.message}
      </div>
    </div>
  );
}
