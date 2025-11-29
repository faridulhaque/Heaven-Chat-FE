"use client";

import { Context } from "@/app/layout";
import ChatViewLg from "@/components/chat-lg/ChatViewLg";
import ChatViewSm from "@/components/chat-sm/ChatViewSm";
import {
  useCheckIfBlockedQuery,
  useGetChatListQuery,
} from "@/services/queries/othersApi";
import { CallStateType, Chat, UserPayload } from "@/services/types";
import React, { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Loading from "./Loading";
import CallModal from "../chat-others/CallModal";
import Peer from "simple-peer";
import toast from "react-hot-toast";

export default function ChatViewCommon() {
  const socketRef = useRef<Socket | null>(null);
  const { loggedInUser } = useContext(Context);

  const [chatOpen, setChatOpen] = useState(false);

  const [sayHi, setSayHi] = useState("");

  const [onboardedUser, setOnboardedUser] = useState<UserPayload | null>(null);
  const value = useContext(Context);
  const [incomingSignal, setIncomingSignal] = useState<any>(null);
  const [callState, setCallState] = useState<CallStateType>("idle");
  const ringToneRef = useRef<HTMLAudioElement | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const dialToneRef = useRef<HTMLAudioElement | null>(null);

  const [callerId, setCallerId] = useState("");
  const [calleeId, setCalleeId] = useState("");
  const [calleeName, setCalleeName] = useState("");

  const [conversationId, setConversationId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const { data: blockCheck, isLoading: checkingBlock } =
    useCheckIfBlockedQuery<any>(
      [onboardedUser?.userId, value?.loggedInUser?.userId],
      { skip: !onboardedUser?.userId || !value?.loggedInUser?.userId }
    );

  const {
    data: chatData,
    isLoading: chatLoading,
    refetch: refetchChatList,
  } = useGetChatListQuery<any>("");
  const chatList: Chat[] = chatData?.data;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found in localStorage");
      return;
    }
    socketRef.current = io(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: {
        token: token,
      },
    });

    if (socketRef.current && socketRef.current.connected) {
      return;
    }

    if (value.loggedInUser?.userId)
      socketRef.current.emit("join", value.loggedInUser?.userId);

    socketRef.current.on("new-user", (data: any) => {
      if (blockCheck?.data === false) {
        setOnboardedUser(data?.user);
        setTimeout(() => {
          setOnboardedUser(null);
        }, 60000);
      }
    });

    const onNewChat = () => {
      console.log("new chat arrived");
      refetchChatList();
    };
    socketRef.current.on("new-chat", onNewChat);

    return () => {
      socketRef.current?.off("new-user");
      socketRef.current?.off("new-chat", onNewChat);

      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onSignal = ({ from, data, callerName }: any) => {
      if (data?.type === "offer") {
        setIncomingSignal({ from, data, callerName });
        setCallState("receiving");
        try {
          if (ringToneRef.current) {
            // console.log("ringing");
            ringToneRef.current.muted = false;
            ringToneRef.current.play().catch(() => {});
          }
        } catch {}
      } else if (peerRef.current) {
        peerRef.current.signal(data);
      }
    };

    const onEndCall = () => {
      cleanupCall();
      resetModal();
    };

    socket.on("signal", onSignal);
    socket.on("end_call", onEndCall);
    socket.on("busy", () => {
      toast.error("User is busy");
      setCallerId("");
      setCalleeId("");
    });

    return () => {
      socket.off("signal", onSignal);
      socket.off("end_call", onEndCall);
      socket.off("busy");
    };
  }, [socketRef?.current, loggedInUser?.userId]);

  const resetModal = () => {
    setCallState("idle");
    setIncomingSignal(null);
    peerRef.current = null;
    localStreamRef.current = null;
    remoteAudioRef.current = null;
    setCallerId("");
    setCalleeId("");
  };

  const cleanupCall = () => {
    try {
      dialToneRef.current?.pause();
    } catch {}
    try {
      ringToneRef.current?.pause();
    } catch {}

    try {
      peerRef.current?.removeAllListeners?.();
      peerRef.current?.destroy();
    } catch {}

    if (localStreamRef.current) {
      try {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch {}
      localStreamRef.current = null;
    }

    if (remoteAudioRef.current) {
      try {
        remoteAudioRef.current.pause();
        if (remoteAudioRef.current.srcObject)
          remoteAudioRef.current.srcObject = null;
        if (remoteAudioRef.current.parentElement === document.body)
          remoteAudioRef.current.remove();
      } catch {}
      remoteAudioRef.current = null;
    }

    setIncomingSignal(null);
    peerRef.current = null;
  };

  if (blockCheck) return <Loading></Loading>;

  return (
    <div>
      <ChatViewLg
        sayHi={sayHi}
        setSayHi={setSayHi}
        chatList={chatList}
        chatLoading={chatLoading}
        refetchChatList={refetchChatList}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        setCalleeName={setCalleeName}
        setCalleeId={setCalleeId}
        setCallerId={setCallerId}
        recipientId={recipientId}
        setRecipientId={setRecipientId}
        onboardedUser={onboardedUser}
        conversationId={conversationId}
        setConversationId={setConversationId}
        setOnboardedUser={setOnboardedUser}
        socketRef={socketRef}
      />
      <ChatViewSm
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        setCalleeName={setCalleeName}
        setCalleeId={setCalleeId}
        setCallerId={setCallerId}
        recipientId={recipientId}
        setRecipientId={setRecipientId}
        onboardedUser={onboardedUser}
        conversationId={conversationId}
        setConversationId={setConversationId}
        setOnboardedUser={setOnboardedUser}
        socketRef={socketRef}
      />

      <CallModal
        remoteAudioRef={remoteAudioRef}
        dialToneRef={dialToneRef}
        localStreamRef={localStreamRef}
        resetModal={resetModal}
        cleanupCall={cleanupCall}
        ringToneRef={ringToneRef}
        peerRef={peerRef}
        incomingSignal={incomingSignal}
        setIncomingSignal={setIncomingSignal}
        callState={callState}
        setCallState={setCallState}
        calleeName={calleeName}
        calleeId={calleeId}
        callerId={callerId}
        socketRef={socketRef}
        setCalleeId={setCalleeId}
        setCallerId={setCallerId}
      ></CallModal>
    </div>
  );
}
