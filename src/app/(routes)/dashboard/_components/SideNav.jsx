"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SideNav - Dieter Rams Inspired
 * "Good design is unobtrusive"
 *
 * Principles applied:
 * - Clear navigation hierarchy
 * - Functional iconography
 * - Minimal visual noise
 * - Consistent spacing rhythm
 */

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Income",
    href: "/dashboard/incomes",
    icon: TrendingUp,
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: TrendingDown,
  },
  {
    name: "Budgets",
    href: "/dashboard/budgets",
    icon: PiggyBank,
  },
];

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

function NavItem({ item, isActive }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md",
        "text-sm font-medium",
        "transition-colors duration-200",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
      <span>{item.name}</span>
    </Link>
  );
}

function SideNav() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <Image
            src="/logo.svg"
            alt="Finova"
            width={20}
            height={20}
            className="invert"
          />
        </div>
        <span className="text-lg font-semibold tracking-tight">Finova</span>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} isActive={isActive(item.href)} />
        ))}
      </nav>

      {/* Secondary Navigation */}
      <div className="border-t border-border px-3 py-4">
        <div className="space-y-1">
          {secondaryNavigation.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              Account
            </p>
            <p className="text-xs text-muted-foreground">Manage profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideNav;
