"use client";
import Image from "next/image";
import React, { useState } from "react";

function ChatBoxAi() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    const userMessage = { role: "user", content: prompt };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setPrompt("");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ROUTER_AI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-nano-12b-v2-vl:free",
          messages: newMessages,
          reasoning: { enabled: true },
        }),
      });

      const data = await res.json();

      const reply = data?.choices?.[0]?.message?.content || "No response";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div
      className="mx-auto w-full flex flex-col bg-[#1D1E22] overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <div className="md:hidden sticky top-0 left-0 right-0 z-30 bg-[#1E1F24] h-9 flex items-center px-2">
        <button
          onClick={() => window.location.reload()}
          className="text-white text-xs px-3 py-1 bg-[#292933] rounded-full cursor-pointer"
        >
          Back
        </button>
      </div>
      <div className="flex items-center h-16 px-3 bg-[#1F2025] border-b-2 border-[#3A3B42] shadow-md shadow-black/20 text-white">
        <Image
          className="rounded-full"
          src="/assets/h-ai.webp"
          alt="avatar ai"
          width={36}
          height={36}
        />
        <h2 className="text-sm font-medium truncate ml-4">Heaven AI</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="w-full flex justify-end px-1">
              <div className="bg-[#8E2929] text-white px-4 py-2 rounded-lg rounded-br-none max-w-[75%] wrap-break-word">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="w-full flex items-start px-1">
              <Image
                className="rounded-full mr-3 shrink-0"
                src="/assets/h-ai.webp"
                alt="avatar ai"
                width={30}
                height={30}
              />
              <div className="bg-[#2A2B31] text-white px-4 py-2 rounded-lg rounded-bl-none max-w-[75%] wrap-break-word">
                {m.content}
              </div>
            </div>
          )
        )}

        {isLoading && (
          <div className="flex items-center justify-center mt-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce mr-1"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150 mr-1"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
          </div>
        )}
      </div>

      <div className="h-16 flex items-center px-3 bg-[#1F2025] border-t border-[#2C2D33]">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          className="flex-1 h-11 px-3 text-sm text-white bg-[#2A2B31] rounded-lg outline-none"
        />

        <svg
          aria-disabled={isLoading}
          onClick={() => handleSend()}
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
    </div>
  );
}

export default ChatBoxAi;
