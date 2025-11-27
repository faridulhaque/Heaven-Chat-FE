"use client";
import Image from "next/image";
import SentMessage from "../chat-others/SentMessage";
import ReceivedMessage from "../chat-others/ReceivedMessage";
import {
  Chat,
  LastMessageMap,
  LastMessageValue,
  TMessageDataFE,
} from "@/services/types";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/app/layout";
import {
  useBlockUserMutation,
  useCheckIfBlockedQuery,
  useDeleteChatMutation,
  useGetMessagesQuery,
  useGetOneChatQuery,
} from "@/services/queries/othersApi";
import Loading from "../others/Loading";
import { Socket } from "socket.io-client";
import CallModal from "../chat-others/CallModal";

type ChatBoxComponent = {
  conversationId: string;
  socketRef: React.RefObject<Socket | null>;
  setAi: (v: boolean) => void;
  setLastMessages: (value: LastMessageMap) => void;
  lastMessages: LastMessageMap;
  setCallerId: (v: string) => void;
  setCalleeId: (v: string) => void;
  setCalleeName: (v: string) => void;
};

export default function ChatBox({
  conversationId,
  socketRef,
  setAi,
  setLastMessages,
  lastMessages,
  setCalleeId,
  setCallerId,
  setCalleeName,
}: ChatBoxComponent) {
  const value = useContext(Context);
  const { loggedInUser } = value;
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isBlocker, setIsBlocker] = useState(false);

  const [messageBody, setMessageBody] = useState<TMessageDataFE>({
    to: "",
    from: "",
    type: "",
    message: "",
    conversationId: "",
    time: "",
  });

  const [messages, setMessages] = useState<TMessageDataFE[]>([]);

  const [block, { isLoading: blocking }] = useBlockUserMutation();
  const [deleteChat, { isLoading: deleting }] = useDeleteChatMutation();

  const { data, isLoading: conversationLoading } =
    useGetOneChatQuery<any>(conversationId);
  const loadedConversation: Chat = data?.data;

  const { data: blockCheck, isLoading: checkingBlock } =
    useCheckIfBlockedQuery<any>(loadedConversation?.members, {
      skip:
        !loadedConversation?.members || loadedConversation?.members?.length < 2,
    });

  const isBlocked: boolean = blockCheck?.data as boolean;

  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;

    const onPrivateMessage = (data: TMessageDataFE) => {
      setMessages((prev) => [...prev, data]);
      setLastMessages(
        new Map<string, LastMessageValue>(lastMessages).set(conversationId, {
          message: data.message,
          time: data.time,
        })
      );
    };
    s.on("private-message", onPrivateMessage);

    return () => {
      s.off("private-message", onPrivateMessage);
    };
  }, []);

  const { data: messagesData, isLoading: messagesLoading } =
    useGetMessagesQuery<any>(conversationId, { skip: !conversationId });

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("is_online", loadedConversation?.counterParty?.userId);
    if (loggedInUser?.userId) socket.emit("join", loggedInUser?.userId);

    socket.on("is_online", (value) => {
      setIsOnline(value);
    });

    return () => {
      socket.off("is_online");
    };
  }, [socketRef.current, loadedConversation?.counterParty?.userId]);

  useEffect(() => {
    if (!messagesData || !messagesData.data) return;
    setMessages(messagesData?.data);
  }, [messagesData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, conversationId]);

  useEffect(() => {
    const found = loggedInUser?.blocked?.find(
      (b: string) => b === loadedConversation?.counterParty?.userId
    );
    if (found) setIsBlocker(true);
  }, [loggedInUser?.blocked, loadedConversation?.counterParty?.userId]);

  const sendMessage = () => {
    if (!loadedConversation?.counterParty) return;
    if (!messageBody.message.trim()) return;

    const msg: TMessageDataFE = {
      message: messageBody.message,
      from: loggedInUser?.userId || "",
      to: loadedConversation.counterParty.userId,
      type: "text",
      conversationId,
      time: new Date().toISOString(),
    };
    setLastMessages(
      new Map<string, LastMessageValue>(lastMessages).set(conversationId, {
        message: msg.message,
        time: new Date().toISOString(),
      })
    );

    socketRef.current?.emit("private-message", { to: msg.to, message: msg });

    setMessages((prev) => [...prev, msg]);

    setMessageBody({
      to: "",
      from: "",
      type: "",
      message: "",
      conversationId: "",
      time: "",
    });
  };

  useEffect(() => {
    setMessageBody({
      message: "",
      from: "",
      to: "",
      type: "",
      conversationId: "",
      time: "",
    });
  }, [conversationId, messagesData]);

  if (conversationLoading || messagesLoading || checkingBlock)
    return <Loading />;

  return (
    <>
      <div className="flex flex-col w-full h-full bg-[#1D1E22]">
        <div className="flex items-center h-16 px-3 bg-[#1F2025] border-b-2 border-[#3A3B42] shadow-md shadow-black/20">
          <Image
            className="rounded-full"
            src={
              loadedConversation?.counterParty?.avatar ||
              "/assets/avatar-1.webp"
            }
            alt="avatar"
            width={36}
            height={36}
          />

          <h2 className="text-sm font-medium ml-3 text-white truncate flex-1">
            {loadedConversation?.counterParty?.name}
            {isOnline && (
              <span className="w-2 h-2 rounded-full bg-green-500 ml-3 inline-block" />
            )}
          </h2>

          <div className="flex gap-4 text-white">
            {!isBlocked && (
              <>
                <button
                  onClick={() => {
                    setCallerId(loggedInUser?.userId as string);
                    setCalleeId(loadedConversation?.counterParty?.userId);
                    setCalleeName(loadedConversation?.counterParty?.name);
                  }}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                </button>

                <button
                  disabled={blocking}
                  onClick={async () => {
                    const res = await block(
                      loadedConversation.counterParty.userId
                    );
                  }}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {messages.map((m: TMessageDataFE, i: number) =>
            m.from === loggedInUser?.userId ? (
              <SentMessage key={i} message={m} />
            ) : (
              <ReceivedMessage key={i} message={m} />
            )
          )}
          <div ref={bottomRef} />
        </div>

        {isBlocked ? (
          <div className="h-12 flex items-center justify-center px-4">
            <h3 className="text-sm text-center text-white/80">
              You can't send message to this conversation{" "}
              {isBlocker ? (
                <button
                  className="text-white/70 text-xs underline ml-2 cursor-pointer"
                  disabled={blocking}
                  onClick={async () => {
                    const res = await block(
                      loadedConversation.counterParty.userId
                    );
                  }}
                >
                  Unblock Now
                </button>
              ) : null}
            </h3>
          </div>
        ) : (
          <div className="h-16 flex items-center px-3 bg-[#1F2025] border-t border-[#2C2D33]">
            <input
              onChange={(e) =>
                setMessageBody({
                  message: e.target.value,
                  from: loggedInUser?.userId as string,
                  to: loadedConversation.counterParty.userId,
                  type: "text",
                  conversationId,
                  time: "",
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              value={messageBody.message}
              type="text"
              placeholder="Type a message..."
              className="flex-1 h-11 px-3 text-sm text-white bg-[#2A2B31] rounded-lg outline-none"
            />
            <svg
              onClick={sendMessage}
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="w-8 h-8 ml-3 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
