import { Chat, LastMessageValue } from "@/services/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type ChatListItemComponent = {
  conversation: Chat;
  setConversationId: (cId: string) => void;
  setAi: (b: boolean) => void;
  selected: boolean;
  socketRef: React.RefObject<Socket | null>;
  lastMessageData: LastMessageValue;
};

export default function ChatListItem({
  conversation,
  setConversationId,
  setAi,
  socketRef,
  lastMessageData,
  selected,
}: ChatListItemComponent) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("is_online", conversation?.counterParty?.userId);

    socket.on("is_online", (value) => {
      setIsOnline(value);
    });

    return () => {
      socket.off("is_online");
    };
  }, [
    socketRef.current,
    conversation?.counterParty?.userId,
    conversation?.conversationId,
  ]);

  return (
    <>
      <div
        onClick={() => {
          setConversationId(conversation.conversationId);
          setAi(false);
        }}
        className={`w-full h-16 flex items-center px-3 relative cursor-pointer hover:bg-[#2A2B32] ${
          selected ? "bg-[#2A2B32]" : ""
        }`}
      >
        <Image
          className="rounded-full"
          src={conversation?.counterParty?.avatar || "/assets/avatar-1.webp"}
          alt="avatar"
          width={36}
          height={36}
        />

        <div className="ml-3 text-white w-[70%] overflow-hidden">
          <h2 className="text-sm font-medium truncate">
            {conversation?.counterParty?.name}
            {isOnline && (
              <span className="w-2 h-2 rounded-full bg-green-500 ml-3 inline-block" />
            )}
          </h2>
          <span className="opacity-70 text-xs truncate">
            {lastMessageData?.message ?? conversation?.lastMessage ?? ""}
          </span>
        </div>

        <span className="text-white absolute right-3 top-3 opacity-60 text-xs">
          {lastMessageData?.time
            ? new Date(lastMessageData.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : conversation?.updatedAt
            ? new Date(conversation.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "00:00"}
        </span>
      </div>
    </>
  );
}
