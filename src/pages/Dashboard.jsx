import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const shipments = [
    {
      id: "SHP-00123",
      status: "OK",
      origin: "Miami, FL",
      dest: "Atlanta, GA",
      temp: "3.5°C",
      humidity: "85%",
    },
    {
      id: "SHP-00124",
      status: "Alert",
      origin: "Los Angeles, CA",
      dest: "Dallas, TX",
      temp: "8.2°C",
      humidity: "91%",
    },
    {
      id: "SHP-00125",
      status: "Warning",
      origin: "New York, NY",
      dest: "Chicago, IL",
      temp: "5.1°C",
      humidity: "88%",
    },
    {
      id: "SHP-00126",
      status: "OK",
      origin: "Seattle, WA",
      dest: "Denver, CO",
      temp: "2.8°C",
      humidity: "82%",
    },
  ];

  const alerts = [
    {
      type: "High Temperature Alert",
      text: "SHP-00124 exceeded 8°C threshold.",
      time: "2 min ago",
    },
    {
      type: "Low Battery Warning",
      text: "Device DEV-881 is at 18%.",
      time: "10 min ago",
    },
    {
      type: "Light Exposure",
      text: "SHP-00126 light sensor triggered.",
      time: "29 min ago",
    },
    {
      type: "Door Opened",
      text: "SHP-00126 door sensor triggered.",
      time: "45 min ago",
    },
  ];

  const navItem = "block py-1 transition cursor-pointer";
  const activeClass = "text-[#1C9CF6] font-semibold";
  const normalClass = "text-[#0A4A7A] hover:text-[#1C9CF6]";

  return (
    <div className="flex h-screen bg-[#EAF6FF]">
      {/* Mobile Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-3 fixed top-4 left-4 z-50 bg-white shadow-md rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static z-40 w-60 h-full bg-white/80 backdrop-blur-xl border-r border-[#CFE8FF] p-6 shadow-lg transition-all`}
      >
        <div className="flex items-center gap-2 mb-8">
          <img src="/image.png" className="w-9 h-9 rounded" />
          <h2 className="text-2xl font-bold text-[#0A6FB7]">ReFrost</h2>
        </div>

        <nav className="space-y-4 font-medium">
          <NavLink
            to="/Dashboard"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : normalClass}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/Analytics"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : normalClass}`
            }
          >
            Analytics
          </NavLink>

          <NavLink
            to="/ShipmentDetails"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : normalClass}`
            }
          >
            Shipments
          </NavLink>

          <NavLink
            to="/Sensors"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : normalClass}`
            }
          >
            Sensors
          </NavLink>

          <NavLink
            to="/Settings"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : normalClass}`
            }
          >
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6 overflow-auto bg-gradient-to-b from-[#F7FBFF] to-[#E8F4FF]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A4A7A]">
            Cold Chain Dashboard
          </h1>
          <div className="w-10 h-10 bg-[#CFE8FF] rounded-full border border-[#A9D8FF]" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Temperature", value: "3.5°C" },
            { label: "Humidity", value: "85%" },
            { label: "Vibration", value: "0.2 G" },
            { label: "Light Exposure", value: "⚠ Alert", danger: true },
          ].map((st, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/75 backdrop-blur-md border border-[#D6ECFF] shadow-sm hover:shadow-md transition"
            >
              <p className="text-[#0A4A7A] font-medium text-sm">{st.label}</p>
              <p
                className={`text-2xl font-bold ${
                  st.danger ? "text-red-600" : "text-[#0A6FB7]"
                }`}
              >
                {st.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#CFE8FF] rounded-xl p-5 shadow mb-8">
          <h2 className="font-bold text-lg text-[#0A4A7A] mb-3">
            Shipment Overview
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F3FAFF] text-[#0A4A7A] border-b border-[#D6ECFF]">
                <tr>
                  <th className="py-2 text-left">Shipment ID</th>
                  <th>Status</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Temp</th>
                  <th>Humidity</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-[#F3FAFF]">
                    <td className="py-2 font-semibold text-[#1C9CF6]">
                      {s.id}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          s.status === "OK"
                            ? "bg-green-100 text-green-700"
                            : s.status === "Warning"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>{s.origin}</td>
                    <td>{s.dest}</td>
                    <td>{s.temp}</td>
                    <td>{s.humidity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white/75 backdrop-blur-lg rounded-xl p-5 border border-[#D6ECFF] shadow">
          <h2 className="font-bold text-lg text-[#0A4A7A] mb-3">
            Active Alerts
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {alerts.map((a, i) => (
              <div
                key={i}
                className="p-4 min-w-[220px] bg-[#F7FBFF] border border-[#CFE8FF] rounded-lg shadow-sm hover:shadow transition"
              >
                <p className="font-bold text-red-600">{a.type}</p>
                <p className="text-sm text-[#0A4A7A]">{a.text}</p>
                <p className="text-xs text-gray-500">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
