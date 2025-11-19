"use client";
import ChatViewLg from "@/components/chat-lg/ChatViewLg";
import ChatViewSm from "@/components/chat-sm/ChatViewSm";
import RequireUser from "@/components/others/RequireUser";
import { UserPayload } from "@/services/types";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

function Page() {
  const socketRef = useRef<Socket | null>(null);
  const [onboardedUser, setOnboardedUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found in localStorage");
      return;
    }

    socketRef.current = io(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, {
      transports: ["websocket"],
      auth: {
        token: token,
      },
    });

    socketRef.current.on("new-user", (data: any) => {
      setOnboardedUser(data);
    });

    return () => {
      socketRef.current?.off("new-user");
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <RequireUser>
      <div>
        <ChatViewLg onboardedUser={onboardedUser} />
        <ChatViewSm onboardedUser={onboardedUser} />
      </div>
    </RequireUser>
  );
}

export default Page;
