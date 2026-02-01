"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteExpense } from "@/actions";
import { cn } from "@/lib/utils";
import formatNumber from "@/utils/index";

/**
 * ExpenseListTable - Dieter Rams Inspired
 * "Good design is thorough down to the last detail"
 */

function ExpenseListTable({ expensesList }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (expense) => {
    if (deletingId) return; // Prevent double-click

    try {
      setDeletingId(expense.id);
      const result = await deleteExpense(expense.id);

      if (result) {
        toast.success("Expense deleted", {
          description: `"${expense.name}" has been removed.`,
        });
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense", {
        description: "Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!expensesList || expensesList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">No expenses yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-y border-border">
          <div className="col-span-5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Description
            </span>
          </div>
          <div className="col-span-3 text-right">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Amount
            </span>
          </div>
          <div className="col-span-2 text-right">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Date
            </span>
          </div>
          <div className="col-span-2 text-right">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Action
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {expensesList.map((expense) => (
            <div
              key={expense.id}
              className={cn(
                "grid grid-cols-12 gap-4 px-6 py-4 items-center",
                "hover:bg-muted/30 transition-colors",
                deletingId === expense.id && "opacity-50"
              )}
            >
              {/* Name */}
              <div className="col-span-5">
                <p className="text-sm font-medium truncate">{expense.name}</p>
              </div>

              {/* Amount */}
              <div className="col-span-3 text-right">
                <span className="text-sm font-medium tabular-nums text-expense">
                  -${formatNumber(expense.amount)}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-2 text-right">
                <span className="text-sm text-muted-foreground">
                  {formatDate(expense.createdAt)}
                </span>
              </div>

              {/* Action */}
              <div className="col-span-2 text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(expense)}
                  disabled={deletingId === expense.id}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete expense</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExpenseListTable;
