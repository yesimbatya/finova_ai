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
    {
      id: 5,
      name: "AI-Investments",
      icon: "📈", // Replaced icon with emoji
      path: "/dashboard/investments",
    },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm">
      <div className="flex flex-row items-center">
        <Image src={"/logo.svg"} alt="logo" width={40} height={25} />
        <span className="text-purple-600 font-bold text-xl">Finova</span>
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
