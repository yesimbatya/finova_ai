import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideNav from "./_components/SideNav";
import { Toaster } from "sonner";

/**
 * Dashboard Layout - Dieter Rams Inspired
 * "Good design is unobtrusive"
 */

async function DashboardLayout({ children }) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Fixed on desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SideNav />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <div className="px-6 py-8 lg:px-8">
          {children}
        </div>
      </main>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
          },
        }}
      />
    </div>
  );
}

export default DashboardLayout;
