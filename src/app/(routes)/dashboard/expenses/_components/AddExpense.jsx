"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createExpense } from "src/actions";

/**
 * AddExpense Component
 * Dieter Rams: "Good design makes a product useful"
 */

function AddExpense({ budgetId, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Validates and adds a new expense using server action
   */
  const addNewExpense = async () => {
    // Client-side validation
    if (!name.trim()) {
      toast.error("Please enter an expense name");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const result = await createExpense(name.trim(), amount, budgetId);

      if (result.success) {
        setAmount("");
        setName("");
        toast.success("Expense added successfully!");
        if (refreshData) {
          refreshData();
        }
      } else {
        toast.error(result.error || "Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && name.trim() && amount) {
      addNewExpense();
    }
  };

  return (
    <div className="bg-card border border-border p-6 rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-expense/10 rounded-lg">
          <Receipt className="h-5 w-5 text-expense" />
        </div>
        <h2 className="font-semibold text-lg">Add Expense</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Expense Name
          </label>
          <Input
            placeholder="e.g. Coffee, Groceries, Uber"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength={100}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Amount ($)
          </label>
          <Input
            type="number"
            placeholder="e.g. 25.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyPress={handleKeyPress}
            min="0.01"
            step="0.01"
          />
        </div>

        <Button
          disabled={!(name.trim() && amount) || loading}
          onClick={addNewExpense}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Press Enter to quickly add expenses
      </p>
    </div>
  );
}

export default AddExpense;
