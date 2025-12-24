import { useEffect, useState } from "react";
import { getExpenses} from "../services/expenses";
import Modal from "../components/Modal";
import ExpenseForm from "../components/ExpenseForm";
import type { Expense } from "../types/expense";
import UploadExpenses from "../components/UploadExpenses";

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getExpenses()
      .then(setExpenses)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-8">Loading data...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Submitted Reports</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Create Report
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Expense"
      >
        <ExpenseForm
          onSubmit={(data) => {
            console.log("New expense:", data);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
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
                <td className="p-3">{exp.date}</td>
                <td className="p-3">{exp.department}</td>
                <td className="p-3">{exp.category}</td>
                <td className="p-3 text-right font-medium">
                  {exp.amount.toFixed(2)}
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
