"use client";

import { Context } from "@/app/layout";
import ChatViewLg from "@/components/chat-lg/ChatViewLg";
import ChatViewSm from "@/components/chat-sm/ChatViewSm";
import { useCheckIfBlockedQuery } from "@/services/queries/othersApi";
import { UserPayload } from "@/services/types";
import React, { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Loading from "./Loading";

export default function ChatViewCommon() {
  const socketRef = useRef<Socket | null>(null);
  const [onboardedUser, setOnboardedUser] = useState<UserPayload | null>(null);
  const value = useContext(Context);

  const [conversationId, setConversationId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const { data: blockCheck, isLoading: checkingBlock } =
    useCheckIfBlockedQuery<any>(
      [onboardedUser?.userId, value?.loggedInUser?.userId],
      { skip: !onboardedUser?.userId || !value?.loggedInUser?.userId }
    );

  useEffect(() => {
    console.log("SOCKET INIT");
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found in localStorage");
      return;
    }

    if (socketRef.current && socketRef.current.connected) {
      console.log("Socket already connected:", socketRef.current.id);
      return;
    }

    socketRef.current = io(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: {
        token: token,
      },
    });

    socketRef.current.on("new-user", (data: any) => {
      if (blockCheck?.data === false) {
        setOnboardedUser(data?.user);
        setTimeout(() => {
          setOnboardedUser(null);
        }, 60000);
      }
    });

    return () => {
      socketRef.current?.off("new-user");
      socketRef.current?.disconnect();
    };
  }, []);

  if (blockCheck) return <Loading></Loading>;

  return (
    <div>
      <ChatViewLg
        recipientId={recipientId}
        setRecipientId={setRecipientId}
        onboardedUser={onboardedUser}
        conversationId={conversationId}
        setConversationId={setConversationId}
        setOnboardedUser={setOnboardedUser}
        socketRef={socketRef}
      />
      <ChatViewSm onboardedUser={onboardedUser} />
    </div>
  );
}
