"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import { Context } from "@/app/layout";
import { useValidateMutation } from "@/services/queries/authApi";
import { UserPayload } from "@/services/types";

const RequireUser = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const value = useContext(Context);
  const { loggedInUser } = value;

  if (!loggedInUser) return router.push("/");

  return <>{children}</>;
};

export default RequireUser;
