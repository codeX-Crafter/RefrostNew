import React from "react";
import { Search } from "lucide-react";

export default function AlertHistory() {
  const alerts = [
    {
      timestamp: "2023-10-27 14:35:12",
      device: "Sensor-Alpha-001",
      desc: "High temperature detected in unit 4.",
      severity: "Critical",
      status: "Resolved",
      action: "Notification Sent",
    },
    {
      timestamp: "2023-10-27 13:10:05",
      device: "Gateway-Main-A",
      desc: "Device offline for 15 minutes.",
      severity: "Warning",
      status: "Resolved",
      action: "Email Sent",
    },
    {
      timestamp: "2023-10-26 22:01:49",
      device: "Sensor-Beta-003",
      desc: "Battery level below 20%.",
      severity: "Warning",
      status: "Open",
      action: "None",
    },
    {
      timestamp: "2023-10-26 18:45:30",
      device: "System-Core",
      desc: "Firmware update v2.1 applied successfully.",
      severity: "Info",
      status: "Resolved",
      action: "None",
    },
    {
      timestamp: "2023-10-25 09:12:11",
      device: "Sensor-Alpha-002",
      desc: "Pressure exceeds safety threshold.",
      severity: "Critical",
      status: "Open",
      action: "Relay Activated",
    },
  ];

  const severityColors = {
    Critical: "bg-red-900/40 text-red-400 border border-red-700",
    Warning: "bg-yellow-900/40 text-yellow-400 border border-yellow-700",
    Info: "bg-gray-700 text-gray-300 border border-gray-600",
  };

  const statusColors = {
    Resolved: "bg-green-900/40 text-green-400 border border-green-700",
    Open: "bg-gray-700 text-gray-300 border border-gray-600",
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold">Alert History</h1>
      <p className="text-gray-400 mt-1">
        Review and manage all past system alerts and triggered actions.
      </p>

      {/* Search Bar */}
      <div className="mt-6 mb-4 bg-[#1e293b] px-4 py-3 rounded-xl border border-gray-700 flex items-center gap-3">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by keyword, device ID, etc."
          className="bg-transparent outline-none text-gray-200 w-full placeholder:text-gray-500"
        />
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase border-b border-gray-700">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Device / Origin</th>
              <th className="px-4 py-3">Alert Description</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Auto-Action</th>
            </tr>
          </thead>

          <tbody>
            {alerts.map((a, i) => (
              <tr key={i} className="border-b border-gray-700/40">
                <td className="px-4 py-3 text-gray-300">{a.timestamp}</td>

                <td className="px-4 py-3 font-semibold text-blue-300">
                  {a.device}
                </td>

                <td className="px-4 py-3 text-gray-300">{a.desc}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      severityColors[a.severity]
                    }`}
                  >
                    ● {a.severity}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[a.status]
                    }`}
                  >
                    ● {a.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-300">{a.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-3">Showing 1 to 5 of 97 results</p>
    </div>
  );
}
