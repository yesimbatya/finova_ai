import Link from "next/link";
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import formatNumber from "@/utils/index";

/**
 * BudgetItem - Dieter Rams Inspired
 * "Good design makes a product understandable"
 */

function BudgetItem({ budget }) {
  const spent = budget.totalSpend || 0;
  const total = Number(budget.amount) || 0;
  const remaining = total - spent;
  const percentage = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
  const isOverBudget = spent > total;

  return (
    <Link href={`/dashboard/expenses/${budget?.id}`}>
      <Card className="p-5 hover:shadow-elevated transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          {/* Icon and Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-lg">
              {budget?.icon || "📁"}
            </div>
            <div>
              <h3 className="font-medium text-sm">{budget.name}</h3>
              <p className="text-xs text-muted-foreground">
                {budget.totalItem || 0} {budget.totalItem === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {/* Amount */}
          <p className="text-sm font-semibold tabular-nums">
            ${formatNumber(total)}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mt-4 space-y-2">
          {/* Labels */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className={cn(isOverBudget && "text-expense font-medium")}>
              ${formatNumber(spent)} spent
            </span>
            <span className={cn(isOverBudget ? "text-expense" : "text-income")}>
              ${formatNumber(Math.abs(remaining))} {isOverBudget ? "over" : "left"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isOverBudget ? "bg-expense" : "bg-primary"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default BudgetItem;
