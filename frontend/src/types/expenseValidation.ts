import type { Expense } from "./expense";

export interface InvalidRow {
  row: number;
  errors: string[];
}

export interface ValidateExpensesResponse {
  valid: boolean;

  // Cuando el archivo se pudo procesar
  validRows?: Expense[];
  invalidRows?: InvalidRow[];

  // Cuando el archivo es inválido estructuralmente
  errors?: string[];
}
