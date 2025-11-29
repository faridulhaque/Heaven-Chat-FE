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
  setChatOpen?: (value: boolean) => void;
};

export default function Notification({
  user,
  handleStartChat,
  setIsAi,
  setChatOpen,
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
        <div className="w-full h-16 flex items-center justify-between px-3 z-10 bg-[#2A2B32] border-[#FF4F4F]/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <Image
              className="rounded-full"
              src={user?.avatar || "/assets/avatar-3.webp"}
              alt="avatar"
              width={36}
              height={36}
            />

            <h2 className="text-sm font-medium text-white truncate max-w-[140px]">
              {user?.name}
            </h2>
          </div>

          <button
            disabled={checkingBlock}
            onClick={() => {
              handleStartChat(user?.userId as string);
              setIsAi(false);
              setChatOpen?.(true);
            }}
            className="cursor-pointer text-white text-xs btn px-3 py-2 rounded-md bg-[#FF4F4F]"
          >
            Say Hi
          </button>
        </div>
      )}
    </>
  );
}
