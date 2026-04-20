import React, { useEffect, useMemo, useState } from "react";
import {
  Thermometer,
  Droplets,
  Zap,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Navbar from "../components/Navbar";
import { getRecentSensorLogs, getAlerts } from "../utils/firestoreService";
import { subscribeToTopic } from "../utils/mqttClient";

const palette = {
  temp: "#38bdf8",
  humidity: "#34d399",
  gas: "#fbbf24",
  vibration: "#a78bfa",
  safe: "#22c55e",
  alert: "#f87171",
};

export default function ShipmentAnalytics() {
  const [range, setRange] = useState("24H");
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const hours = range === "24H" ? 24 : range === "7D" ? 168 : 1;

    getRecentSensorLogs(hours).then((snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          time: d.timestamp.toDate().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: d.temperature,
          humidity: d.humidity,
          gas: d.gas,
          vibration: d.vibration || 0,
          status: d.status || "SAFE",
        };
      });
      setLogs(data);
    });

    getAlerts().then((snapshot) => {
      const alertData = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          description: d.description || "Alert event",
          status: d.status || "Open",
          severity: d.severity || "Info",
          timestamp: d.timestamp
            ? d.timestamp.toDate().toLocaleString()
            : "Unknown",
        };
      });
      setAlerts(alertData);
    });
  }, [range]);

  useEffect(() => {
    const unsubSensors = subscribeToTopic("shipment/main/sensors", (data) => {
      const entry = {
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperature: data.temperature,
        humidity: data.humidity,
        gas: data.gas,
        vibration: data.vibration || 0,
        status: data.status || "SAFE",
      };
      setLogs((prev) => [...prev.slice(-23), entry]);
    });

    const unsubAlerts = subscribeToTopic("shipment/main/alerts", (data) => {
      const alertPayload =
        typeof data === "string"
          ? {
              description: data,
              status: data.toLowerCase().includes("alert") ? "Alert" : "Info",
              severity: "Warning",
              timestamp: new Date().toLocaleString(),
            }
          : data;
      setAlerts((prev) => [alertPayload, ...prev.slice(0, 9)]);
    });

    return () => {
      unsubSensors();
      unsubAlerts();
    };
  }, []);

  const avgTemperature = useMemo(() => {
    if (!logs.length) return "--";
    return `${(logs.reduce((sum, item) => sum + item.temperature, 0) / logs.length).toFixed(1)}°C`;
  }, [logs]);

  const avgHumidity = useMemo(() => {
    if (!logs.length) return "--";
    return `${(logs.reduce((sum, item) => sum + item.humidity, 0) / logs.length).toFixed(0)}%`;
  }, [logs]);

  const maxGas = useMemo(() => {
    if (!logs.length) return "--";
    return `${Math.max(...logs.map((item) => item.gas || 0))} ppm`;
  }, [logs]);

  const alertCount = alerts.length;
  const safeRuntime = useMemo(() => {
    if (!logs.length) return "--";
    const alertLogs = logs.filter((item) => item.status === "ALERT").length;
    const safePercent = Math.max(
      0,
      100 - Math.round((alertLogs / logs.length) * 100),
    );
    return `${safePercent}%`;
  }, [logs]);

  const chartData = logs.length
    ? logs
    : [
        {
          time: "--",
          temperature: 0,
          humidity: 0,
          gas: 0,
          vibration: 0,
          status: "SAFE",
        },
      ];

  const ratioData = [
    { name: "Safe", value: parseInt(safeRuntime) || 0, fill: palette.safe },
    {
      name: "Alerts",
      value: 100 - (parseInt(safeRuntime) || 0),
      fill: palette.alert,
    },
  ];

  const alertsBySeverity = useMemo(
    () =>
      alerts.reduce(
        (acc, alert) => {
          const key = alert.severity.toLowerCase();
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        { critical: 0, warning: 0, info: 0 },
      ),
    [alerts],
  );

  return (
    <div className="min-h-screen bg-[#07101c] text-white pb-20">
      <Navbar isLoggedIn={true} />

      <main className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-24 space-y-10">
        <section className="rounded-[32px] border border-white/10 bg-[#0d1724] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Single shipment analytics
              </p>
              <h1 className="text-4xl font-semibold mt-3">
                Shipment Intelligence
              </h1>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-white/5 px-5 py-3 text-sm text-slate-300">
              <BarChart3 className="w-5 h-5 text-cyan-300" />
              <span>Live stream analysis</span>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-slate-400">
            Monitor temperature, humidity, CO2, vibration, and alert trends with
            a premium enterprise-grade analytics view.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-5">
          {[
            {
              title: "Avg Temperature",
              value: avgTemperature,
              icon: <Thermometer className="w-5 h-5 text-cyan-300" />,
              accent: "text-cyan-300",
            },
            {
              title: "Avg Humidity",
              value: avgHumidity,
              icon: <Droplets className="w-5 h-5 text-emerald-300" />,
              accent: "text-emerald-300",
            },
            {
              title: "Max CO2",
              value: maxGas,
              icon: <Zap className="w-5 h-5 text-amber-300" />,
              accent: "text-amber-300",
            },
            {
              title: "Alerts",
              value: alertCount.toString(),
              icon: <AlertTriangle className="w-5 h-5 text-rose-300" />,
              accent: "text-rose-300",
            },
            {
              title: "Safe Runtime",
              value: safeRuntime,
              icon: <ShieldCheck className="w-5 h-5 text-sky-300" />,
              accent: "text-sky-300",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-[#0d1724] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
            >
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-slate-200">
                  {item.icon}
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {item.title}
                </span>
              </div>
              <p className="text-3xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-[32px] border border-white/10 bg-[#0d1724] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Temperature Trend</h2>
                <p className="text-sm text-slate-400">
                  Last {range} of sensor data.
                </p>
              </div>
              <div className="flex gap-2">
                {["1H", "6H", "24H", "7D"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setRange(option)}
                    className={`rounded-3xl px-4 py-2 text-sm transition ${
                      range === option
                        ? "bg-cyan-500 text-slate-950"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke={palette.temp}
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0d1724] p-6">
            <h2 className="text-2xl font-semibold mb-4">Alert Severity</h2>
            <div className="space-y-4">
              {["critical", "warning", "info"].map((level) => (
                <div
                  key={level}
                  className="rounded-3xl border border-white/10 bg-[#07101c] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="capitalize text-sm text-slate-300">{level}</p>
                    <span className="text-lg font-semibold text-white">
                      {alertsBySeverity[level] || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-[#0d1724] p-6">
            <h2 className="text-2xl font-semibold mb-4">Humidity Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="humidity" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={palette.humidity}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor={palette.humidity}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    stroke={palette.humidity}
                    fill="url(#humidity)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0d1724] p-6">
            <h2 className="text-2xl font-semibold mb-4">CO2 Spikes</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gas"
                    stroke={palette.gas}
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-[32px] border border-white/10 bg-[#0d1724] p-6">
            <h2 className="text-2xl font-semibold mb-4">Vibration Activity</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="vibration"
                    stroke={palette.vibration}
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0d1724] p-6">
            <h2 className="text-2xl font-semibold mb-4">Safe vs Alert Ratio</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratioData}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {ratioData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {ratioData.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between rounded-3xl bg-[#07101c] px-4 py-3"
                >
                  <span className="text-sm text-slate-300">{entry.name}</span>
                  <span className="text-white font-semibold">
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#0d1724] p-6">
          <h2 className="text-2xl font-semibold mb-4">Insights</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            <InsightCard
              title="Sensor stability"
              value="High"
              description="Temperature and humidity remain within defined thresholds."
            />
            <InsightCard
              title="Alert velocity"
              value={`${alertCount} alerts`}
              description="New alerts are logged in real-time from the shipment feed."
            />
            <InsightCard
              title="Safety rating"
              value={safeRuntime}
              description="Safe runtime computed from last sensor window."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function InsightCard({ title, value, description }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#07101c] p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
        {title}
      </p>
      <p className="text-3xl font-semibold text-white mt-4">{value}</p>
      <p className="mt-3 text-sm text-slate-400">{description}</p>
    </div>
  );
}
