import React from "react";

// ---------- MAIN DASHBOARD ----------
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white p-8 space-y-8">
      {/* -------------- TOP CARDS -------------- */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Total Active Devices" value="1,482" icon="device" />
        <StatCard title="Shipments in Transit" value="317" icon="truck" />
        <StatCard
          title="Critical Alerts Today"
          value="9"
          highlight
          icon="alert"
        />
        <div className="flex flex-col gap-3">
          <ActionButton label="Shipment Details" />
          <ActionButton label="Full Alert History" />
          <ActionButton label="Settings" />
        </div>
      </div>

      {/* -------------- LIVE SHIPMENTS + METRICS -------------- */}
      <div className="grid grid-cols-4 gap-6">
        {/* World Map */}
        <div className="col-span-2 bg-[#111827] rounded-2xl relative overflow-hidden h-[250px]">
          <img
            src="/world-map.png"
            alt="world map"
            className="w-full h-full object-cover opacity-70"
          />
          {/* Example Glowing Pins */}
          {[
            { x: "20%", y: "40%" },
            { x: "35%", y: "30%" },
            { x: "60%", y: "50%" },
            { x: "75%", y: "60%" },
          ].map((pin, i) => (
            <span
              key={i}
              className="absolute w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_2px_rgba(59,130,246,0.6)] animate-pulse"
              style={{ left: pin.x, top: pin.y }}
            />
          ))}
        </div>
        {/* Metrics
        <Metric title="Avg. Temperature" value="4.2°C" status="Safe" />
        <Metric title="Avg. Humidity" value="85%" status="Normal" /> */}
        {/* Shipment Status */}
        <ShipmentStatus active="317" delivered="892" risk="14" />
        {/* Door Status */}
        <DoorStatus />
      </div>

      {/* -------------- ACTIVE SHIPMENTS + ALERTS -------------- */}
      <div className="grid grid-cols-3 gap-6">
        {/* Active Shipments Table */}
        <div className="col-span-2 bg-[#111827] p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Active Shipments</h2>
          <ShipmentTable />
        </div>

        {/* Recent Alerts */}
        <div className="bg-[#111827] p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
          <Alert
            type="critical"
            title="Critical: Temp. Spike"
            subtitle="ID-65432 exceeded 6.5°C"
            time="2 min ago"
          />
          <Alert
            type="warning"
            title="Warning: Rerouted"
            subtitle="ID-91245 delayed due to weather"
            time="45 min ago"
          />
          <Alert
            type="critical"
            title="Critical: Door Opened"
            subtitle="ID-11234 door opened mid-transit"
            time="1 hour ago"
          />
          <Alert
            type="info"
            title="Info: Checkpoint"
            subtitle="ID-77589 reached Suez Canal"
            time="3 hours ago"
          />
          <Alert
            type="warning"
            title="Warning: Low Battery"
            subtitle="Device on ID-84362 at 15%"
            time="5 hours ago"
          />
        </div>
      </div>
    </div>
  );
}

// ---------- COMPONENTS ----------

function StatCard({ title, value, highlight }) {
  return (
    <div
      className={`p-6 rounded-2xl ${
        highlight ? "bg-red-900/50" : "bg-[#111827]"
      }`}
    >
      <div className="text-gray-400 text-sm mb-2">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function ActionButton({ label }) {
  return (
    <button className="bg-[#111827] w-full py-3 rounded-lg font-semibold hover:bg-[#1a2234] transition">
      {label}
    </button>
  );
}

function Metric({ title, value, status }) {
  return (
    <div className="bg-[#111827] rounded-2xl p-4">
      <div className="text-gray-400 text-sm">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-green-400 text-sm mt-1">{status}</div>
    </div>
  );
}

function ShipmentStatus({ active, delivered, risk }) {
  return (
    <div className="bg-[#111827] rounded-2xl p-4 flex justify-between">
      <StatusItem label="Active" value={active} color="text-blue-400" />
      <StatusItem label="Delivered" value={delivered} color="text-green-400" />
      <StatusItem label="At Risk" value={risk} color="text-red-400" />
    </div>
  );
}

function StatusItem({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`${color} font-bold text-xl`}>{value}</span>
      <span className="text-gray-400 text-sm">{label}</span>
    </div>
  );
}

function DoorStatus() {
  return (
    <div className="bg-[#111827] rounded-2xl p-4">
      <div className="text-gray-400 text-sm">Door Status</div>
      <div className="text-green-400 font-bold text-xl mt-1">Secure</div>
      <div className="text-green-400 text-sm">Closed</div>
    </div>
  );
}

function ShipmentTable() {
  const shipments = [
    [
      "ID-84362",
      "Rotterdam, NL",
      "New York, US",
      "In Transit",
      "4.5°C",
      "2 days",
    ],
    ["ID-91245", "Los Angeles, US", "Tokyo, JP", "Delayed", "5.1°C", "4 days"],
    ["ID-77589", "Singapore, SG", "London, UK", "In Transit", "3.9°C", "1 day"],
    ["ID-65432", "Hamburg, DE", "Shanghai, CN", "At Risk", "6.8°C", "3 days"],
    ["ID-30981", "Dubai, AE", "Sydney, AU", "In Transit", "4.0°C", "5 days"],
    ["ID-12345", "Mumbai, IN", "Durban, ZA", "Delivered", "4.2°C", "-"],
  ];

  const statusColors = {
    "In Transit": "bg-blue-500 text-white px-2 py-0.5 rounded",
    Delayed: "bg-yellow-500 text-white px-2 py-0.5 rounded",
    "At Risk": "bg-red-500 text-white px-2 py-0.5 rounded",
    Delivered: "bg-green-500 text-white px-2 py-0.5 rounded",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="pb-3">Shipment ID</th>
            <th className="pb-3">Origin</th>
            <th className="pb-3">Destination</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Temp</th>
            <th className="pb-3">ETA</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-800">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`py-3 ${i === 3 ? "font-semibold" : ""}`}
                >
                  {i === 3 ? (
                    <span className={statusColors[cell]}>{cell}</span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Alert({ type, title, subtitle, time }) {
  const colors = {
    critical: "bg-red-500",
    warning: "bg-yellow-400",
    info: "bg-blue-400",
  };
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className={`w-3 h-3 rounded-full mt-1 ${colors[type]}`}></div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-gray-400 text-sm">{subtitle}</div>
        <div className="text-gray-400 text-xs">{time}</div>
      </div>
    </div>
  );
}
