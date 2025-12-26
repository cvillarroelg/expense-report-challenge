import { useState } from "react";
import { validateExpensesFile } from "../services/expenses";
import type { InvalidRow } from "../types/expenseValidation";

const UploadExpenses = () => {
  const [errors, setErrors] = useState<InvalidRow[]>([]);
  const [hasFile, setHasFile] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("No file selected");

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setHasFile(true);

    try {
      const result = await validateExpensesFile(file);

      // 🔴 Case 1: structural error (missing columns, etc.)
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
      const rowErrors = result.invalidRows ?? [];
      setErrors(rowErrors);
      setCanSubmit(result.valid);
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

  return (
    <div className="space-y-4 bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold">Upload Expenses File</h2>

      {/* Custom file input */}
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
        <p className="text-sm text-gray-500">Validating file…</p>
      )}

      {hasFile && !loading && canSubmit && (
        <p className="text-sm text-green-600">
          File validated successfully. You can submit the report.
        </p>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 p-4 rounded">
          <h3 className="font-semibold mb-2 text-red-700">
            Validation Errors
          </h3>
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

      <button
        disabled={!canSubmit}
        className={`px-4 py-2 rounded font-medium transition ${
          canSubmit
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        Submit Report
      </button>
    </div>
  );
};

export default UploadExpenses;