import { TMessageDataFE } from "@/services/types";
import React from "react";

type SentMessageComponent = {
  message: TMessageDataFE;
};
export default function SentMessage({ message }: SentMessageComponent) {
  return (
    <div className="w-full flex justify-end my-2 px-4">
      <div className="bg-[#FF4F4F] text-white px-4 py-2 rounded-lg rounded-br-none max-w-[75%] w-fit">
        {message.message}
      </div>
    </div>
  );
}
