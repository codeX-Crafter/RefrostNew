import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  AlertCircle,
  Users,
  Package,
  Search,
  MapPin,
  Wifi,
  Battery,
  Thermometer,
  Clock,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [shipments] = useState([
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
    },
  ]);

  const filteredShipments = shipments.filter((s) =>
    s.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <Navbar isLoggedIn={true} />

      <main className="max-w-[1600px] mx-auto p-6 pt-24 space-y-8">
        {/* HEADER SECTION */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Logistics Overview
            </h1>
            <p className="text-slate-400 mt-1">
              Real-time monitoring of global cold chain assets.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              System Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-emerald-500">
                Operational
              </span>
            </div>
          </div>
        </header>

        {/* TOP METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatusCard
              label="Active Shipments"
              value="317"
              trend="+12%"
              color="blue"
            />
            <StatusCard
              label="Delivered"
              value="892"
              trend="+4.2%"
              color="emerald"
            />
            <StatusCard label="At Risk" value="14" trend="-2" color="rose" />

            <MetricCard
              title="Total Alerts"
              value="52"
              icon={<AlertCircle size={20} />}
            />
            <MetricCard
              title="Pending"
              value="631"
              icon={<Package size={20} />}
            />
            <MetricCard
              title="Active Hubs"
              value="14"
              icon={<MapPin size={20} />}
            />
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Wifi size={16} className="text-slate-400" /> Device Health
            </h2>
            <div className="space-y-4 text-sm">
              <HealthRow label="Online" value="287" color="text-emerald-400" />
              <HealthRow label="Offline" value="12" color="text-rose-400" />
              <HealthRow label="Low Battery" value="8" color="text-amber-400" />
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500 uppercase tracking-wider">
                <span>Last Sync</span>
                <span>2 min ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: TABLE & ALERTS */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
          {/* MAIN TABLE */}
          <div className="xl:col-span-4 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-white">
                Live Shipment Tracking
              </h2>
              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <ShipmentTable shipments={filteredShipments} navigate={navigate} />
          </div>

          {/* ALERTS PANEL */}
          <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <AlertCircle size={20} className="text-rose-500" />
              Recent Incidents
            </h2>
            <div className="space-y-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              <AlertItem
                type="critical"
                title="Temp Spike"
                desc="ID-65432: 6.5°C"
                time="2m ago"
              />
              <AlertItem
                type="warning"
                title="Route Deviation"
                desc="ID-91245 delayed"
                time="45m ago"
              />
              <AlertItem
                type="critical"
                title="Security"
                desc="ID-11234 Door Opened"
                time="1h ago"
              />
              <AlertItem
                type="info"
                title="Checkpoint"
                desc="ID-77589: Suez Canal"
                time="3h ago"
              />
              <AlertItem
                type="warning"
                title="Power"
                desc="ID-84362: 15% Battery"
                time="5h ago"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

function StatusCard({ label, value, trend, color }) {
  const colors = {
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    rose: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  };
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-600 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded border ${colors[color]}`}
        >
          {trend}
        </span>
      </div>
      <div className="text-3xl font-bold text-white mt-2 group-hover:scale-105 transition-transform origin-left">
        {value}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:bg-slate-900 transition-all cursor-pointer">
      <div className="p-3 bg-slate-800 rounded-xl text-slate-300">{icon}</div>
      <div>
        <p className="text-slate-500 text-xs font-medium">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function HealthRow({ label, value, color }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}

function ShipmentTable({ shipments, navigate }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "In Transit":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Delayed":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "At Risk":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-950/50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-6 py-4">Shipment ID</th>
            <th className="px-6 py-4">Route</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Conditions</th>
            <th className="px-6 py-4">Timeline</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {shipments.map((s) => (
            <tr
              key={s.id}
              onClick={() => navigate(`/ShipmentDetails/${s.id}`)}
              className="group hover:bg-slate-800/30 transition-all cursor-pointer"
            >
              <td className="px-6 py-4">
                <span className="text-blue-400 font-bold font-mono text-sm">
                  {s.id}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    {s.origin}
                  </span>
                  <span className="text-slate-500 text-xs">to {s.dest}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${getStatusStyle(s.status)}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${s.status === "In Transit" ? "bg-blue-400" : "bg-amber-400"}`}
                  ></span>
                  {s.status}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Thermometer size={14} className="text-slate-500" />{" "}
                    {s.temp}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Battery size={14} className="text-slate-500" /> {s.battery}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Clock size={12} /> ETA: {s.eta}
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    Updated {s.lastUpdate}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-500 group-hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AlertItem({ type, title, desc, time }) {
  const borderColors = {
    critical: "border-l-rose-500 bg-rose-500/5",
    warning: "border-l-amber-500 bg-amber-500/5",
    info: "border-l-blue-500 bg-blue-500/5",
  };
  return (
    <div
      className={`p-4 border-l-4 rounded-r-xl mb-3 ${borderColors[type]} hover:bg-slate-800/40 transition-colors cursor-pointer`}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-bold text-slate-200">{title}</h4>
        <span className="text-[10px] text-slate-500 font-medium">{time}</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">{desc}</p>
    </div>
  );
}
