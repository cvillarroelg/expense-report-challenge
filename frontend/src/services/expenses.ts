import type { Expense } from "../types/expense";
import { http } from "./http";

export const getExpenses = () =>
  http<Expense[]>("/expenses");
