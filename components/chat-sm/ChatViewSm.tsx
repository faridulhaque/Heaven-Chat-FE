"use client";
import React, { useContext, useEffect, useState } from "react";
import ChatListItem from "../chat-others/ChatListItem";
import ChatBox from "../chat-lg/ChatBox";
import {
  Chat,
  LastMessageMap,
  LastMessageValue,
  UserPayload,
} from "@/services/types";
import Notification from "../chat-others/Notification";
import { Socket } from "socket.io-client";
import Loading from "../others/Loading";
import {
  useGetChatListQuery,
  useGetUsersQuery,
  useStartChatMutation,
} from "@/services/queries/othersApi";
import { Context } from "@/app/layout";
import Image from "next/image";
import BottomBar from "../chat-others/BottomBar";
import { handleSignOut } from "@/services/firebase.config";
import AIChatItem from "../chat-others/AIChatItem";
import ChatBoxAi from "../chat-lg/ChatBoxAi";
import DummyL from "../others/DummyL";

type ChatViewSmComponent = {
  onboardedUser: UserPayload | null;
  recipientId: string;
  setOnboardedUser: (u: UserPayload | null) => void;
  setRecipientId: (v: string) => void;
  conversationId: string;
  setConversationId: (c: string) => void;
  socketRef: React.RefObject<Socket | null>;
  setCallerId: (v: string) => void;
  setCalleeId: (v: string) => void;
  setCalleeName: (v: string) => void;
  setChatOpen: (v: boolean) => void;
  chatOpen: boolean;
  chatLoading: boolean;
  refetchChatList: () => void;
  chatList: Chat[];
  setSayHi: (v: string) => void;
  sayHi: string;
};

export default function ChatViewSm({
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
  chatOpen,
  setChatOpen,
  chatList,
  chatLoading,
  refetchChatList,
  sayHi,
  setSayHi,
}: ChatViewSmComponent) {
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${vh}px`);
    };

    updateHeight();

    window.visualViewport?.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("scroll", updateHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("scroll", updateHeight);
    };
  }, []);

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

  useEffect(() => {
    const filtered =
      chatList?.filter((c) =>
        c.counterParty.name.toLowerCase().includes(searchParam.toLowerCase())
      ) || [];

    setSearchedData(filtered);
  }, [searchParam]);

  const handleStartChat = async (recipientId: string) => {
    const res: any = await startChat({
      members: [recipientId, value.loggedInUser?.userId],
    });
    setRecipientId(recipientId);
    setConversationId(res?.data?.data?.conversationId);
    setOnboardedUser(null);
    setChatList(true);
  };

  return (
    <div className="block md:hidden text-white h-(--app-height)">
      {!chatOpen && (
        <div className="w-full  bg-[#1E1F24] flex flex-col overflow-hidden">
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

          <div className="flex-1 overflow-y-auto mt-2 min-h-0">
            {isChatList ? (
              <div>
                {!searchParam && (
                  <AIChatItem
                    setChatOpen={setChatOpen}
                    isAi={isAi}
                    setAi={setAi}
                    setConversationId={setConversationId}
                  />
                )}

                {(searchParam ? searchedData : chatList)?.map((c: Chat) => (
                  <ChatListItem
                    setChatOpen={setChatOpen}
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
                ))}
              </div>
            ) : (
              <div>
                {usersData &&
                  usersData?.data?.length &&
                  usersData?.data?.map((u: UserPayload) => (
                    <Notification
                      setChatOpen={setChatOpen}
                      setIsAi={setAi}
                      key={u.email}
                      user={u}
                      handleStartChat={handleStartChat}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="h-14 w-full fixed bottom-0 left-0 bg-[#2A2B32] border-t border-[#FF4F4F]/80 flex items-center justify-around px-6 z-30">
            <BottomBar
              handleSignOut={handleSignOut}
              setChatList={setChatList}
            />
          </div>
        </div>
      )}

      {chatOpen && (
        <div className="w-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto min-h-0">
            {isAi ? (
              <ChatBoxAi />
            ) : (
              <ChatBox
                refetchChatList={refetchChatList}
                sayHi={sayHi}
                setSayHi={setSayHi}
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
      )}
    </div>
  );
}
