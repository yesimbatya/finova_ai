"use server";

import { Budgets, Expenses, Incomes } from "@/db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Server Actions with Robust Error Handling
 * Following Dieter Rams: "Good design is thorough down to the last detail"
 */

// ============================================
// Validation Schemas
// ============================================

const IncomeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  createdBy: z.string().email("Invalid email address"),
  icon: z.string().optional().default("💰"),
});

const BudgetSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  createdBy: z.string().email("Invalid email address"),
  icon: z.string().optional().default("📁"),
});

const ExpenseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  budgetId: z.number().positive("Budget ID must be positive"),
});

const IdSchema = z.number().positive("ID must be a positive number");

// ============================================
// Response Types
// ============================================

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ============================================
// Income Actions
// ============================================

export async function createIncome(
  name: string,
  amount: string,
  createdBy: string,
  icon: string = "💰"
): Promise<ActionResult<{ insertedId: number }[]>> {
  try {
    // Validate input
    const validationResult = IncomeSchema.safeParse({
      name,
      amount,
      createdBy,
      icon,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const validated = validationResult.data;

    const result = await db
      .insert(Incomes)
      .values({
        name: validated.name,
        amount: validated.amount,
        createdBy: validated.createdBy,
        icon: validated.icon,
      })
      .returning({ insertedId: Incomes.id });

    revalidatePath("/dashboard/incomes");
    revalidatePath("/dashboard");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating income:", error);
    return {
      success: false,
      error: "Failed to create income. Please try again.",
    };
  }
}

export async function deleteIncome(
  id: number
): Promise<ActionResult<{ deletedId: number }>> {
  try {
    // Validate ID
    const validationResult = IdSchema.safeParse(id);
    if (!validationResult.success) {
      return { success: false, error: "Invalid income ID" };
    }

    const result = await db
      .delete(Incomes)
      .where(eq(Incomes.id, id))
      .returning({ deletedId: Incomes.id });

    if (result.length === 0) {
      return { success: false, error: "Income not found" };
    }

    revalidatePath("/dashboard/incomes");
    revalidatePath("/dashboard");

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error deleting income:", error);
    return {
      success: false,
      error: "Failed to delete income. Please try again.",
    };
  }
}

export async function updateIncome(
  id: number,
  name: string,
  amount: string,
  icon: string
): Promise<ActionResult<{ updatedId: number }>> {
  try {
    const validationResult = IdSchema.safeParse(id);
    if (!validationResult.success) {
      return { success: false, error: "Invalid income ID" };
    }

    const dataValidation = IncomeSchema.omit({ createdBy: true }).safeParse({
      name,
      amount,
      icon,
    });

    if (!dataValidation.success) {
      const errorMessage = dataValidation.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const validated = dataValidation.data;

    const result = await db
      .update(Incomes)
      .set({
        name: validated.name,
        amount: validated.amount,
        icon: validated.icon,
      })
      .where(eq(Incomes.id, id))
      .returning({ updatedId: Incomes.id });

    if (result.length === 0) {
      return { success: false, error: "Income not found" };
    }

    revalidatePath("/dashboard/incomes");
    revalidatePath("/dashboard");

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error updating income:", error);
    return {
      success: false,
      error: "Failed to update income. Please try again.",
    };
  }
}

// ============================================
// Budget Actions
// ============================================

export async function createBudget(
  name: string,
  amount: string,
  createdBy: string,
  icon: string = "📁"
): Promise<ActionResult<{ insertedId: number }[]>> {
  try {
    // Validate input
    const validationResult = BudgetSchema.safeParse({
      name,
      amount,
      createdBy,
      icon,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const validated = validationResult.data;

    const result = await db
      .insert(Budgets)
      .values({
        name: validated.name,
        amount: validated.amount,
        createdBy: validated.createdBy,
        icon: validated.icon,
      })
      .returning({ insertedId: Budgets.id });

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating budget:", error);
    return {
      success: false,
      error: "Failed to create budget. Please try again.",
    };
  }
}

export async function deleteBudget(
  id: number
): Promise<ActionResult<{ deletedId: number }>> {
  try {
    // Validate ID
    const validationResult = IdSchema.safeParse(id);
    if (!validationResult.success) {
      return { success: false, error: "Invalid budget ID" };
    }

    // First delete all expenses associated with this budget
    await db.delete(Expenses).where(eq(Expenses.budgetId, id));

    // Then delete the budget
    const result = await db
      .delete(Budgets)
      .where(eq(Budgets.id, id))
      .returning({ deletedId: Budgets.id });

    if (result.length === 0) {
      return { success: false, error: "Budget not found" };
    }

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/expenses");

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error deleting budget:", error);
    return {
      success: false,
      error: "Failed to delete budget. Please try again.",
    };
  }
}

// ============================================
// Expense Actions
// ============================================

export async function createExpense(
  name: string,
  amount: string,
  budgetId: number
): Promise<ActionResult<{ insertedId: number }[]>> {
  try {
    // Validate input
    const validationResult = ExpenseSchema.safeParse({
      name,
      amount,
      budgetId,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const validated = validationResult.data;

    // Verify budget exists
    const budget = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.id, budgetId))
      .limit(1);

    if (budget.length === 0) {
      return { success: false, error: "Budget not found" };
    }

    const result = await db
      .insert(Expenses)
      .values({
        name: validated.name,
        amount: validated.amount,
        budgetId: validated.budgetId,
        createdAt: new Date().toISOString().split("T")[0],
      })
      .returning({ insertedId: Expenses.id });

    revalidatePath("/dashboard/expenses");
    revalidatePath(`/dashboard/expenses/${budgetId}`);
    revalidatePath("/dashboard");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating expense:", error);
    return {
      success: false,
      error: "Failed to create expense. Please try again.",
    };
  }
}

export async function deleteExpense(
  id: number
): Promise<ActionResult<{ deletedId: number }>> {
  try {
    // Validate ID
    const validationResult = IdSchema.safeParse(id);
    if (!validationResult.success) {
      return { success: false, error: "Invalid expense ID" };
    }

    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, id))
      .returning({ deletedId: Expenses.id });

    if (result.length === 0) {
      return { success: false, error: "Expense not found" };
    }

    revalidatePath("/dashboard/expenses");
    revalidatePath("/dashboard");

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return {
      success: false,
      error: "Failed to delete expense. Please try again.",
    };
  }
}

// ============================================
// Utility Functions
// ============================================

export async function updateBudget(
  id: number,
  name: string,
  amount: string,
  icon: string
): Promise<ActionResult<{ updatedId: number }>> {
  try {
    const validationResult = IdSchema.safeParse(id);
    if (!validationResult.success) {
      return { success: false, error: "Invalid budget ID" };
    }

    const dataValidation = BudgetSchema.omit({ createdBy: true }).safeParse({
      name,
      amount,
      icon,
    });

    if (!dataValidation.success) {
      const errorMessage = dataValidation.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const validated = dataValidation.data;

    const result = await db
      .update(Budgets)
      .set({
        name: validated.name,
        amount: validated.amount,
        icon: validated.icon,
      })
      .where(eq(Budgets.id, id))
      .returning({ updatedId: Budgets.id });

    if (result.length === 0) {
      return { success: false, error: "Budget not found" };
    }

    revalidatePath("/dashboard/budgets");
    revalidatePath(`/dashboard/expenses/${id}`);
    revalidatePath("/dashboard");

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error updating budget:", error);
    return {
      success: false,
      error: "Failed to update budget. Please try again.",
    };
  }
}
