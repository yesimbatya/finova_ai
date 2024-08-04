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
      <div className="flex items-center space-x-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl shadow-lg">
        <div className="relative">
          {/* Removed the gradient background and blur effect */}
          <Image
            src={"/logo.svg"}
            alt="Finova logo"
            width={50}
            height={50}
            className="relative rounded-full transition-all duration-300 hover:scale-110"
          />
        </div>
        <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 tracking-wide">
          Finova
        </span>
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
