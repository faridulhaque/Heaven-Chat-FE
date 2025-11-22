"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Peer from "simple-peer";
import { Socket } from "socket.io-client";

type CallModalProps = {
  callerId: string;
  calleeId: string;
  socketRef: React.RefObject<Socket | null>;
  setCallerId: (v: string) => void;
  setCalleeId: (v: string) => void;
};

const ICE_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun.stunprotocol.org:3478" },
  ],
};

function CallModal({
  callerId,
  calleeId,
  socketRef,
  setCallerId,
  setCalleeId,
}: CallModalProps) {
  const [callState, setCallState] = useState<
    "idle" | "calling" | "receiving" | "inCall" | "ended"
  >("idle");
  const [incomingSignal, setIncomingSignal] = useState<any>(null);

  const peerRef = useRef<Peer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const dialToneRef = useRef<HTMLAudioElement | null>(null);
  const ringToneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onSignal = ({ from, data }: any) => {
      if (data?.type === "offer") {
        setIncomingSignal({ from, data });
        setCallState("receiving");
        try {
          ringToneRef.current?.play();
        } catch {}
      } else if (peerRef.current) {
        peerRef.current.signal(data);
      }
    };

    const onEndCall = () => {
      cleanupCall();
      setCallState("ended");
      setCallerId("");
      setCalleeId("");
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
  }, [socketRef.current]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    if (callerId) socket.emit("join", callerId);
  }, [callerId]);

  const createPeer = (opts: { initiator: boolean; stream: MediaStream }) => {
    const peer = new Peer({
      initiator: opts.initiator,
      trickle: false,
      stream: opts.stream,
      config: ICE_CONFIG,
    });

    peer.on("error", () => {
      cleanupCall();
      setCallState("ended");
      setCallerId("");
      setCalleeId("");
    });

    peer.on("close", () => {
      cleanupCall();
      setCallState("ended");
      setCallerId("");
      setCalleeId("");
    });

    return peer;
  };

  const startCall = async () => {
    const socket = socketRef.current;
    if (!socket) return;
    if (!calleeId) return;

    setCallState("calling");
    try {
      dialToneRef.current?.play();
    } catch {}

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      const peer = createPeer({ initiator: true, stream });
      peerRef.current = peer;

      peer.on("signal", (data: any) => {
        socket.emit("signal", { from: callerId, to: calleeId, data });
      });

      peer.on("stream", (remoteStream: MediaStream) => {
        dialToneRef.current?.pause();
        attachRemoteStream(remoteStream);
        setCallState("inCall");
      });
    } catch {
      setCallState("idle");
      dialToneRef.current?.pause();
    }
  };

  const answerCall = async () => {
    const socket = socketRef.current;
    if (!socket) return;
    if (!incomingSignal) return;

    ringToneRef.current?.pause();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      const peer = createPeer({ initiator: false, stream });
      peerRef.current = peer;

      peer.on("signal", (data: any) => {
        socket.emit("signal", {
          from: callerId,
          to: incomingSignal.from,
          data,
        });
      });

      peer.signal(incomingSignal.data);

      peer.on("stream", (remoteStream: MediaStream) => {
        attachRemoteStream(remoteStream);
        setCallState("inCall");
      });
    } catch {
      setCallState("idle");
    }
  };

  const attachRemoteStream = (remoteStream: MediaStream) => {
    if (!remoteAudioRef.current) {
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioEl.srcObject = remoteStream;
      remoteAudioRef.current = audioEl;
      document.body.appendChild(audioEl);
    } else {
      remoteAudioRef.current.srcObject = remoteStream;
      try {
        remoteAudioRef.current.play();
      } catch {}
    }
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

  const endCall = () => {
    const socket = socketRef.current;
    if (!socket) return;

    if (calleeId) socket.emit("end_call", { from: callerId, to: calleeId });
    if (incomingSignal?.from)
      socket.emit("end_call", { from: callerId, to: incomingSignal.from });

    cleanupCall();
    setCallState("ended");
    setCallerId("");
    setCalleeId("");
  };

  if (!callerId) return null;

  return (
    <>
      {callerId && (
        <div className="w-full h-screen fixed z-20 top-0 left-0 bg-black/60 flex items-center justify-center">
          <div className="bg-black text-white border border-red-400/20 rounded-lg p-8 w-[380px]">
            <audio
              ref={dialToneRef}
              src="/sounds/dialtone.mp3"
              preload="auto"
              loop
            />
            <audio
              ref={ringToneRef}
              src="/sounds/ringtone.mp3"
              preload="auto"
              loop
            />

            {callState === "idle" && !calleeId && (
              <div className="text-center space-y-4">
                <p>Callee is offline</p>
                <button
                  className="w-full py-2 rounded text-white"
                  style={{ backgroundColor: "#FF5F5F" }}
                  onClick={() => setCallerId("")}
                >
                  Close
                </button>
              </div>
            )}

            {callState === "idle" && calleeId && (
              <div className="text-center space-y-4">
                <p>Ready to call {calleeId}</p>
                <button
                  className="bg-green-600 py-2 w-full rounded"
                  onClick={startCall}
                >
                  Call
                </button>
                <button
                  className="bg-red-600 py-2 w-full rounded"
                  onClick={() => setCallerId("")}
                >
                  Cancel
                </button>
              </div>
            )}

            {callState === "calling" && (
              <div className="text-center space-y-4">
                <p>Calling {calleeId}...</p>
                <button
                  className="bg-red-600 py-2 w-full rounded"
                  onClick={endCall}
                >
                  End Call
                </button>
              </div>
            )}

            {callState === "receiving" && incomingSignal && (
              <div className="text-center space-y-4">
                <p>{incomingSignal.from} is calling you</p>
                <button
                  className="bg-green-600 py-2 w-full rounded"
                  onClick={answerCall}
                >
                  Accept
                </button>
                <button
                  className="bg-red-600 py-2 w-full rounded"
                  onClick={endCall}
                >
                  Decline
                </button>
              </div>
            )}

            {callState === "inCall" && (
              <div className="text-center space-y-4">
                <p>In Call</p>
                <button
                  className="bg-red-600 py-2 w-full rounded"
                  onClick={endCall}
                >
                  End Call
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CallModal;
