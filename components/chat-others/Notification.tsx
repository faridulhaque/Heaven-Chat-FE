"use client";
import { Context } from "@/app/layout";
import { useCheckIfBlockedQuery } from "@/services/queries/othersApi";
import { UserPayload } from "@/services/types";
import Image from "next/image";
import React, { useContext } from "react";

type NotificationComponent = {
  user: UserPayload | null;
  handleStartChat: (value: string) => void;
  setIsAi: (value: boolean) => void;
};

export default function Notification({
  user,
  handleStartChat,
  setIsAi,
}: NotificationComponent) {
  const { loggedInUser } = useContext(Context);

  const { data: blockCheck, isLoading: checkingBlock } =
    useCheckIfBlockedQuery<any>([loggedInUser?.userId, user?.userId], {
      skip: !loggedInUser?.userId || !user?.userId,
    });

  const isBlocked = blockCheck?.data;

  return (
    <>
      {!isBlocked && (
        <div className="relative w-full h-16 flex items-center px-3 z-10 bg-[#2A2B32] border-[#FF4F4F]/80 bottom-0">
          <Image
            className="rounded-full"
            src={user?.avatar || "/assets/avatar-3.webp"}
            alt="avatar"
            width={36}
            height={36}
          />

          <div className="ml-3 text-white w-[70%] overflow-hidden">
            <h2 className="text-sm font-medium truncate">{user?.name}</h2>
          </div>

          <button
            disabled={checkingBlock}
            onClick={() => {
              handleStartChat(user?.userId as string);
              setIsAi(false);
            }}
            className="text-white absolute right-3 top-3 opacity-90 text-xs btn px-2 py-2 rounded-md bg-[#FF4F4F] cursor-pointer"
          >
            Say Hi
          </button>
        </div>
      )}
    </>
  );
}
