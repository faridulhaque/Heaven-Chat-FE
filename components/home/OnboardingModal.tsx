"use client";
import { useRegisterMutation } from "@/services/queries/authApi";
import { registerPayload } from "@/services/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type OnboardingModalType = {
  newUser: { name: string; email: string } | null;
  setNewUser: (value: { name: string; email: string } | null) => void;
};

export default function OnboardingModal({
  newUser,
  setNewUser,
}: OnboardingModalType) {
  const router = useRouter();
  const [avatar, setAvatar] = useState("");
  const [register, { isLoading: registering }] = useRegisterMutation();

  const modalRef: any = useRef("");

  const handleClickOutsideModal = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setNewUser(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideModal, true);

    return () => {
      document.addEventListener("click", handleClickOutsideModal, true);
    };
  }, [modalRef]);

  useEffect(() => {
    if (!newUser) {
      // setModalInfo(null)
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.overflowY = "hidden";
    }
  }, [newUser]);

  const handleOnboard = async () => {
    const payload = {
      ...newUser,
      avatar,
    };

    for (const key in payload) {
      if (!payload[key as keyof typeof payload]) {
        return toast.error(`${key} is required`);
      }
    }
    const res: any = await register(payload);
    const token = res.data?.data?.token;
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Successfully Onboarded");
      setNewUser(null);
      router.push("/chat");
    } else {
      toast.error("Failed to register new user");
      router.push("/");
    }
  };

  const avatars = [
    "https://res.cloudinary.com/dwucmawcq/image/upload/v1763476278/avatar-3_zkdjv9.webp",
    "https://res.cloudinary.com/dwucmawcq/image/upload/v1763476278/avatar-2_etzvd6.webp",
    "https://res.cloudinary.com/dwucmawcq/image/upload/v1763476278/avatar-1_zozy3t.webp",
  ];

  return (
    <>
      {newUser && (
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
                  defaultValue={newUser?.name}
                />
              </div>
              <h2 className="text-white text-center text-sm opacity-80 mt-5">
                Choose your avatar
              </h2>
              <div className="w-2/5 h-20 mx-auto flex items-center justify-around mt-5">
                {avatars.map((avt: string) => (
                  <div
                    onClick={() => setAvatar(avt)}
                    key={avt}
                    className="flex items-center flex-col cursor-pointer"
                  >
                    <Image src={avt} alt="google" width={60} height={60} />

                    <span
                      className={`w-3 h-3 mt-3 rounded-full border-white border ${
                        avt === avatar ? "bg-white" : ""
                      }`}
                    ></span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center mt-10">
                <button
                  onClick={handleOnboard}
                  className="cursor-pointer bg-[#FF4F4F] rounded-4xl text-white py-2 px-10"
                >
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
