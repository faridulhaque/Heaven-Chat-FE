"use client";
import { UserPayload } from "@/services/types";
import Image from "next/image";
import React from "react";

type NotificationComponent = {
  onboardedUser: UserPayload | null;
  handleStartChat: (value: string) => void;
};

export default function Notification({
  onboardedUser,
  handleStartChat,
}: NotificationComponent) {
  return (
    <div
      className={`
    w-full h-16 flex items-center px-3 absolute z-10 bg-[#2A2B32] border-[#FF4F4F]/80 bottom-0`}
    >
      <Image
        className="rounded-full"
        src={onboardedUser?.avatar || "/assets/avatar-3.webp"}
        alt="avatar"
        width={36}
        height={36}
      />

      <div className="ml-3 text-white w-[70%] overflow-hidden">
        <h2 className="text-sm font-medium truncate">
          {onboardedUser?.name} has joined just now
        </h2>
      </div>

      <button
        onClick={() => handleStartChat(onboardedUser?.userId as string)}
        className="text-white absolute right-3 top-3 opacity-90 text-xs btn px-2 py-2 rounded-md bg-[#FF4F4F] cursor-pointer"
      >
        Say Hi
      </button>
    </div>
  );
}
