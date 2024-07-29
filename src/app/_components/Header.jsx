"use client";
import React from "react";
import Image from "next/image";
import { Button } from "src/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <div className="flex flex-row items-center">
        <Image src={"/logo.svg"} alt="logo" width={40} height={25} />
        <span className="text-purple-600  font-bold text-xl">Finova</span>
      </div>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <div className="flex gap-3  items-center">
          <Link href={"/dashboard"}>
            <Button variant="outline" className="rounded-full">
              Menu
            </Button>
          </Link>
          <Link href={"/sign-in"}>
            <Button className="rounded-full"> Log In</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
