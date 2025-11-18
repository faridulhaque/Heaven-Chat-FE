import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Banner from "./Banner";

type HeroComponent = {
  handleGoogleSignIn: () => any;
};

function Hero({ handleGoogleSignIn }: HeroComponent) {
  return (
    <div className="relative min-h-0 pb-6 sm:pb-0 sm:min-h-screen">
      <Navbar handleGoogleSignIn={handleGoogleSignIn} />
      <Header handleGoogleSignIn={handleGoogleSignIn} />

      <div
        className="
      absolute
      top-60 sm:bottom-0 sm:top-auto
      left-0
      h-2/5 w-11/12
      bg-[#FF5F5F]
      z-1
      transform skew-y-16 origin-bottom-right
      blur-2xl opacity-50
      rounded-2xl
    "
      ></div>

      <Banner />
    </div>
  );
}

export default Hero;
