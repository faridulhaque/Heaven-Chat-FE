"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import { Context } from "@/app/layout";
import { useValidateMutation } from "@/services/queries/authApi";

const RequireUser = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { setLoggedInUser, loggedInUser } = useContext(Context);

  const [validate, { isLoading: validating }] = useValidateMutation();
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    const run = async () => {
      const res: any = await validate("");
      const user = res?.data?.data;

      if (user) setLoggedInUser(user);
      else router.push("/");

      setTokenChecked(true);
    };

    run();
  }, []);

  if (!tokenChecked || validating) return <Loading />;

  return <>{children}</>;
};

export default RequireUser;
