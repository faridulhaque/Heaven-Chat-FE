import Image from "next/image";
import React from "react";

function DummyL() {
  return (
    <div className="w-full flex items-start my-4">
      <div className="mr-3 shrink-0">
        <Image
          className="rounded-full"
          src="/assets/avatar-1.webp"
          alt="avatar"
          width={36}
          height={36}
        />
      </div>

      <div className="bg-[#2A2A2E] text-white px-4 py-2 rounded-lg rounded-bl-none max-w-[75%] inline-block wrap-break-word">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
        quibusdam, magnam dicta aliquam assumenda facere rem earum sequi
        doloremque dolorum vel. Cupiditate, voluptates.
      </div>
    </div>
  );
}

export default DummyL;
