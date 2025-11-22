"use client";
import React, { useContext, useEffect, useState } from "react";
import ChatListItem from "../chat-others/ChatListItem";
import ChatBox from "./ChatBox";
import { Chat, UserPayload } from "@/services/types";
import Notification from "../chat-others/Notification";
import AIChatItem from "../chat-others/AIChatItem";
import ChatBoxAi from "./ChatBoxAi";
import { Context } from "@/app/layout";
import {
  useCheckIfBlockedQuery,
  useGetChatListQuery,
  useStartChatMutation,
} from "@/services/queries/othersApi";
import Loading from "../others/Loading";
import { handleSignOut } from "@/services/firebase.config";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";

type ChatViewLgComponent = {
  onboardedUser: UserPayload | null;
  setOnboardedUser: (u: UserPayload | null) => void;
  recipientId: string;
  setRecipientId: (v: string) => void;
  conversationId: string;
  setConversationId: (c: string) => void;
  socketRef: React.RefObject<Socket | null>;
};

export default function ChatViewLg({
  onboardedUser,
  setRecipientId,
  recipientId,
  conversationId,
  setConversationId,
  setOnboardedUser,
  socketRef,
}: ChatViewLgComponent) {
  const router = useRouter();
  const [isAi, setAi] = useState(true);
  const value = useContext(Context);
  const { setLoggedInUser } = value;

  const [startChat, { isLoading: starting }] = useStartChatMutation();
  const { data: blockCheck, isLoading: checkingBlock } =
    useCheckIfBlockedQuery<any>(
      [onboardedUser?.userId, value?.loggedInUser?.userId],
      { skip: !onboardedUser?.userId || !value?.loggedInUser?.userId }
    );

  console.log("block checking in chatview lg", blockCheck);
  const { data: chatData, isLoading: chatLoading } =
    useGetChatListQuery<any>("");
  const chatList: any = chatData?.data;

  const handleStartChat = async (recipientId: string) => {
    const res: any = await startChat({
      members: [recipientId, value.loggedInUser?.userId],
    });
    setRecipientId(recipientId);
    setConversationId(res?.data?.data?.conversationId);
    setOnboardedUser(null);
  };

  if (chatLoading | checkingBlock) return <Loading></Loading>;
  return (
    <div className="hidden md:block">
      <div className="w-full sm:w-[95%] mx-auto h-screen flex gap-6">
        <div className="w-4/12 bg-[#1E1F24] h-full relative overflow-y-auto">
          <div className="sticky top-0 left-0 right-0 bg-[#1E1F24] z-20 pt-5 pb-4 px-3 flex items-center gap-3">
            <input
              type="text"
              className="w-full text-white px-4 py-2 bg-[#292933] rounded-3xl outline-none border-none"
              placeholder="Search"
            />

            <div className="flex items-center gap-3">
              <button onClick={() => router.push("/")} className="text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="size-6 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  handleSignOut();
                  setLoggedInUser(null);
                  router.push("/");
                }}
                className="text-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="size-6 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-2">
            <AIChatItem
              setAi={setAi}
              setConversationId={setConversationId}
            ></AIChatItem>
            {chatList?.length &&
              chatList?.map((c: Chat) => (
                <ChatListItem
                  selected={c.conversationId === conversationId}
                  setConversationId={setConversationId}
                  setAi={setAi}
                  conversation={c}
                  key={c?.conversationId}
                ></ChatListItem>
              ))}
          </div>

          {onboardedUser && (
            <Notification
              onboardedUser={onboardedUser}
              handleStartChat={handleStartChat}
            ></Notification>
          )}
        </div>

        <div className="flex-1 rounded-lg">
          {isAi ? (
            <ChatBoxAi></ChatBoxAi>
          ) : (
            <ChatBox socketRef={socketRef} conversationId={conversationId} />
          )}
        </div>
      </div>
    </div>
  );
}
