import ChatViewLg from "@/components/chat-lg/ChatViewLg";
import ChatViewSm from "@/components/chat-sm/ChatViewSm";
import React from "react";

function page() {
  return (
    <div>
      <ChatViewLg></ChatViewLg>
      <ChatViewSm></ChatViewSm>
    </div>
  );
}

export default page;
