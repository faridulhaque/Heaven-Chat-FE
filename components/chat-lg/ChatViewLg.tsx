"use client";
import React, { useContext, useEffect, useState } from "react";
import ChatListItem from "../chat-others/ChatListItem";
import ChatBox from "./ChatBox";
import {
  Chat,
  LastMessageMap,
  LastMessageValue,
  UserPayload,
} from "@/services/types";
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
import BottomBar from "../chat-others/BottomBar";
import Image from "next/image";

type ChatViewLgComponent = {
  onboardedUser: UserPayload | null;
  recipientId: string;
  setOnboardedUser: (u: UserPayload | null) => void;
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
  const [isChatList, setChatList] = useState(true);
  const [isAi, setAi] = useState(true);
  const [lastMessages, setLastMessages] = useState<LastMessageMap>(new Map());

  const value = useContext(Context);
  const { loggedInUser } = value;

  const [startChat, { isLoading: starting }] = useStartChatMutation();

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

  if (chatLoading) return <Loading></Loading>;
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
              <Image
                className="rounded-full"
                src={loggedInUser?.avatar || "/assets/avatar-1.webp"}
                alt="avatar"
                width={36}
                height={36}
              />
            </div>
          </div>

          {isChatList ? (
            <div className="mt-2">
              <AIChatItem
                isAi={isAi}
                setAi={setAi}
                setConversationId={setConversationId}
              ></AIChatItem>
              {chatList?.length &&
                chatList?.map((c: Chat) => (
                  <ChatListItem
                    lastMessageData={
                      lastMessages.get(conversationId) as LastMessageValue
                    }
                    socketRef={socketRef}
                    selected={c.conversationId === conversationId}
                    setConversationId={setConversationId}
                    setAi={setAi}
                    conversation={c}
                    key={c?.conversationId}
                  ></ChatListItem>
                ))}
            </div>
          ) : (
            <div>
              <Notification
                handleStartChat={handleStartChat}
                onboardedUser={onboardedUser}
              ></Notification>
            </div>
          )}
          <BottomBar
            handleSignOut={handleSignOut}
            setChatList={setChatList}
          ></BottomBar>
        </div>

        <div className="flex-1 rounded-lg">
          {isAi ? (
            <ChatBoxAi></ChatBoxAi>
          ) : (
            <ChatBox
              socketRef={socketRef}
              conversationId={conversationId}
              setAi={setAi}
              setLastMessages={setLastMessages}
              lastMessages={lastMessages}
            />
          )}
        </div>
      </div>
    </div>
  );
}
