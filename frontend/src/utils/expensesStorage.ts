import type { Expense } from "../types/expense";

const STORAGE_KEY = "expenses";

export const loadExpenses = (): Expense[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveExpenses = (expenses: Expense[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};
