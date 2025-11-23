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
};

export default function ChatBox({
  conversationId,
  socketRef,
  setAi,
  setLastMessages,
  lastMessages,
}: ChatBoxComponent) {
  const value = useContext(Context);
  const { loggedInUser } = value;
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isBlocker, setIsBlocker] = useState(false);

  const [callerId, setCallerId] = useState("");
  const [calleeId, setCalleeId] = useState("");

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

  console.log("loaded conversatin members", loadedConversation?.members);

  console.log("block check", blockCheck);

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
    useGetMessagesQuery<any>(conversationId);

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("is_online", loadedConversation?.counterParty?.userId);

    socket.on("is_online", (value) => {
      setIsOnline(value);
    });

    return () => {
      socket.off("is_online");
    };
  }, [socketRef.current, loadedConversation?.counterParty?.userId]);

  useEffect(() => {
    if (!messagesData || !messagesData.data) return;
    setMessages(messagesData.data);
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

  console.log("isblockedby me", isBlocker);

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
      <div className="flex flex-col w-full h-full bg-[#1E1F24]">
        <div className="flex items-center h-16 px-3 border-b border-[#2A2B31]">
          <Image
            className="rounded-full"
            src={
              loadedConversation.counterParty.avatar || "/assets/avatar-1.webp"
            }
            alt="avatar"
            width={36}
            height={36}
          />

          <h2 className="text-sm font-medium ml-3 text-white truncate flex-1">
            {loadedConversation.counterParty.name}
            {isOnline && (
              <span className="w-2 h-2 rounded-full bg-green-500 ml-3 inline-block" />
            )}
          </h2>

          <div className="flex gap-4 text-white">
            {!isBlocked ? (
              <>
                <button
                  onClick={() => {
                    setCallerId(loggedInUser?.userId as string);
                    setCalleeId(loadedConversation?.counterParty?.userId);
                  }}
                  className="mr-5 cursor-pointer"
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
                    console.log("res blocked", res);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <></>
            )}

            <button
              onClick={async () => {
                const res = await deleteChat(conversationId);
                console.log("delete res", res);
                setAi(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
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
          <div className="h-12">
            <h3 className="text-sm text-center text-md text-white/80">
              You can't send message to this conversation{" "}
              {isBlocker ? (
                <button
                  className="text-white/70 text-xs underline cursor-pointer"
                  disabled={blocking}
                  onClick={async () => {
                    const res = await block(
                      loadedConversation.counterParty.userId
                    );
                    console.log("res blocked", res);
                  }}
                >
                  Unblock Now
                </button>
              ) : (
                <></>
              )}
            </h3>
          </div>
        ) : (
          <div className="h-16 flex items-center px-3 bg-[#1E1F24] border-t border-[#2A2B31]">
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

      <CallModal
        calleeId={calleeId}
        callerId={callerId}
        socketRef={socketRef}
        setCalleeId={setCalleeId}
        setCallerId={setCallerId}
      ></CallModal>
    </>
  );
}
