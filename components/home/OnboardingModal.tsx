"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function OnboardingModal() {
  const [isOpen, setOpen] = useState(false);
  const modalRef: any = useRef("");

  const handleClickOutsideModal = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideModal, true);

    return () => {
      document.addEventListener("click", handleClickOutsideModal, true);
    };
  }, [modalRef]);

  useEffect(() => {
    if (!isOpen) {
      // setModalInfo(null)
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.overflowY = "hidden";
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="w-full min-h-screen bg-black/60 fixed z-10 top-0 left-0
"
        >
          <div
            ref={modalRef}
            className={` text-white   bg-black rounded-lg absolute z-11 top-0 bottom-0 right-0 left-0 m-auto w-2/4 h-fit pt-10 pb-20 border border-red-400/50`}
          >
            <div className="w-full h-full">
              <h2 className="text-white text-center text-4xl">
                Login to Continue
              </h2>
              <h2 className="text-white text-center text-sm opacity-80 mt-5">
                Choose your identity and start your session
              </h2>
              <div className="w-full h-auto flex items-center justify-center">
                <input
                  className="w-3/5 h-12 outline-0 border-0 text-white py-3 px-2 opacity-80 bg-[#202020] mx-auto mt-5"
                  placeholder="Name"
                  type="text"
                />
              </div>
              <h2 className="text-white text-center text-sm opacity-80 mt-5">
                Choose your avatar
              </h2>
              <div className="w-2/5 h-20 mx-auto flex items-center justify-around mt-5">
                <div className="flex items-center flex-col">
                  <Image
                    src="/assets/avatar-1.webp"
                    alt="google"
                    width={60}
                    height={60}
                  />

                  <span className="w-3 h-3 mt-3 rounded-full border-white border"></span>
                </div>
                <div className="flex items-center flex-col">
                  <Image
                    src="/assets/avatar-2.webp"
                    alt="google"
                    width={60}
                    height={60}
                  />
                  <span className="w-3 h-3 mt-3 rounded-full border-white border"></span>
                </div>
                <div className="flex items-center flex-col">
                  <Image
                    src="/assets/avatar-3.webp"
                    alt="google"
                    width={60}
                    height={60}
                  />
                  <span className="w-3 h-3 mt-3 rounded-full border-white border"></span>
                </div>
              </div>

              <div className="flex items-center justify-center mt-10">
                <button className="cursor-pointer bg-[#FF4F4F] rounded-4xl text-white py-2 px-10">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
