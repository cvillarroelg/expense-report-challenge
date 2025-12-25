import type { Expense } from "../types/expense";

export const isDuplicateExpense = (newExpense: Expense, expenses: Expense[]) => {
  return expenses.some(
    (exp) =>
      exp.date === newExpense.date &&
      exp.amount === newExpense.amount &&
      exp.description.trim().toLowerCase() ===
        newExpense.description.trim().toLowerCase()
  );
};
