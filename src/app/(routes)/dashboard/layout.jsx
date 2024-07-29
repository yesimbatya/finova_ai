import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { Budgets } from "@/db/schema";
import DashboardHeader from "./_components/DashboardHeader";
import SideNav from "./_components/SideNav";
import { db } from "@/db/index";

async function DashboardLayout({ children }) {
  const user = await currentUser();

  const emails = user.emailAddresses;

  const result = await db.query.Budgets.findFirst({
    where: (model, { eq }) => eq(model.createdBy, emails[0].emailAddress),
  });

  console.log({ result });

  if (result?.length == 0) {
    redirect("/dashboard/budgets");
  }

  return (
    <div>
      <div className="fixed md:w-64 hidden md:block ">
        <SideNav />
      </div>
      <div className="md:ml-64 ">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
