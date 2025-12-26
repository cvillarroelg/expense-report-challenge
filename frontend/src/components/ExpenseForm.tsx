import { useState } from "react";
import categoriesData from "../data/categories.json";
import departmentsData from "../data/department.json";
import type { SelectOption } from "../types/common";

interface ExpenseFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ExpenseForm = ({ onSubmit, onCancel }: ExpenseFormProps) => {
  type FormErrors = {
    date?: string;
    amount?: string;
    department?: string;
    category?: string;
    description?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const getTodayLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const categories = categoriesData as SelectOption[];
  const departments = departmentsData as SelectOption[];
  const [form, setForm] = useState({
    date: "",
    department: "",
    category: "",
    amount: "",
    currency: "USD",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!form.department) {
      newErrors.department = "Department is required";
    }

    if (!form.category) {
      newErrors.category = "Category is required";
    }

    if (form.description.trim().length < 3) {
      newErrors.description = "Description must have at least 3 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ ...form, currency: "USD" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* DATE */}
      <input
        type="date"
        name="date"
        required
        max={getTodayLocalDate()}
        value={form.date}
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />
      {/* Department */}
      <select
        name="department"
        required
        value={form.department}
        onChange={handleChange}
        className={`w-full border p-2 rounded ${
          errors.department ? "border-red-500" : ""
        }`}
      >
        <option value="">Select department</option>

        {departments.map((dept) => (
          <option key={dept.id} value={dept.name}>
            {dept.name}
          </option>
        ))}
      </select>
      {errors.department && (
        <p className="text-red-600 text-sm mt-1">{errors.department}</p>
      )}
      {/* Category */}
      <select
        name="category"
        required
        className={`w-full border p-2 rounded ${
          errors.category ? "border-red-500" : ""
        }`}
        value={form.category}
        onChange={handleChange}
      >
        <option value="">Select category</option>

        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      {errors.category && (
        <p className="text-red-600 text-sm mt-1">{errors.category}</p>
      )}

      {/* AMOUNT */}
      <input
        type="number"
        name="amount"
        min="0.01"
        step="0.01"
        inputMode="decimal"
        placeholder="Amount"
        required
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <select
        name="currency"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      >
        <option value="USD">USD</option>
      </select>

      {/* Description */}
      <textarea
        name="description"
        placeholder="Description"
        className={`w-full border p-2 rounded ${
          errors.description ? "border-red-500" : ""
        }`}
        value={form.description}
        onChange={handleChange}
      />
      {errors.description && (
        <p className="text-red-600 text-sm mt-1">{errors.description}</p>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
