"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/services/store";
import { Toaster } from "react-hot-toast";
import { createContext, useContext, useState } from "react";
import { UserPayload } from "@/services/types";
export const Context = createContext(
  {} as {
    loggedInUser: UserPayload | null;
    setLoggedInUser: (value: UserPayload | null) => void;
  }
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loggedInUser, setLoggedInUser] = useState<UserPayload | null>(null);

  const value = {
    loggedInUser,
    setLoggedInUser,
  };

  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" reverseOrder={false} />
        <Context.Provider value={value}>
          <Provider store={store}>{children}</Provider>
        </Context.Provider>
      </body>
    </html>
  );
}
