"use client";
import About from "@/components/home/About";
import ExtraFeatures from "@/components/home/ExtraFeatures";
import Feature from "@/components/home/Feature";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import OnboardingModal from "@/components/home/OnboardingModal";
import { signInWithGoogle } from "@/services/firebase.config";
import { useLoginMutation } from "@/services/queries/authApi";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [newUser, setNewUser] = useState<{
    email: string;
    name: string;
  } | null>(null);
  const [login, { isLoading: onboarding }] = useLoginMutation();

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    const email = result?.user?.email;
    const name = result?.user?.displayName;

    if (!email || !name) {
      return toast.error("This didn't work.");
    }

    const res: any = await login({
      email,
    });
    if (res?.data?.token) {
      toast.success("You have successfully logged in");
      localStorage.setItem("token", res.data.token);
    } else {
      setNewUser({
        email,
        name,
      });
    }
  };
  return (
    <div className="mx-auto" style={{ width: "95%" }}>
      <Hero handleGoogleSignIn={handleGoogleSignIn}></Hero>
      <Feature></Feature>
      <ExtraFeatures></ExtraFeatures>
      <About></About>
      <Footer></Footer>
      {newUser && <OnboardingModal newUser={newUser}></OnboardingModal>}
    </div>
  );
}
