import React from "react";
import Image from "next/image";
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
    </section>
  );
}

export default Hero;
