import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db/index";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Incomes, Expenses } from "@/db/schema";
import IncomeItem from "./IncomeItem";
import CreateIncomes from "./CreateIncomes";
import { unstable_noStore as noStore } from "next/cache";

async function IncomeList() {
  noStore(); // Disable caching for this component

  const getIncomelist = async () => {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      console.error("User email not available");
      return []; // Return an empty array if we can't get the user's email
    }

    return await db
      .select({
        ...getTableColumns(Incomes),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        icon: Incomes.icon,
      })
      .from(Incomes)
      .leftJoin(Expenses, eq(Incomes.id, Expenses.budgetId))
      .where(eq(Incomes.createdBy, userEmail))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));
  };

  const result = await getIncomelist();

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateIncomes />
        {result?.length > 0
          ? result.map((budget, index) => (
              <IncomeItem budget={budget} key={index} />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default IncomeList;
