// app/dashboard/page.jsx

import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import CardInfo from "./_components/Cardinfo";
import { db } from "@/db/index";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "@/db/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";

async function getBudgetList(userEmail) {
  return await db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, userEmail))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id));
}

async function getIncomeList() {
  return await db
    .select({
      ...getTableColumns(Incomes),
      totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(Number),
    })
    .from(Incomes)
    .groupBy(Incomes.id);
}

async function getAllExpenses(userEmail) {
  return await db
    .select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
    })
    .from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, userEmail))
    .orderBy(desc(Expenses.id));
}

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const userEmail = user.primaryEmailAddress.emailAddress;

  try {
    const [budgetList, incomeList, expensesList] = await Promise.all([
      getBudgetList(userEmail),
      getIncomeList(),
      getAllExpenses(userEmail),
    ]);

    return (
      <div className="p-8 bg-">
        <h2 className="font-bold text-4xl">Hi, {user.fullName} ❤️</h2>
        <p className="text-gray-500">
          Let&apos;s manage your expenses with Finova
        </p>

        <CardInfo budgetList={budgetList} incomeList={incomeList} />
        <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
          <div className="lg:col-span-2">
            <BarChartDashboard budgetList={budgetList} />

            <ExpenseListTable expensesList={expensesList} />
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="font-bold text-lg">Latest Budgets</h2>
            {budgetList?.length > 0
              ? budgetList.map((budget) => (
                  <BudgetItem budget={budget} key={budget.id} />
                ))
              : [1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-[180px] w-full bg-slate-200 rounded-lg animate-pulse"
                  ></div>
                ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error: An error occurred while fetching data.</div>;
  }
}
