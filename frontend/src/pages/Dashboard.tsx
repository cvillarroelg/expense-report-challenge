import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenses";
import Modal from "../components/Modal";
import ExpenseForm from "../components/ExpenseForm";
import type { Expense } from "../types/expense";
import UploadExpenses from "../components/UploadExpenses";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataInput } from "../types/charts";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDateMMDDYYYY } from "../utils/date";
import { formatUSD } from "../utils/currency";
import { isDuplicateExpense } from "../utils/isDuplicateExpense";

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [pendingExpense, setPendingExpense] = useState<Expense | null>(null);
  const [duplicateExpense, setDuplicateExpense] = useState<Expense | null>(
    null
  );

  const EXPENSES_KEY = "expenses";

  const getTotalExpenses = (expenses: Expense[]): number =>
    expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const totalAmount = getTotalExpenses(expenses);

  const saveExpense = (newExpense: Expense) => {
    const stored = localStorage.getItem("expenses");
    const current = stored ? JSON.parse(stored) : [];

    const updated = [...current, newExpense];

    localStorage.setItem("expenses", JSON.stringify(updated));
    return updated;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Expenses Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [
        ["Date", "Department", "Category", "Amount", "Currency", "Description"],
      ],
      body: expenses.map((exp) => [
        formatDateMMDDYYYY(exp.date),
        exp.department,
        exp.category,
        formatUSD(exp.amount),
        exp.currency,
        exp.description,
      ]),
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;

    doc.setFontSize(12);
    doc.text(`Total Expenses: USD ${totalAmount}`, 14, finalY + 10);

    doc.save("expenses-report.pdf");
  };

  const expensesByCategory: ChartDataInput[] = Object.values(
    expenses.reduce<Record<string, ChartDataInput>>((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = {
          name: exp.category,
          total: 0,
        };
      }

      acc[exp.category].total += Number(exp.amount);
      return acc;
    }, {})
  );

  const expensesByDepartment = Object.values(
    expenses.reduce((acc: any, exp) => {
      acc[exp.department] = acc[exp.department] || {
        name: exp.department,
        total: 0,
      };
      acc[exp.department].total += Number(exp.amount);
      return acc;
    }, {})
  );

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#ca8a04",
    "#7c3aed",
    "#0d9488",
  ];

  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");

    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
      setLoading(false);
    } else {
      getExpenses()
        .then((data) => {
          setExpenses(data);
          localStorage.setItem("expenses", JSON.stringify(data));
        })
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return <p className="p-8">Loading data...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Submitted Reports</h1>
      {/* <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Create Report
      </button> */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Report
        </button>

        <button
          onClick={() => setShowExportConfirm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export to PDF
        </button>
      </div>

      <ConfirmDialog
        isOpen={showExportConfirm}
        title="Export Report"
        message="Are you sure you want to export this report to PDF?"
        confirmText="Export"
        onCancel={() => setShowExportConfirm(false)}
        onConfirm={() => {
          handleExportPDF();
          setShowExportConfirm(false);
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Expense"
      >
        <ExpenseForm
          onSubmit={(data) => {
            const expense = {
              ...data,
              amount: Number(data.amount),
            };

            if (isDuplicateExpense(expense, expenses)) {
              setDuplicateExpense(expense);
              return;
            }

            const updatedExpenses = saveExpense(expense);
            setExpenses(updatedExpenses);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!duplicateExpense}
        title="Possible Duplicate"
        message="A similar expense already exists. Do you want to keep it anyway or discard it?"
        confirmText="Keep Expense"
        cancelText="Discard"
        onCancel={() => setDuplicateExpense(null)}
        onConfirm={() => {
          if (!duplicateExpense) return;

          const updatedExpenses = saveExpense(duplicateExpense);
          setExpenses(updatedExpenses);
          setDuplicateExpense(null);
          setIsModalOpen(false);
        }}
      />

      <ConfirmDialog
        isOpen={!!pendingExpense}
        title="Save Expense"
        message="Are you sure you want to save this expense?"
        confirmText="Save"
        onCancel={() => setPendingExpense(null)}
        onConfirm={() => {
          if (!pendingExpense) return;

          const updatedExpenses = saveExpense(pendingExpense);
          setExpenses(updatedExpenses);
          setPendingExpense(null);
          setIsModalOpen(false);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart - Category */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Expenses by Category</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {expensesByCategory.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Department */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Expenses by Department</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expensesByDepartment}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-left">Currency</th>
              <th className="p-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3">{formatDateMMDDYYYY(exp.date)}</td>
                <td className="p-3">{exp.department}</td>
                <td className="p-3">{exp.category}</td>
                <td className="p-3 text-right font-medium">
                  {formatUSD(exp.amount)}
                </td>
                <td className="p-3">{exp.currency}</td>
                <td className="p-3">{exp.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        {/* <h2 className="text-xl font-semibold mb-4"></h2> */}
        <UploadExpenses />
      </div>
    </div>
  );
};

export default Dashboard;
