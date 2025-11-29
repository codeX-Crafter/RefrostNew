import React, { useState } from "react";
import {
  Truck,
  AlertCircle,
  Users,
  Package,
  Search,
  MapPin,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const [shipments, setShipments] = useState([
    {
      id: "ID-84362",
      origin: "Rotterdam, NL",
      dest: "New York, US",
      status: "In Transit",
      temp: "4.5°C",
      eta: "2 days",
      lastUpdate: "12 min ago",
      battery: "82%",
      signal: "Strong",
      coords: [51.9225, 4.47917],
    },
    {
      id: "ID-91245",
      origin: "Los Angeles, US",
      dest: "Tokyo, JP",
      status: "Delayed",
      temp: "5.1°C",
      eta: "4 days",
      lastUpdate: "25 min ago",
      battery: "60%",
      signal: "Weak",
      coords: [34.0522, -118.2437],
    },
    {
      id: "ID-77589",
      origin: "Singapore, SG",
      dest: "London, UK",
      status: "In Transit",
      temp: "3.9°C",
      eta: "1 day",
      lastUpdate: "5 min ago",
      battery: "93%",
      signal: "Strong",
      coords: [1.3521, 103.8198],
    },
  ]);

  const filteredShipments = shipments.filter((s) =>
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 bg-[#0D1117] text-white">
      <Navbar />

      <div className="p-6 space-y-10">
        {/* ---------------- TOP GRID ---------------- */}
        <div className="grid grid-cols-4 gap-6 items-start">
          {/* STATUS CARDS (wider now) */}
          <div className="col-span-3 grid grid-cols-3 gap-4">
            <StatusCard label="Active Shipments" value="317" color="blue" />
            <StatusCard label="Delivered Shipments" value="892" color="green" />
            <StatusCard label="At Risk Shipments" value="14" color="red" />

            <MetricCard
              title="Total Alerts"
              value="52"
              color="bg-[#111827]"
              icon={<AlertCircle />}
            />
            <MetricCard
              title="Pending Deliveries"
              value="631"
              color="bg-[#111827]"
              icon={<Package />}
            />
            <MetricCard
              title="Active Hubs"
              value="14"
              color="bg-[#111827]"
              icon={<MapPin />}
            />
          </div>

          {/* SMALLER MAP */}
          <div className="col-span-1 bg-[#111827] rounded-2xl p-4 h-[220px]">
            <h2 className="text-sm font-semibold mb-3">Live Map</h2>

            <div className="w-full h-full rounded-xl overflow-hidden">
              <MapContainer center={[20, 0]} zoom={2} className="w-full h-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {shipments.map((s) => (
                  <Marker key={s.id} position={s.coords}>
                    <Popup>
                      <strong>{s.id}</strong> <br />
                      {s.origin} → {s.dest}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* ---------------- TABLE + ALERTS ---------------- */}
        <div className="grid grid-cols-5 gap-6">
          {/* TABLE */}
          <div className="col-span-4 bg-[#111827] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Active Shipments</h2>

              {/* SEARCH */}
              <div className="flex items-center bg-[#1a2332] px-3 py-2 rounded-lg">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search Shipment ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <ShipmentTable shipments={filteredShipments} />
          </div>

          {/* ALERTS */}
          <div className="col-span-1 bg-[#111827] p-6 rounded-2xl h-[380px] overflow-y-auto">
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
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function MetricCard({ title, value, icon, color }) {
  return (
    <div className={`${color} p-5 rounded-2xl flex items-center gap-4`}>
      <div>{icon}</div>
      <div>
        <div className="text-gray-400 text-xs mb-1">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function StatusCard({ label, value, color }) {
  const colorMap = {
    blue: "text-blue-400",
    green: "text-green-400",
    red: "text-red-400",
  };

  return (
    <div className="bg-[#111827] p-5 rounded-2xl flex flex-col items-center justify-center">
      <span className={`${colorMap[color]} font-bold text-2xl`}>{value}</span>
      <span className="text-gray-400 mt-1 text-xs">{label}</span>
    </div>
  );
}

function ShipmentTable({ shipments }) {
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
            <th className="pb-3">ID</th>
            <th className="pb-3">Origin</th>
            <th className="pb-3">Destination</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Temp</th>
            <th className="pb-3">ETA</th>
            <th className="pb-3">Last Update</th>
            <th className="pb-3">Battery</th>
            <th className="pb-3">Signal</th>
          </tr>
        </thead>

        <tbody>
          {shipments.map((s) => (
            <tr key={s.id} className="border-b border-gray-800">
              <td className="py-3">{s.id}</td>
              <td className="py-3">{s.origin}</td>
              <td className="py-3">{s.dest}</td>
              <td className="py-3">
                <span className={statusColors[s.status]}>{s.status}</span>
              </td>
              <td className="py-3">{s.temp}</td>
              <td className="py-3">{s.eta}</td>
              <td className="py-3">{s.lastUpdate}</td>
              <td className="py-3">{s.battery}</td>
              <td className="py-3">{s.signal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Alert({ type, title, subtitle, time }) {
  const typeColors = {
    critical: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  return (
    <div className="mb-4">
      <div className={`font-semibold ${typeColors[type]} text-sm`}>{title}</div>
      <div className="text-gray-400 text-xs">{subtitle}</div>
      <div className="text-gray-600 text-xs mt-1">{time}</div>
    </div>
  );
}
