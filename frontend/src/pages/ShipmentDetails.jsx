import React, { useState } from "react";

export default function ShipmentDetails() {
  const [range, setRange] = useState("24H");

  return (
    <div className="min-h-screen bg-[#0D1117] text-white px-10 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-3">
        All Shipments / <span className="text-white">Shipment #SH123</span>
      </div>

      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-2">Shipment #SH123</h1>
      <p className="text-gray-400 mb-10">
        Real-time monitoring and summary of the shipment's journey.
      </p>

      {/* Shipment Info Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <InfoCard label="Status" value="In Transit" dot="green" />
        <InfoCard label="Origin" value="New York, USA" />
        <InfoCard label="Destination" value="London, UK" />
        <InfoCard label="Est. Arrival" value="July 25, 2024" />
      </div>

      {/* Sensor Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <StatCard label="Temperature" value="2.5°C" status="safe" />
        <StatCard label="Humidity" value="55% RH" status="safe" />
        <StatCard label="Door Status" value="Open" status="warning" />
        <StatCard label="Gas Level" value="98 PPM" status="critical" />
      </div>

      {/* Attached Sensors + Journey Timeline */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        {/* Attached Sensors Table */}
        <div className="col-span-2 bg-[#111827] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-1">Attached Sensors (4)</h2>
          <p className="text-gray-400 text-sm mb-4">
            Average real-time values from all sensors in the shipment.
          </p>

          <SensorTable />
        </div>

        {/* Journey Timeline */}
        <div className="bg-[#111827] rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-5">Journey Timeline</h3>

          <TimelineItem
            title="In Transit"
            desc="Currently in Atlantic Ocean"
            date="July 22, 2024"
          />
          <TimelineItem
            title="Departed from Origin"
            desc="New York, USA"
            date="July 20, 2024"
          />
          <TimelineItem
            title="Shipment Created"
            desc="New York, USA"
            date="July 19, 2024"
          />
        </div>
      </div>

      {/* Historical Data + Alert History */}
      <div className="grid grid-cols-3 gap-8">
        {/* Historical Data */}
        <div className="col-span-2 bg-[#111827] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold">Historical Data</h2>
          <p className="text-gray-400 text-sm">Temperature – Last 24 Hours</p>

          {/* Range Buttons */}
          <div className="flex gap-3 mt-5">
            {["1H", "6H", "24H", "7D", "Custom"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1.5 rounded-lg text-sm border 
                  ${
                    range === r
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-700 text-gray-300"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Placeholder Chart */}
          <div className="mt-6 h-[330px] bg-black/20 rounded-xl flex items-center justify-center">
            <span className="text-gray-500 text-sm">Chart Placeholder</span>
          </div>
        </div>

        {/* Alert History */}
        <div className="bg-[#111827] rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-5">Alert History</h3>

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
  );
}

/* ------------------ Components ------------------ */

function InfoCard({ label, value, dot }) {
  return (
    <div className="bg-[#111827] rounded-2xl p-6">
      <div className="text-gray-300 text-sm mb-1">{label}</div>
      <div className="flex items-center gap-2 text-xl font-semibold">
        {dot && <span className={`w-3 h-3 rounded-full bg-${dot}-500`}></span>}
        {value}
      </div>
    </div>
  );
}

function StatCard({ label, value, status }) {
  const colorMap = {
    safe: "text-green-400 bg-green-400/10",
    warning: "text-yellow-400 bg-yellow-400/10",
    critical: "text-red-400 bg-red-400/10",
  };

  return (
    <div className="bg-[#111827] rounded-2xl p-6">
      <div className="flex justify-between mb-2">
        <span className="text-gray-300 text-sm">{label}</span>
        <span className={`text-xs px-2 py-0.5 rounded-lg ${colorMap[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function SensorTable() {
  const sensors = [
    {
      id: "#SN-T456",
      temp: "2.5°C",
      hum: "55%",
      door: "Closed",
      gas: "12 PPM",
      status: "safe",
    },
    {
      id: "#SN-T457",
      temp: "3.1°C",
      hum: "52%",
      door: "Closed",
      gas: "15 PPM",
      status: "safe",
    },
    {
      id: "#SN-H112",
      temp: "8.9°C",
      hum: "48%",
      door: "Closed",
      gas: "20 PPM",
      status: "critical",
    },
    {
      id: "#SN-D301",
      temp: "2.8°C",
      hum: "56%",
      door: "Open",
      gas: "14 PPM",
      status: "warning",
    },
  ];

  const colorMap = {
    safe: "text-green-400",
    warning: "text-yellow-400",
    critical: "text-red-400",
  };

  return (
    <table className="w-full text-left text-sm">
      <thead className="text-gray-400 border-b border-gray-800">
        <tr>
          <th className="pb-2">Sensor ID</th>
          <th>Temperature</th>
          <th>Humidity</th>
          <th>Door Status</th>
          <th>Gas Level</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {sensors.map((s) => (
          <tr key={s.id} className="border-b border-gray-800">
            <td className="py-3 text-blue-400">{s.id}</td>
            <td>{s.temp}</td>
            <td>{s.hum}</td>
            <td>{s.door}</td>
            <td>{s.gas}</td>
            <td className={colorMap[s.status]}>
              {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TimelineItem({ title, desc, date }) {
  return (
    <div className="mb-6">
      <div className="font-semibold">{title}</div>
      <div className="text-gray-400 text-sm">{desc}</div>
      <div className="text-gray-500 text-xs mt-1">{date}</div>
    </div>
  );
}

function AlertItem({ type, title, time }) {
  const dotColor = {
    critical: "bg-red-500",
    warning: "bg-yellow-400",
    safe: "bg-green-400",
  };

  return (
    <div className="flex items-start gap-3 mb-4">
      <div className={`w-3 h-3 rounded-full mt-1 ${dotColor[type]}`}></div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-gray-400 text-sm">{time}</div>
      </div>
    </div>
  );
}
