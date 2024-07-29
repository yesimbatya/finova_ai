"use client";

import { toast } from "sonner";

function ExpenseListTable({ expensesList }) {
  const handleDelete = async (expense) => {
    await deleteExpense(expense.id);

    if (result) {
      toast("Expense Deleted!");
    }
  };
  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList.map((expenses, index) => (
        <div
          key={index}
          className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2"
        >
          <h2>{expenses.name}</h2>
          <h2>{expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
          <h2
            onClick={() => handleDelete(expenses)}
            className="text-red-500 cursor-pointer"
          >
            Delete
          </h2>
          {/* <h2>
            <Trash
              className="text-red-500 cursor-pointer"
              onClick={() => deleteExpense(expenses)}
            />
          </h2> */}
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
