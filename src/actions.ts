"use server";

import { Incomes } from "@/db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteIncome(id: number) {
  await db.delete(Incomes).where(eq(Incomes.id, id));
}
