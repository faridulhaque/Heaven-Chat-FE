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
  useGetUsersQuery,
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
  setCallerId: (v: string) => void;
  setCalleeId: (v: string) => void;
  conversationId: string;
  setConversationId: (c: string) => void;
  socketRef: React.RefObject<Socket | null>;
  setCalleeName: (v: string) => void;
};

export default function ChatViewLg({
  onboardedUser,
  setRecipientId,
  recipientId,
  conversationId,
  setConversationId,
  setOnboardedUser,
  socketRef,
  setCalleeId,
  setCallerId,
  setCalleeName,
}: ChatViewLgComponent) {
  const [searchParam, setSearchParam] = useState("");
  const [searchedData, setSearchedData] = useState<Chat[] | []>([]);

  const { data: usersData, isLoading: usersLoading } =
    useGetUsersQuery<any>("");

  const [isChatList, setChatList] = useState(true);
  const [isAi, setAi] = useState(true);
  const [lastMessages, setLastMessages] = useState<LastMessageMap>(new Map());

  const value = useContext(Context);
  const { loggedInUser } = value;

  const [startChat, { isLoading: starting }] = useStartChatMutation();

  const { data: chatData, isLoading: chatLoading } =
    useGetChatListQuery<any>("");
  const chatList: Chat[] = chatData?.data;

  useEffect(() => {
    const filtered =
      chatList?.filter((c) =>
        c.counterParty.name.toLowerCase().includes(searchParam.toLowerCase())
      ) || [];

    setSearchedData(filtered);
  }, [searchParam, chatList]);

  const handleStartChat = async (recipientId: string) => {
    const res: any = await startChat({
      members: [recipientId, value.loggedInUser?.userId],
    });
    setRecipientId(recipientId);
    setConversationId(res?.data?.data?.conversationId);
    setOnboardedUser(null);
    setChatList(true);
  };

  if (chatLoading | usersLoading) return <Loading></Loading>;
  return (
    <div className="hidden md:block">
      <div className="w-full sm:w-[95%] mx-auto h-screen flex gap-6">
        <div className="w-4/12 bg-[#1E1F24] h-full relative overflow-y-auto">
          <div className="sticky top-0 left-0 right-0 bg-[#1E1F24] z-20 pt-5 pb-4 px-3 flex items-center gap-3">
            {isChatList ? (
              <input
                onChange={(e) => setSearchParam(e.target.value)}
                type="text"
                className="w-full text-white px-4 py-2 bg-[#292933] rounded-3xl outline-none border-none"
                placeholder="Search"
              />
            ) : (
              <h3 className="px-4 py-2 text-white text-lg">
                Chat with new users
              </h3>
            )}

            <div className="flex items-center gap-3 ml-auto">
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
              {(searchedData?.length ? searchedData : chatList)?.map(
                (c: Chat) => (
                  <ChatListItem
                    lastMessageData={
                      lastMessages.get(conversationId) as LastMessageValue
                    }
                    socketRef={socketRef}
                    selected={c.conversationId === conversationId}
                    setConversationId={setConversationId}
                    setAi={setAi}
                    conversation={c}
                    key={c.conversationId}
                  />
                )
              )}
            </div>
          ) : (
            <div>
              {usersData &&
                usersData?.data?.length &&
                usersData?.data?.map((u: UserPayload) => (
                  <Notification
                    setIsAi={setAi}
                    key={u.email}
                    user={u}
                    handleStartChat={handleStartChat}
                  ></Notification>
                ))}
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
              setCalleeName={setCalleeName}
              setCalleeId={setCalleeId}
              setCallerId={setCallerId}
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
