import React from "react";
import ChatListItem from "./ChatListItem";

export default function ChatViewLg() {
  return (
    <div className="hidden md:block">
      <div className="w-full sm:w-[95%] mx-auto h-screen flex gap-10">
        {/* Sidebar */}
        <div className="w-3/12 bg-[#1E1F24] h-full relative overflow-y-auto">
          <div className="sticky top-0 left-0 right-0 bg-[#1E1F24] z-20 pt-5 pb-4 px-3">
            <input
              type="text"
              className="w-full text-white px-4 py-2 bg-[#292933] rounded-3xl outline-none border-none"
              placeholder="Search"
            />
          </div>

          <div className="mt-2">
            {[...Array(30)].map((_, i) => (
              <ChatListItem key={i} />
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-6/12 bg-[#131318] rounded-lg"></div>

        {/* Info / Details */}
        <div className="w-3/12 bg-[#1B1C21] rounded-lg"></div>
      </div>
    </div>
  );
}
