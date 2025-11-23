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
    <div className="mx-auto w-full h-full flex flex-col gap-10 justify-around items-center">
      <div className="text-white w-full h-1/12 bg-[#1E1F24]">
        <div className="w-full h-16 flex items-center px-3 relative">
          <Image
            className="rounded-full"
            src="/assets/h-ai.webp"
            alt="avatar ai"
            width={36}
            height={36}
          />
          <h2 className="text-sm font-medium truncate ml-4">Heaven AI</h2>

          <div className="absolute top-1 bottom-0 right-0 h-full w-2/12 flex justify-around items-center"></div>
        </div>
      </div>

      <div className="w-full h-10/12 border border-[#EBF0F4]/30 rounded-lg -mt-10 relative flex flex-col">
        <div className="flex-1 overflow-y-scroll p-2 space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg w-fit ${
                m.role === "user"
                  ? "bg-[#922626] ml-auto text-right text-white"
                  : "bg-[#2b2b2f] mr-auto text-left text-white"
              }`}
            >
              {m.content}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center justify-center mt-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce mr-1"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150 mr-1"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
            </div>
          )}
        </div>

        <div className="w-full bg-black h-12 rounded-b-lg flex items-center px-3 gap-3">
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
            className="flex-1 h-11/12 px-3 py-3 outline-0 border-0 text-white text-sm bg-[#1E1F24] rounded-lg"
          />
          <svg
            aria-disabled={isLoading}
            onClick={() => handleSend()}
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="cursor-pointer size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ChatBoxAi;
