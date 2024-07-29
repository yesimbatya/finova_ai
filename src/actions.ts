"use server";

import { Budgets, Expenses, Incomes } from "@/db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createIncome(
  name: string,
  amount: string,
  createdBy: string,
  icon: string
) {
  const result = await db
    .insert(Incomes)
    .values({
      name,
      amount,
      createdBy,
      icon,
    })
    .returning({ insertedId: Incomes.id });

  revalidatePath("/dashboard/incomes");

  return result;
}

export async function createBudget(
  name: string,
  amount: string,
  createdBy: string,
  icon: string
) {
  const result = await db
    .insert(Budgets)
    .values({
      name,
      amount,
      createdBy,
      icon,
    })
    .returning({ insertedId: Budgets.id });

  revalidatePath("/dashboard/budgets");

  return result;
}

export async function deleteIncome(id: number) {
  await db.delete(Incomes).where(eq(Incomes.id, id));
}

export async function deleteExpense(id: number) {
  const result = await db
    .delete(Expenses)
    .where(eq(Expenses.id, id))
    .returning();

  revalidatePath("/dashboard/expenses");

  return result;
}
