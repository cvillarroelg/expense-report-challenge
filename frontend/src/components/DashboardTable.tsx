import React from "react";
import type { Expense } from "../types/expense";
import { formatDateMMDDYYYY } from "../utils/date";
import { formatUSD } from "../utils/currency";

type Props = {
  expenses: Expense[];
};

const DashboardTable: React.FC<Props> = ({ expenses }) => {
  return (
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
              <td className="p-3 text-right font-medium">{formatUSD(exp.amount)}</td>
              <td className="p-3">{exp.currency}</td>
              <td className="p-3">{exp.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
