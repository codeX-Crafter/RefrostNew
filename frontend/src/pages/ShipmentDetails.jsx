import React, { useState, useEffect } from "react";
import { Truck, MapPin, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";

export default function ShipmentDetails() {
  const [range, setRange] = useState("24H");
  const [sensors, setSensors] = useState({
    temp: "--",
    hum: "--",
    smoke: "--",
    vib: "--",
    door: "--",
    buzzer: "--",
  });

  const token = "W9fDZh-GwnxtdCVT4go9w7V8FigQWC4o";
  const SENSOR_URLS = {
    temp: `https://blynk.cloud/external/api/get?token=${token}&V0`,
    hum: `https://blynk.cloud/external/api/get?token=${token}&V2`,
    smoke: `https://blynk.cloud/external/api/get?token=${token}&V4`,
    vib: `https://blynk.cloud/external/api/get?token=${token}&V3`,
    door: `https://blynk.cloud/external/api/get?token=${token}&V1`,
    buzzer: `https://blynk.cloud/external/api/get?token=${token}&V5`,
  };

  const fetchSensors = async () => {
    try {
      const [temp, hum, smoke, vib, door, buzzer] = await Promise.all([
        fetch(SENSOR_URLS.temp).then((r) => r.text()),
        fetch(SENSOR_URLS.hum).then((r) => r.text()),
        fetch(SENSOR_URLS.smoke).then((r) => r.text()),
        fetch(SENSOR_URLS.vib).then((r) => r.text()),
        fetch(SENSOR_URLS.door).then((r) => r.text()),
        fetch(SENSOR_URLS.buzzer).then((r) => r.text()),
      ]);

      setSensors({
        temp: `${temp}°C`,
        hum: `${hum}%`,
        smoke: `${smoke} PPM`,
        vib: vib === "1" ? "Active" : "Inactive",
        door: door === "1" ? "Open" : "Closed",
        buzzer: buzzer === "1" ? "On" : "Off",
      });
    } catch (err) {
      console.error("Error fetching sensors:", err);
    }
  };

  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, 3000); // fetch every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* NAVBAR */}
      <Navbar isLoggedIn={true} />

      {/* MAIN CONTENT */}
      <div className="px-10 py-24">
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
        <div className="grid grid-cols-4 gap-4 mb-6">
          <CompactInfoCard label="Status" value="In Transit" dot="green" />
          <CompactInfoCard label="Origin" value="New York, USA" />
          <CompactInfoCard label="Destination" value="London, UK" />
          <CompactInfoCard label="Est. Arrival" value="July 25, 2024" />
        </div>

        {/* Sensor Summary */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard label="Temperature" value={sensors.temp} status="safe" />
          <StatCard label="Humidity" value={sensors.hum} status="safe" />
          <StatCard label="Door Status" value={sensors.door} status="warning" />
          <StatCard label="Gas Level" value={sensors.smoke} status="critical" />
        </div>

        {/* Attached Sensors + Journey Timeline */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Attached Sensors Table */}
          <div className="col-span-2 bg-[#111827] rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-1">
              Attached Sensors (4)
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Average real-time values from all sensors in the shipment.
            </p>

            <SensorTable sensors={sensors} />
          </div>

          {/* Journey Timeline */}
          <div className="bg-[#111827] rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-5">Journey Timeline</h3>

            <div className="relative pl-6">
              <TimelineStep
                icon={<Truck className="w-5 h-5 text-blue-400" />}
                title="In Transit"
                subtitle="Currently in Atlantic Ocean"
                date="July 22, 2024"
                active
              />

              <TimelineStep
                icon={<MapPin className="w-5 h-5 text-gray-300" />}
                title="Departed from Origin"
                subtitle="New York, USA"
                date="July 20, 2024"
              />

              <TimelineStep
                icon={<Calendar className="w-5 h-5 text-gray-300" />}
                title="Shipment Created"
                subtitle="New York, USA"
                date="July 19, 2024"
              />
            </div>
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
                  className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${
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
    </div>
  );
}

/* ---------------- Components ---------------- */

function CompactInfoCard({ label, value, dot }) {
  const dotColors = {
    green: "bg-green-400",
    red: "bg-red-400",
    yellow: "bg-yellow-400",
  };
  return (
    <div className="bg-[#111827] rounded-xl p-3 flex flex-col justify-center">
      <div className="text-xs text-gray-300 mb-1">{label}</div>
      <div className="flex items-center gap-2 text-sm font-semibold">
        {dot && (
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              dotColors[dot] || "bg-transparent"
            }`}
          ></span>
        )}
        <span className="text-sm">{value}</span>
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
    <div className="bg-[#111827] rounded-2xl p-5">
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-300 text-sm">{label}</span>
        <span className={`text-xs px-2 py-0.5 rounded-lg ${colorMap[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function SensorTable({ sensors }) {
  const sensorData = [
    { id: "#SN-T456", value: sensors.temp, status: "safe" },
    { id: "#SN-T457", value: sensors.hum, status: "safe" },
    { id: "#SN-H112", value: sensors.smoke, status: "critical" },
    {
      id: "#SN-D301",
      value: sensors.vib,
      status: sensors.vib === "Active" ? "warning" : "safe",
    },
  ];

  const badgeMap = {
    safe: "bg-green-900/40 text-green-300 border border-green-700",
    warning: "bg-yellow-900/40 text-yellow-300 border border-yellow-700",
    critical: "bg-red-900/40 text-red-300 border border-red-700",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-gray-400 border-b border-gray-800">
          <tr>
            <th className="pb-3 pr-6">Sensor ID</th>
            <th className="pb-3 pr-6">Value</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {sensorData.map((s) => (
            <tr
              key={s.id}
              className="border-b border-gray-800 hover:bg-[#161a1f]"
            >
              <td className="py-3 text-blue-300 font-semibold">{s.id}</td>
              <td className="py-3">{s.value}</td>
              <td className="py-3">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    badgeMap[s.status]
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      s.status === "safe"
                        ? "bg-green-400"
                        : s.status === "warning"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                  ></span>
                  {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TimelineStep({ icon, title, subtitle, date, active }) {
  return (
    <div className="relative mb-8 pl-6">
      <div className="absolute left-0 top-0 -ml-0.5">
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-full ${
            active ? "bg-blue-600" : "bg-[#0f172a]"
          }`}
        >
          {icon}
        </div>
      </div>
      <div className="ml-10">
        <div className="flex items-center justify-between">
          <div
            className={`font-semibold ${
              active ? "text-white" : "text-gray-200"
            }`}
          >
            {title}
          </div>
          <div className="text-gray-500 text-xs">{date}</div>
        </div>
        <div className="text-gray-400 text-sm mt-1">{subtitle}</div>
      </div>
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
