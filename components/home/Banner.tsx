import Image from "next/image";
import React from "react";

export default function Banner() {
  return (
    <div className="w-11/12 mx-auto mt-10 relative z-10 hidden sm:block">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        <div className="relative w-full h-[25em]">
          <div className="absolute top-0 h-4/5 w-full">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-lg overflow-hidden z-0">
                <Image
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                  alt="man"
                  src="/assets/hero-1.webp"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[25em]">
          <div className="absolute bottom-0 h-4/5 w-full">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-lg overflow-hidden z-0">
                <Image
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                  alt="man"
                  src="/assets/hero-4.webp"
                />
              </div>
              <Image
                src="/assets/message-icon.webp"
                alt="msg-icon"
                width={60}
                height={60}
                className="absolute -top-5 -left-5 z-10 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="relative w-full h-[25em] hidden lg:block">
          <div className="absolute top-0 h-4/5 w-full">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-lg overflow-hidden z-0">
                <Image
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                  alt="man"
                  src="/assets/hero-3.webp"
                />
              </div>
              <Image
                src="/assets/message-icon.webp"
                alt="msg-icon"
                width={60}
                height={60}
                className="absolute -bottom-5 -left-5 z-10 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="relative w-full h-[25em] hidden lg:block">
          <div className="absolute bottom-0 h-4/5 w-full">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-lg overflow-hidden z-0">
                <Image
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                  alt="man"
                  src="/assets/hero-2.webp"
                />
              </div>
              <Image
                src="/assets/phone-icon.webp"
                alt="phone-icon"
                width={60}
                height={60}
                className="absolute -top-5 -left-5 z-10 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
