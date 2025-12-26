import React from "react";
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
import type { Expense } from "../types/expense";
import type { ChartDataInput } from "../types/charts";

type Props = {
  expenses: Expense[];
};

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#7c3aed",
  "#0d9488",
];

const DashboardCharts: React.FC<Props> = ({ expenses }) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
  );
};

export default DashboardCharts;
