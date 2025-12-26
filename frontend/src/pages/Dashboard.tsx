import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenses";
import Modal from "../components/Modal";
import ExpenseForm from "../components/ExpenseForm";
import type { Expense } from "../types/expense";
import UploadExpenses from "../components/UploadExpenses";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDateMMDDYYYY } from "../utils/date";
import { formatUSD } from "../utils/currency";
import { isDuplicateExpense } from "../utils/isDuplicateExpense";
import DashboardActions from "../components/DashboardActions";
import DashboardCharts from "../components/DashboardCharts";
import DashboardTable from "../components/DashboardTable";

const Dashboard = () => {
  type DialogState =
    | { type: "export" }
    | { type: "duplicate"; expense: Expense }
    | { type: "save"; expense: Expense }
    | null;

  const [dialog, setDialog] = useState<DialogState>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTotalExpenses = (expenses: Expense[]) =>
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

      {/* ACTIONS */}
      <DashboardActions
        onCreate={() => setIsModalOpen(true)}
        onExport={() => setDialog({ type: "export" })}
      />

      {/* CREATE EXPENSE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Expense"
      >
        <ExpenseForm
          onSubmit={(data) => {
            const expense = { ...data, amount: Number(data.amount) };

            if (isDuplicateExpense(expense, expenses)) {
              setDialog({ type: "duplicate", expense });
              return;
            }

            setDialog({ type: "save", expense });
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* CHARTS */}
      <DashboardCharts expenses={expenses} />

      {/* TABLE */}
      <DashboardTable expenses={expenses} />

      <ConfirmDialog
        isOpen={dialog !== null}
        title={
          dialog?.type === "export"
            ? "Export Report"
            : dialog?.type === "duplicate"
            ? "Possible Duplicate"
            : "Save Expense"
        }
        message={
          dialog?.type === "export"
            ? "Are you sure you want to export this report to PDF?"
            : dialog?.type === "duplicate"
            ? "A similar expense already exists. Do you want to keep it anyway?"
            : "Are you sure you want to save this expense?"
        }
        confirmText={
          dialog?.type === "export"
            ? "Export"
            : dialog?.type === "duplicate"
            ? "Keep Expense"
            : "Save"
        }
        cancelText={dialog?.type === "duplicate" ? "Discard" : "Cancel"}
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          if (!dialog) return;

          if (dialog.type === "export") {
            handleExportPDF();
          }

          if (dialog.type === "duplicate" || dialog.type === "save") {
            const updated = saveExpense(dialog.expense);
            setExpenses(updated);
            setIsModalOpen(false);
          }

          setDialog(null);
        }}
      />

      {/* UPLOAD */}
      <div className="mt-8">
        <UploadExpenses
          onAddExpenses={(newExpenses, mode) => {
            const stored = localStorage.getItem("expenses");
            const current = stored ? JSON.parse(stored) : [];

            const updated =
              mode === "overwrite" ? newExpenses : [...current, ...newExpenses];

            localStorage.setItem("expenses", JSON.stringify(updated));
            setExpenses(updated);
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
