import React from "react";

type Props = {
  onCreate: () => void;
  onExport: () => void;
};

const DashboardActions: React.FC<Props> = ({ onCreate, onExport }) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={onCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Create Report
      </button>

      <button
        onClick={onExport}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Export to PDF
      </button>
    </div>
  );
};

export default DashboardActions;
