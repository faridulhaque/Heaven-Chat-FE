import { TMessageDataFE } from "@/services/types";
import React from "react";

type SentMessageComponent = {
  message: TMessageDataFE;
};
export default function SentMessage({ message }: SentMessageComponent) {
  return (
    <div className="w-full flex justify-end my-2 px-4">
      <div className="bg-[#922626] max-w-[75%] px-3 py-2 text-white rounded-l-lg">
        {message.message}
      </div>
    </div>
  );
}
