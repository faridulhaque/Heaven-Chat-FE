"use client";

import ChatViewLg from "@/components/chat-lg/ChatViewLg";
import ChatViewSm from "@/components/chat-sm/ChatViewSm";
import { UserPayload } from "@/services/types";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function ChatViewCommon() {
  const socketRef = useRef<Socket | null>(null);
  const [onboardedUser, setOnboardedUser] = useState<UserPayload | null>(null);

  const [conversationId, setConversationId] = useState("");
  const [recipientId, setRecipientId] = useState("");

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
      setOnboardedUser(data?.user);
      setTimeout(() => {
        setOnboardedUser(null);
      }, 60000);
    });

    return () => {
      socketRef.current?.off("new-user");
      socketRef.current?.disconnect();
    };
  }, []);

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
