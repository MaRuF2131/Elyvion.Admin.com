import { useState, useMemo, useEffect } from "react";

export default function CustomerTaskDetails({ open, onClose, customer, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab || "all");

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab === "comboSetting" ? "setting" : defaultTab);
    }
  }, [defaultTab]);



  const allTasks = [
    { id: 4668, details: "Example Task", price: "0.00", profit: "0.00", status: "Pending" },
    { id: 4669, details: "Order Complete", price: "10.00", profit: "2.00", status: "Completed" },
  ];

  const comboSettings = [
    { id: 1, details: "Combo A Enabled", price: "-", profit: "-", status: "Active" },
    { id: 2, details: "Combo B Disabled", price: "-", profit: "-", status: "Inactive" },
  ];

  const comboHistory = [
    { id: 901, details: "Combo Purchased", price: "50", profit: "5", status: "Success" },
  ];


  const tasks = useMemo(() => {
    if (activeTab === "setting" || activeTab === "comboSetting") return comboSettings;
    if (activeTab === "history") return comboHistory;
    return allTasks;
  }, [activeTab]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

    if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Customer Task Details</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-white bg-gray-700 rounded-full hover:bg-black transition-colors"
          >
            <span className="text-xl font-bold pb-1">×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center bg-gray-50 py-4">
          <div className="flex bg-gray-200 p-1 rounded-md gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 text-sm rounded transition-all ${activeTab === "all" ? "bg-[#6343D8] text-white shadow-sm" : "text-gray-600 hover:text-black"}`}
            >
              All Task
            </button>
            <button
              onClick={() => setActiveTab("setting")}
              className={`px-4 py-1.5 text-sm rounded transition-all ${activeTab === "setting" || activeTab === "comboSetting" ? "bg-[#6343D8] text-white shadow-sm" : "text-gray-600 hover:text-black"}`}
            >
              Combo Task Setting
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-1.5 text-sm rounded transition-all ${activeTab === "history" ? "bg-[#6343D8] text-white shadow-sm" : "text-gray-600 hover:text-black"}`}
            >
              Combo Task History
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 px-8 py-6 text-sm bg-white">
          <Info label="Code" value={customer?.numberCode || customer?.code || "-"} />
          <Info label="Login User Name" value={customer?.loginUserName || customer?.username || "-"} />
          <Info label="Completed" value={customer?.completed || "0"} />
          <Info label="Current Task" value={customer?.currentTask || "-"} />
          <Info label="Actual Wallet Balance" value={customer?.assetBalance || "0"} highlight />
          <Info label="Wallet Balance" value={customer?.assetBalance || "0"} highlight />
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b sticky top-0 bg-white">
              <tr>
                <th className="px-8 py-4">#</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Profit</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4">{task.id}</td>
                  <td className="px-6 py-4">{task.details}</td>
                  <td className="px-6 py-4">{task.price}</td>
                  <td className="px-6 py-4">{task.profit}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tasks.length === 0 && (
            <div className="flex items-center justify-center py-20 text-gray-400">
              No data found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Info Component
function Info({ label, value, highlight }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 whitespace-nowrap">{label} :</span>
      <span className={`font-semibold ${highlight ? "text-purple-700" : "text-gray-800"}`}>{value}</span>
    </div>
  );
}