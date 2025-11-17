import Image from "next/image";
import React from "react";

export default function Banner() {
  return (
    <div className="w-11/12 mx-auto mt-10 relative z-5 hidden sm:block">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        <div className="relative w-full h-[25em]">
          <div className="h-4/5 w-full rounded-sm absolute top-0">
            <Image
              width={300}
              height={400}
              className="w-full h-full"
              alt="man"
              src="/assets/hero-1.webp"
            />
          </div>
        </div>

        <div className="relative w-full h-[25em]">
          <div className="h-4/5 w-full rounded-sm absolute bottom-0">
            <Image
              src="/assets/message-icon.webp"
              alt="google"
              width={60}
              height={60}
              className="absolute -top-5 -left-5"
            />
            <Image
              width={300}
              height={400}
              className="w-full h-full"
              alt="man"
              src="/assets/hero-4.webp"
            />
          </div>
        </div>

        <div className="relative w-full h-[25em] hidden lg:block">
          <div className="h-4/5 w-full rounded-sm absolute top-0">
            <Image
              src="/assets/message-icon.webp"
              alt="google"
              width={60}
              height={60}
              className="absolute -bottom-5 -left-5"
            />
            <Image
              width={300}
              height={400}
              className="w-full h-full"
              alt="man"
              src="/assets/hero-3.webp"
            />
          </div>
        </div>

        <div className="relative w-full h-[25em] hidden lg:block">
          <div className="h-4/5 w-full rounded-sm absolute bottom-0">
            <Image
              src="/assets/phone-icon.webp"
              alt="google"
              width={60}
              height={60}
              className="absolute -top-5 -left-5"
            />
            <Image
              width={300}
              height={400}
              className="w-full h-full"
              alt="man"
              src="/assets/hero-2.webp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
