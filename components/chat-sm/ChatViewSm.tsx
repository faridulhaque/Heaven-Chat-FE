"use client";
import React, { useState } from "react";
import ChatListItem from "../chat-others/ChatListItem";
import ChatBox from "../chat-lg/ChatBox";

export default function ChatViewSm() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="block md:hidden text-white h-screen">
      {!chatOpen && (
        <div className="w-full h-full bg-[#1E1F24] overflow-y-auto">
          <div className="sticky top-0 left-0 right-0 bg-[#1E1F24] z-20 pt-5 pb-4 px-3 flex items-center gap-3">
            <input
              type="text"
              className="w-full text-white px-4 py-2 bg-[#292933] rounded-3xl outline-none border-none"
              placeholder="Search"
            />
            <div className="flex items-center gap-3">
              <button className="text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="size-6 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </button>
              <button className="text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="size-6 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-2">
            {[...Array(30)].map((_, i) => (
              <div key={i} onClick={() => setChatOpen(true)}>
                <ChatListItem />
              </div>
            ))}
          </div>
        </div>
      )}

      {chatOpen && (
        <div className="w-full h-full bg-[#1E1F24] overflow-y-auto">
          <div className="h-1/12 sticky top-0 left-0 right-0 bg-[#1E1F24] z-20 pt-5 pb-4 px-3 flex items-center justify-between">
            <button
              className="px-4 py-2 bg-[#292933] rounded-3xl"
              onClick={() => setChatOpen(false)}
            >
              Back
            </button>

            <div className="flex items-center gap-3">
              <button className="text-xl">🏠</button>
              <button className="text-xl">🚪</button>
            </div>
          </div>

          <div className="h-11/12">
            <ChatBox />
          </div>
        </div>
      )}
    </div>
  );
}
