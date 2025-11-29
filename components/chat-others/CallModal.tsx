"use client";
import { Context } from "@/app/layout";
import { CallStateType } from "@/services/types";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Peer from "simple-peer";
import { Socket } from "socket.io-client";

type CallModalProps = {
  callerId: string;
  calleeName: string;
  calleeId: string;
  socketRef: React.RefObject<Socket | null>;
  setCallerId: (v: string) => void;
  setCalleeId: (v: string) => void;
  incomingSignal: any;
  setIncomingSignal: (v: any) => void;
  callState: CallStateType;
  setCallState: (v: CallStateType) => void;
  ringToneRef: React.RefObject<HTMLAudioElement | null>;
  peerRef: React.RefObject<Peer.Instance | null>;
  localStreamRef: React.RefObject<MediaStream | null>;
  remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
  dialToneRef: React.RefObject<HTMLAudioElement | null>;
  resetModal: () => void;
  cleanupCall: () => void;
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
  calleeName,
  incomingSignal,
  setIncomingSignal,
  callState,
  setCallState,
  peerRef,
  ringToneRef,
  cleanupCall,
  resetModal,
  localStreamRef,
  remoteAudioRef,
  dialToneRef,
}: CallModalProps) {
  const { loggedInUser } = useContext(Context);

  // useEffect(() => {
  //   const socket = socketRef.current;
  //   if (!socket) return;
  //   if (loggedInUser?.userId) socket.emit("join", loggedInUser?.userId);
  // }, [loggedInUser]);

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
      if (dialToneRef.current && dialToneRef.current.paused) {
        dialToneRef.current.play();
      }
    } catch {}

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      const peer = createPeer({ initiator: true, stream });
      peerRef.current = peer;

      peer.on("signal", (data: any) => {
        socket.emit("signal", {
          from: callerId,
          to: calleeId,
          data,
          callerName: loggedInUser?.name,
        });
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

  const endCall = () => {
    const socket = socketRef.current;
    if (!socket) return;

    if (calleeId) {
      socket.emit("end_call", { from: callerId, to: calleeId });
    }

    if (incomingSignal?.from) {
      socket.emit("end_call", { from: callerId, to: incomingSignal.from });
    }

    cleanupCall();

    resetModal();
  };


  return (
    <>
      <audio ref={ringToneRef} src="/sounds/ringtone.mp3" preload="auto" loop />
      <audio ref={dialToneRef} src="/sounds/dialtone.mp3" preload="auto" loop />

      {callerId && !incomingSignal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black text-white border border-red-400/20 rounded-lg p-8 w-[380px]">
            {callState === "idle" && (
              <div className="text-center space-y-4">
                <p>Ready to call {calleeName}?</p>
                <button
                  className="bg-green-600 py-2 w-full rounded cursor-pointer"
                  onClick={startCall}
                >
                  Call
                </button>
                <button
                  className="bg-red-600 py-2 w-full rounded cursor-pointer"
                  onClick={() => {
                    resetModal();
                    setCallerId("");
                    setCalleeId("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {callState === "calling" && (
              <div className="text-center space-y-4">
                <p>Calling {calleeName}...</p>
                <button
                  className="bg-red-600 py-2 w-full rounded cursor-pointer"
                  onClick={endCall}
                >
                  End Call
                </button>
              </div>
            )}

            {callState === "inCall" && (
              <div className="text-center space-y-4">
                <p>In call with {calleeName}</p>
                <button
                  className="bg-red-600 py-2 w-full rounded cursor-pointer"
                  onClick={endCall}
                >
                  Hang Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {incomingSignal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black text-white border border-red-400/20 rounded-lg p-8 w-[380px]">
            {callState === "receiving" && (
              <div className="text-center space-y-4">
                <p>{incomingSignal?.callerName} is calling you</p>
                <button
                  className="bg-green-600 py-2 w-full rounded cursor-pointer"
                  onClick={answerCall}
                >
                  Accept
                </button>
                <button
                  className="bg-red-600 py-2 w-full rounded cursor-pointer"
                  onClick={endCall}
                >
                  Decline
                </button>
              </div>
            )}

            {callState === "inCall" && (
              <div className="text-center space-y-4">
                <p>In call…</p>
                <button
                  className="bg-red-600 py-2 w-full rounded cursor-pointer"
                  onClick={endCall}
                >
                  Hang Up
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
