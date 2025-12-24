import type { Expense } from "../types/expense";
import type { ValidateExpensesResponse } from "../types/expenseValidation";
import { http } from "./http";

export const getExpenses = () =>
  http<Expense[]>("/expenses");

export const validateExpensesFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return http<ValidateExpensesResponse>("/expenses/validate", {
    method: "POST",
    body: formData,
  });
};