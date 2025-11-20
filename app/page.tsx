"use client";
import About from "@/components/home/About";
import ExtraFeatures from "@/components/home/ExtraFeatures";
import Feature from "@/components/home/Feature";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import OnboardingModal from "@/components/home/OnboardingModal";
import Loading from "@/components/others/Loading";
import { signInWithGoogle } from "@/services/firebase.config";
import {
  useLoginMutation,
  useValidateMutation,
} from "@/services/queries/authApi";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Context } from "./layout";

export default function Home() {
  const [newUser, setNewUser] = useState<{
    email: string;
    name: string;
  } | null>(null);

  const [login, { isLoading: onboarding }] = useLoginMutation();
  const router = useRouter();
  const value = useContext(Context);

  const { setLoggedInUser, loggedInUser } = value;

  const [token, setToken] = useState("");

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
    const token = res?.data?.data?.token;

    if (token) {
      toast.success("You have successfully logged in");
      localStorage.setItem("token", token);
      setToken(token);
    } else {
      setNewUser({
        email,
        name,
      });
    }
  };

  const [validate, { isLoading: validating }] = useValidateMutation();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, [token]);

  useEffect(() => {
    const check = async () => {
      const res: any = await validate("");
      const user = res?.data?.data;

      if (user) setLoggedInUser(user);
    };
    if (token) {
      check();
    }
  }, [token]);

  if (validating) return <Loading></Loading>;


  return (
    <div className="mx-auto" style={{ width: "95%" }}>
      <Hero handleGoogleSignIn={handleGoogleSignIn}></Hero>
      <Feature></Feature>
      <ExtraFeatures></ExtraFeatures>
      <About></About>
      <Footer handleGoogleSignIn={handleGoogleSignIn}></Footer>
      {newUser?.email && (
        <OnboardingModal
          newUser={newUser}
          setNewUser={setNewUser}
        ></OnboardingModal>
      )}
    </div>
  );
}
