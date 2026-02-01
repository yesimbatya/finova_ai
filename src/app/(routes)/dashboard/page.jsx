import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db/index";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "@/db/schema";
import CardInfo from "./_components/Cardinfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

/**
 * Dashboard - Dieter Rams Inspired
 * "Good design is thorough down to the last detail"
 */

async function getBudgetList(userEmail) {
  try {
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
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
}

async function getIncomeList(userEmail) {
  try {
    return await db
      .select({
        ...getTableColumns(Incomes),
        totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(Number),
      })
      .from(Incomes)
      .where(eq(Incomes.createdBy, userEmail))
      .groupBy(Incomes.id);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    return [];
  }
}

async function getAllExpenses(userEmail) {
  try {
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
      .orderBy(desc(Expenses.id))
      .limit(10);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
}

function PageHeader({ name }) {
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        {greeting}, {name?.split(" ")[0] || "there"}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Here&apos;s your financial overview
      </p>
    </header>
  );
}

function FinancialHealthScore({ budgetList, incomeList }) {
  const totalBudget = budgetList.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const totalSpend = budgetList.reduce(
    (sum, item) => sum + (item.totalSpend || 0),
    0
  );
  const totalIncome = incomeList.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0
  );

  // Calculate health metrics
  const budgetUtilization = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;

  // Calculate health score (0-100)
  let healthScore = 100;
  if (budgetUtilization > 100) healthScore -= 30;
  else if (budgetUtilization > 80) healthScore -= 10;

  if (savingsRate < 0) healthScore -= 40;
  else if (savingsRate < 10) healthScore -= 20;
  else if (savingsRate < 20) healthScore -= 10;

  if (budgetList.length === 0) healthScore -= 20;
  if (incomeList.length === 0) healthScore -= 20;

  healthScore = Math.max(0, Math.min(100, healthScore));

  const getHealthStatus = () => {
    if (healthScore >= 80) return { label: "Excellent", color: "text-income", bgColor: "bg-income/10" };
    if (healthScore >= 60) return { label: "Good", color: "text-primary", bgColor: "bg-primary/10" };
    if (healthScore >= 40) return { label: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    return { label: "Needs Attention", color: "text-expense", bgColor: "bg-expense/10" };
  };

  const status = getHealthStatus();

  // Generate insights
  const insights = [];
  if (budgetUtilization > 100) {
    insights.push({
      type: "warning",
      message: `You're ${(budgetUtilization - 100).toFixed(0)}% over budget`,
    });
  } else if (budgetUtilization > 80) {
    insights.push({
      type: "caution",
      message: `${(100 - budgetUtilization).toFixed(0)}% budget remaining`,
    });
  }

  if (savingsRate >= 20) {
    insights.push({
      type: "success",
      message: `Great! ${savingsRate.toFixed(0)}% savings rate`,
    });
  } else if (savingsRate < 10 && savingsRate >= 0) {
    insights.push({
      type: "caution",
      message: `Consider increasing savings rate`,
    });
  } else if (savingsRate < 0) {
    insights.push({
      type: "warning",
      message: `Spending exceeds income`,
    });
  }

  if (budgetList.length === 0) {
    insights.push({
      type: "info",
      message: "Create budgets to track spending",
    });
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Financial Health</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
          {status.label}
        </div>
      </div>

      {/* Health Score Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Health Score</span>
          <span className="font-medium">{healthScore}/100</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              healthScore >= 80
                ? "bg-income"
                : healthScore >= 60
                ? "bg-primary"
                : healthScore >= 40
                ? "bg-yellow-500"
                : "bg-expense"
            }`}
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.slice(0, 3).map((insight, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm"
            >
              {insight.type === "success" && (
                <CheckCircle className="h-4 w-4 text-income flex-shrink-0" />
              )}
              {insight.type === "warning" && (
                <AlertTriangle className="h-4 w-4 text-expense flex-shrink-0" />
              )}
              {insight.type === "caution" && (
                <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              )}
              {insight.type === "info" && (
                <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
              )}
              <span className="text-muted-foreground">{insight.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: "Add Budget", href: "/dashboard/budgets", icon: PlusCircle },
    { label: "Add Income", href: "/dashboard/incomes", icon: TrendingUp },
    { label: "Add Expense", href: "/dashboard/expenses", icon: TrendingDown },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
          >
            <div className="flex items-center gap-3">
              <action.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{action.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <svg
          className="h-8 w-8 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">Welcome to Finova</h3>
      <p className="text-muted-foreground max-w-md mb-8">
        Start your financial journey by creating your first budget or adding income sources.
      </p>
      <div className="flex gap-4">
        <Link
          href="/dashboard/budgets"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Create Budget
        </Link>
        <Link
          href="/dashboard/incomes"
          className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
        >
          Add Income
        </Link>
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;

  if (!userEmail) {
    redirect("/sign-in");
  }

  const [budgetList, incomeList, expensesList] = await Promise.all([
    getBudgetList(userEmail),
    getIncomeList(userEmail),
    getAllExpenses(userEmail),
  ]);

  const hasData = budgetList.length > 0 || incomeList.length > 0;

  return (
    <div className="min-h-screen">
      <PageHeader name={user.fullName} />

      {hasData ? (
        <div className="space-y-8">
          <CardInfo budgetList={budgetList} incomeList={incomeList} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <BarChartDashboard budgetList={budgetList} />
              <ExpenseListTable expensesList={expensesList} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Financial Health Score */}
              <FinancialHealthScore
                budgetList={budgetList}
                incomeList={incomeList}
              />

              {/* Quick Actions */}
              <QuickActions />

              {/* Budgets */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Active Budgets</h3>
                  <Link
                    href="/dashboard/budgets"
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {budgetList.length > 0 ? (
                    budgetList.slice(0, 4).map((budget) => (
                      <BudgetItem budget={budget} key={budget.id} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No budgets created yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
