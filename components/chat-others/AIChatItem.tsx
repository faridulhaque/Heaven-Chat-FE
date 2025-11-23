"use client";
import Image from "next/image";
import React from "react";
type AIChatItemComponent = {
  setAi: (value: boolean) => void;
  isAi: boolean;
  setConversationId: (value: string) => void;
};

export default function AIChatItem({
  setAi,
  setConversationId,
  isAi,
}: AIChatItemComponent) {
  return (
    <div
      onClick={() => {
        setAi(true);
        setConversationId("");
      }}
      className={`w-full h-16 flex items-center px-3 relative cursor-pointer hover:bg-[#2A2B32] ${
        isAi ? "bg-[#2A2B32]" : ""
      }`}
    >
      <Image
        className="rounded-full"
        src="/assets/h-ai.webp"
        alt="avatar"
        width={36}
        height={36}
      />

      <div className="ml-3 text-white w-[70%] overflow-hidden">
        <h2 className="text-sm font-medium truncate">Heaven AI</h2>
        <span className="opacity-70 text-xs truncate">
          What' on your mind? 😊
        </span>
      </div>

      <span className="text-white absolute right-3 top-3 opacity-60 text-xs"></span>
    </div>
  );
}
