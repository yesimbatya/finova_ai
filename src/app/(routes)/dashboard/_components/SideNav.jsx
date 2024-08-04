"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: "🏠", // Replaced icon with emoji
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Cash Inflow",
      icon: "💵", // Replaced icon with emoji
      path: "/dashboard/incomes",
    },
    {
      id: 3,
      name: "Cash Outflow",
      icon: "💸", // Replaced icon with emoji
      path: "/dashboard/expenses",
    },
    {
      id: 4,
      name: "Budgets",
      icon: "🐷", // Replaced icon with emoji
      path: "/dashboard/budgets",
    },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm">
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
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <h2
              className={`flex gap-2 items-center
                    text-gray-500 font-medium
                    mb-2
                    p-4 cursor-pointer rounded-full
                    hover:text-primary hover:bg-blue-100
                    ${path == menu.path && "text-primary bg-blue-100"}
                    `}
            >
              <span>{menu.icon}</span> {/* Changed to use emoji */}
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div
        className="fixed bottom-10 p-5 flex gap-2
            items-center"
      >
        <UserButton />
        Profile
      </div>
    </div>
  );
}

export default SideNav;
