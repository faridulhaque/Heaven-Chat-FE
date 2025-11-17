import Image from "next/image";
import SentMessage from "../chat-others/SentMessage";
import ReceivedMessage from "../chat-others/ReceivedMessage";

export default function () {
  return (
    <div className="mx-auto w-full h-full flex flex-col gap-10 justify-around items-center">
      <div
        className="text-white w-full h-1/12
      bg-[#1E1F24]
      "
      >
        <div className="w-full h-16 flex items-center px-3 relative ">
          <Image
            className="rounded-full"
            src="/assets/avatar-1.webp"
            alt="avatar"
            width={36}
            height={36}
          />
          <h2 className="text-sm font-medium truncate ml-4">Matt White</h2>

          <div className="absolute top-1 bottom-0 right-0 h-full w-2/12 flex justify-around items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full h-10/12 border border-[#EBF0F4]/30 rounded-lg -mt-10 relative overflow-y-scroll">
        {[...Array(20)].map((_, i) =>
          i % 2 === 0 ? <SentMessage key={i} /> : <ReceivedMessage key={i} />
        )}

        <div className=" sticky w-full left-0 right-0 bg-black h-16 rounded-b-lg -bottom-1 flex items-center justify-center">
          <input
            type="text"
            className="h-11/12 px-3 py-3 outline-0 border-0 text-white text-sm w-full bg-[#1E1F24] rounded-b-lg"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="cursor-pointer size-8 absolute top-0 bottom-0 my-auto right-5"
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
