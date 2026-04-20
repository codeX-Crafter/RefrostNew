import React, { useEffect, useMemo, useState } from "react";
import { Search, Bell, ShieldAlert, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import { getAlerts } from "../utils/firestoreService";

const severityOptions = ["All", "Critical", "Warning", "Info"];

export default function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    getAlerts().then((snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        const desc = d.description || "No description provided";
        const severity = d.severity
          ? String(d.severity).charAt(0).toUpperCase() +
            String(d.severity).slice(1)
          : "Info";
        const timestamp = d.timestamp
          ? d.timestamp.toDate
            ? d.timestamp.toDate().toLocaleString()
            : new Date(d.timestamp).toLocaleString()
          : "Unknown";

        return {
          timestamp,
          device: d.device || "System",
          desc,
          severity,
          status: d.status || "Open",
          action: d.action || "None",
        };
      });
      setAlerts(data);
    });
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.desc.toLowerCase().includes(search.toLowerCase()) ||
        alert.device.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity =
        activeFilter === "All" || alert.severity === activeFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [alerts, activeFilter, search]);

  const counts = useMemo(
    () => ({
      total: alerts.length,
      critical: alerts.filter((item) => item.severity === "Critical").length,
      warning: alerts.filter((item) => item.severity === "Warning").length,
      info: alerts.filter((item) => item.severity === "Info").length,
    }),
    [alerts],
  );

  const severityColors = {
    Critical: "bg-red-900/40 text-red-400 border border-red-700",
    Warning: "bg-yellow-900/40 text-yellow-400 border border-yellow-700",
    Info: "bg-slate-700 text-slate-300 border border-slate-600",
  };

  const statusColors = {
    Resolved: "bg-emerald-900/40 text-emerald-400 border border-emerald-700",
    Open: "bg-slate-700 text-slate-300 border border-slate-600",
  };

  return (
    <div className="min-h-screen bg-[#07101c] text-white pb-16">
      <Navbar isLoggedIn={true} />

      <main className="max-w-6xl mx-auto px-6 lg:px-10 pt-24 space-y-8">
        <header className="rounded-[32px] border border-white/10 bg-[#0d1724] p-8 shadow-[0_40px_110px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Alerts management
              </p>
              <h1 className="text-4xl font-semibold mt-3">Alert History</h1>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-white/5 px-5 py-3 text-sm text-slate-300">
              <Bell className="w-5 h-5 text-amber-300" />
              Live alert stream
            </div>
          </div>
          <p className="mt-4 text-slate-400">
            Search, filter, and review active and historical alerts for the
            single shipment operation.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-[#0d1724] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 text-slate-300">
                <Search className="w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search alerts, device IDs, keywords"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-none text-white outline-none placeholder:text-slate-500"
                />
              </div>
              <div className="flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-3">
                <Filter className="w-5 h-5 text-slate-300" />
                <span className="text-sm text-slate-300">
                  Filter by severity
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {severityOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setActiveFilter(option)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeFilter === option
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <CounterCard label="Total alerts" value={counts.total} />
              <CounterCard
                label="Critical"
                value={counts.critical}
                accent="rose"
              />
              <CounterCard
                label="Warnings"
                value={counts.warning}
                accent="amber"
              />
            </div>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-[#0d1724] p-6 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Quick actions
            </p>
            <div className="rounded-3xl bg-[#07101c] p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">
                Keep alert review focused
              </p>
              <p className="mt-2 text-slate-400">
                Use the search field and filters to narrow the latest active
                alerts, then drill into individual incidents.
              </p>
            </div>
          </aside>
        </section>

        <section className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-white/10 bg-[#0b1728] p-10 text-center text-slate-400">
              No alerts match your search and filter.
            </div>
          ) : (
            filteredAlerts.map((alert, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-white/10 bg-[#07101c] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-slate-300">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-500">
                        {alert.timestamp}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      {alert.desc}
                    </h2>
                    <p className="text-sm text-slate-400">
                      Source: {alert.device}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 text-right">
                    <span
                      className={`rounded-full px-3 py-2 text-xs font-semibold ${severityColors[alert.severity]}`}
                    >
                      {alert.severity}
                    </span>
                    <span
                      className={`rounded-full px-3 py-2 text-xs font-semibold ${statusColors[alert.status]}`}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

function CounterCard({ label, value, accent = "sky" }) {
  const accentMap = {
    sky: "bg-sky-500/10 text-sky-300 border border-sky-500/20",
    rose: "bg-rose-500/10 text-rose-300 border border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  };

  return (
    <div className={`rounded-[28px] p-5 ${accentMap[accent]}`}>
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
