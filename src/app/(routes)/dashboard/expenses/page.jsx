import { db } from "@/db/index";
import { Budgets, Expenses } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import ExpenseListTable from "./_components/ExpenseListTable";
import { currentUser } from "@clerk/nextjs/server";

async function ExpensesScreen() {
  const user = await currentUser();

  const getAllExpenses = async () => {
    return db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
  };

  const result = await getAllExpenses();

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Expenses</h2>

      <ExpenseListTable expensesList={result} />
    </div>
  );
}

export default ExpensesScreen;
