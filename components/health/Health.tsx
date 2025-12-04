"use client";

import React, { useEffect, useState } from "react";

function Health() {
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/health`);
        const data = await res.json();
        console.log("res", data);
      } catch (error) {
        console.log(error);
      }
    };
    checkHealth();
  }, []);
  return <div className="min-h-screen bg-white">Hello world</div>;
}

export default Health;
