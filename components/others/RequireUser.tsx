"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import { Context } from "@/app/layout";
import { useValidateMutation } from "@/services/queries/authApi";
import { UserPayload } from "@/services/types";

const RequireUser = ({ children }: { children: React.ReactNode }) => {
  const value = useContext(Context);
  const router = useRouter();

  const { loggedInUser, setLoggedInUser } = value;

  const [validate, { isLoading: validating }] = useValidateMutation();

  useEffect(() => {
    const check = async () => {
      const res: any = await validate("");
      const user = res?.data?.data;

      if (!user) {
        router.push("/");
      } else {
        setLoggedInUser(user);
      }
    };

    check();
  }, []);

  if (validating) return <Loading></Loading>;

  return <>{children}</>;
};

export default RequireUser;
