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
  const [userName, setUserName] = useState("");
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
      email: newUser?.email,
      name: userName,
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
        <div className="w-full h-full fixed top-0 left-0 bg-black/60 z-10 flex items-center justify-center px-4">
          <div
            ref={modalRef}
            className="w-full max-w-md bg-black border border-red-400/50 text-white rounded-lg pt-10 pb-16 px-6"
          >
            <h2 className="text-center text-3xl sm:text-4xl">
              Login to Continue
            </h2>

            <h2 className="text-center text-sm opacity-80 mt-4">
              Choose your identity and start your session
            </h2>

            <div className="flex justify-center mt-5">
              <input
                onChange={(e) => setUserName(e.target.value)}
                className="w-full sm:w-3/5 h-12 outline-none text-white px-3 bg-[#202020] opacity-80 rounded-md"
                placeholder="Nickname"
                type="text"
              />
            </div>

            <h2 className="text-center text-sm opacity-80 mt-5">
              Choose your avatar <span className="text-red-500">*</span>
            </h2>

            <div className="w-full sm:w-3/5 mx-auto flex flex-wrap gap-6 justify-center mt-5">
              {avatars.map((avt: string) => (
                <div
                  key={avt}
                  onClick={() => setAvatar(avt)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Image src={avt} alt="avatar" width={60} height={60} />
                  <span
                    className={`w-3 h-3 mt-3 rounded-full border border-white ${
                      avt === avatar ? "bg-white" : ""
                    }`}
                  ></span>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={handleOnboard}
                className="cursor-pointer bg-[#FF4F4F] rounded-4xl text-white py-2 px-10"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
