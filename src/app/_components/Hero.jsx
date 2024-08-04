import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ContainerScroll } from "./container-scroll-animation";

function Hero() {
  return (
    <section className="bg-gray-50 flex items-center flex-col">
      <div className="flex flex-col">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Your Financial Guide With <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-purple-600">
                  Finova AI
                </span>
              </h1>
            </>
          }
        >
          <Image
            src="/dashboard.png"
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
      <div className="w-full border-t border-gray-300 my-8"></div>
      <footer className="mb-8 text-center text-sm text-gray-500">
        Built with ❤️ by{" "}
        <Link
          href="https://github.com/yesimbatya"
          className="text-blue-500 hover:underline"
        >
          Yessimkhan
        </Link>
      </footer>
    </section>
  );
}

export default Hero;
