import { useState } from "react";
import { validateExpensesFile } from "../services/expenses";
import type { InvalidRow } from "../types/expenseValidation";
import type { Expense } from "../types/expense";

type SubmitOption = "overwrite" | "addToList" | "cancel";

type UploadExpensesProps = {
  onAddExpenses: (expenses: Expense[], mode: "add" | "overwrite") => void;
};

const UploadExpenses = ({ onAddExpenses }: UploadExpensesProps) => {
  const [errors, setErrors] = useState<InvalidRow[]>([]);
  const [hasFile, setHasFile] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("No file selected");

  // 🔹 Dialog state
  const [showDialog, setShowDialog] = useState(false);

  // 🔹 Valid expenses from file
  const [validExpenses, setValidExpenses] = useState<Expense[]>([]);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setHasFile(true);

    try {
      // Simulamos la espera
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const result = await validateExpensesFile(file);

      // 🔴 Case 1: structural error
      if (result.errors && result.errors.length > 0) {
        setErrors(
          result.errors.map((msg) => ({
            row: 0,
            errors: [msg],
          }))
        );
        setCanSubmit(false);
        return;
      }

      // 🟡 Case 2: row-level errors
      setErrors(result.invalidRows ?? []);
      setCanSubmit(result.valid);

      // 🟢 Store valid rows
      if (result.validRows) {
        const mapped: Expense[] = result.validRows.map((row) => ({
          ...row,
          id: crypto.randomUUID(),
          amount: Number(row.amount),
        }));

        setValidExpenses(mapped);
      }
    } catch {
      setErrors([
        {
          row: 0,
          errors: ["Failed to validate file. Please try again."],
        },
      ]);
      setCanSubmit(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Submit handlers
  const handleSubmit = () => {
    setShowDialog(true);
  };

  const handleDialogAction = (option: SubmitOption) => {
    setShowDialog(false);

    if (option === "addToList") {
      onAddExpenses(validExpenses, "add");
    }

    if (option === "overwrite") {
      onAddExpenses(validExpenses, "overwrite");
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold">Upload Expenses File</h2>

      {/* File input */}
      <div className="flex items-center gap-4">
        <label
          htmlFor="expenses-file"
          className="px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
        >
          Choose File
        </label>

        <span className="text-sm text-gray-600">{fileName}</span>

        <input
          id="expenses-file"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              setFileName(file.name);
              handleFileUpload(file);
            } else {
              setFileName("No file selected");
            }
          }}
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          <span className="text-sm">Validating file…</span>
        </div>
      )}

      {hasFile && !loading && canSubmit && (
        <p className="text-sm text-green-600">
          File validated successfully. You can submit the report.
        </p>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 p-4 rounded">
          <h3 className="font-semibold mb-2 text-red-700">Validation Errors</h3>
          <ul className="list-disc pl-6 text-sm text-red-700">
            {errors.map((err, i) => (
              <li key={i}>
                {err.row > 0
                  ? `Row ${err.row}: ${err.errors.join(", ")}`
                  : err.errors.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit button */}
      <button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className={`px-4 py-2 rounded font-medium transition ${
          canSubmit
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        Submit Report
      </button>

      {/* 🔹 Submit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">
              Submit Expenses Report
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              What would you like to do with this report?
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleDialogAction("overwrite")}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Overwrite
              </button>

              <button
                onClick={() => handleDialogAction("addToList")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add to list
              </button>

              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadExpenses;
