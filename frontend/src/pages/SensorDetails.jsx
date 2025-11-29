import React, { useState } from "react";

export default function SensorDetails() {
  const [range, setRange] = useState("24H");

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-8 py-6">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-400 mb-4">
        All Shipments / Shipment #SH123 /{" "}
        <span className="text-white">Sensor #SN-T456</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold">Sensor Details: #SN-T456</h1>
      <p className="text-gray-400 mt-1 mb-8">
        Real-time monitoring and historical data for an individual sensor.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <StatCard label="Temperature" value="2.5°C" status="safe" />
        <StatCard label="Humidity" value="55% RH" status="safe" />
        <StatCard label="Door Status" value="Open" status="warning" />
        <StatCard label="Gas Level" value="98 PPM" status="critical" />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Historical Data */}
        <div className="col-span-2 bg-[#111827] p-6 rounded-xl">
          <h2 className="text-xl font-semibold">Historical Data</h2>
          <p className="text-gray-400 text-sm">Temperature – Last 24 Hours</p>

          {/* Range Buttons */}
          <div className="flex gap-3 mt-4">
            {["1H", "6H", "24H", "7D", "Custom"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1 rounded-lg border ${
                  range === r ? "bg-blue-600" : "border-gray-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Fake chart box */}
          <div className="h-64 bg-black/30 rounded-lg mt-6 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Chart Placeholder</span>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Sensor Information */}
          <div className="bg-[#111827] p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Sensor Information</h3>
            <InfoRow label="Sensor ID" value="#SN-T456" />
            <InfoRow label="Model" value="TempGuard Pro" />
            <InfoRow label="Last Sync" value="2 mins ago" />
            <InfoRow label="Battery Level" value="87%" />
          </div>

          {/* Alert History */}
          <div className="bg-[#111827] p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Alert History</h3>

            <AlertItem
              type="critical"
              title="High Gas Level Detected"
              time="Today at 11:32 AM"
            />
            <AlertItem
              type="warning"
              title="Door Opened"
              time="Today at 11:15 AM"
            />
            <AlertItem
              type="safe"
              title="System Normal"
              time="Yesterday at 9:00 PM"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------ Reusable Components ------------ */

function StatCard({ label, value, status }) {
  const colors = {
    safe: "text-green-400 bg-green-400/10",
    warning: "text-yellow-400 bg-yellow-400/10",
    critical: "text-red-400 bg-red-400/10",
  };

  return (
    <div className="bg-[#111827] p-5 rounded-xl">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-300">{label}</span>
        <span className={`text-xs px-2 py-0.5 rounded-lg ${colors[status]}`}>
          {status[0].toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="text-3xl font-semibold">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1 border-b border-gray-800">
      <span className="text-gray-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function AlertItem({ type, title, time }) {
  const icons = {
    critical: "bg-red-500",
    warning: "bg-yellow-400",
    safe: "bg-green-400",
  };

  return (
    <div className="flex items-start gap-3 mb-4">
      <div className={`w-3 h-3 rounded-full mt-1 ${icons[type]}`}></div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-gray-400 text-sm">{time}</div>
      </div>
    </div>
  );
}
