"use client";
import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/Cardinfo";
import { db } from "@/db/index";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "@/db/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";

function Dashboard() {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      getBudgetList().catch((err) => setError(err));
    }
  }, [user]);

  const getBudgetList = async () => {
    try {
      setLoading(true);
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      console.log("Budget List:", result);
      if (result.length > 0) {
        setBudgetList(result);
        await getAllExpenses();
        await getIncomeList();
      } else {
        console.warn("No budgets found for user.");
      }
    } catch (error) {
      console.error("Error fetching budget list:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getIncomeList = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Incomes),
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(
            Number
          ),
        })
        .from(Incomes)
        .groupBy(Incomes.id);

      console.log("Income List:", result);
      setIncomeList(result);
    } catch (error) {
      console.error("Error fetching income list:", error);
      setError(error);
    }
  };

  const getAllExpenses = async () => {
    try {
      const result = await db
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

      console.log("Expenses List:", result);
      setExpensesList(result);
    } catch (error) {
      console.error("Error fetching expenses list:", error);
      setError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-8 bg-">
      <h2 className="font-bold text-4xl">Hi, {user?.fullName} ❤️</h2>
      <p className="text-gray-500">
        Let&apos;s manage your expenses with Finova
      </p>

      <CardInfo budgetList={budgetList} incomeList={incomeList} />
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2">
          <BarChartDashboard budgetList={budgetList} />

          <ExpenseListTable
            expensesList={expensesList}
            refreshData={() => getBudgetList()}
          />
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
}

export default Dashboard;
