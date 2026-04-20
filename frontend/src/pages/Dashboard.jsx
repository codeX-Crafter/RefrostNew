import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wifi, WifiOff, Thermometer, Droplets, Zap, Lock } from "lucide-react";
import Navbar from "../components/Navbar";
import { subscribeToTopic } from "../utils/mqttClient";
import { getAlerts } from "../utils/firestoreService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [shipment, setShipment] = useState({
    id: "main",
    origin: "Rotterdam, NL",
    dest: "New York, US",
    status: "In Transit",
    temp: "--",
    humidity: "--",
    gas: "--",
    door: "Closed",
    eta: "2 days",
    lastUpdate: "Just now",
    battery: "82%",
    signal: "Strong",
    alerts: [],
    connectionStatus: "Disconnected",
  });

  useEffect(() => {
    const unsubSensors = subscribeToTopic("shipment/main/sensors", (data) => {
      setShipment((prev) => ({
        ...prev,
        temp: data.temperature ? `${data.temperature}°C` : prev.temp,
        humidity: data.humidity ? `${data.humidity}%` : prev.humidity,
        gas: data.gas ? `${data.gas} ppm` : prev.gas,
        door: data.door || prev.door,
        lastUpdate: "Live",
        connectionStatus: "Connected",
      }));
    });

    const unsubStatus = subscribeToTopic("shipment/main/status", (data) => {
      const statusText = typeof data === "string" ? data : data.status;
      setShipment((prev) => ({
        ...prev,
        status: statusText || prev.status,
        eta: typeof data === "object" && data.eta ? data.eta : prev.eta,
        battery:
          typeof data === "object" && data.battery
            ? data.battery
            : prev.battery,
      }));
    });

    const unsubAlerts = subscribeToTopic("shipment/main/alerts", (data) => {
      const alertPayload =
        typeof data === "string"
          ? { description: data, status: "Alert", severity: "warning" }
          : data;

      setShipment((prev) => ({
        ...prev,
        alerts: [alertPayload, ...prev.alerts.slice(0, 4)],
      }));
    });

    // Load recent alerts from Firestore
    getAlerts(5).then((snapshot) => {
      const alerts = snapshot.docs.map((doc) => doc.data());
      setShipment((prev) => ({ ...prev, alerts }));
    });

    return () => {
      unsubSensors();
      unsubStatus();
      unsubAlerts();
    };
  }, []);

  return (
    <div className="min-h-screen pt-24 bg-[#0D1117] text-white">
      <Navbar isLoggedIn={true} />

      <div className="p-6 space-y-10">
        {/* ---------------- TOP GRID ---------------- */}
        <div className="grid grid-cols-4 gap-6 items-start">
          {/* LIVE DATA CARDS */}
          <div className="col-span-3 grid grid-cols-4 gap-4">
            <MetricCard
              title="Temperature"
              value={shipment.temp}
              color="bg-[#111827]"
              icon={<Thermometer />}
            />
            <MetricCard
              title="Humidity"
              value={shipment.humidity}
              color="bg-[#111827]"
              icon={<Droplets />}
            />
            <MetricCard
              title="CO2 Level"
              value={shipment.gas}
              color="bg-[#111827]"
              icon={<Zap />}
            />
            <MetricCard
              title="Door Status"
              value={shipment.door}
              color="bg-[#111827]"
              icon={<Lock />}
            />
          </div>

          {/* CONNECTION STATUS */}
          <div className="col-span-1 bg-[#111827] rounded-2xl p-5 h-[220px]">
            <h2 className="text-sm font-semibold mb-4">Connection Status</h2>
            <div className="flex items-center gap-2 mb-4">
              {shipment.connectionStatus === "Connected" ? (
                <Wifi className="text-green-400" />
              ) : (
                <WifiOff className="text-red-400" />
              )}
              <span
                className={
                  shipment.connectionStatus === "Connected"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {shipment.connectionStatus}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Battery</span>
                <span className="text-white">{shipment.battery}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Signal</span>
                <span className="text-white">{shipment.signal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Update</span>
                <span className="text-white">{shipment.lastUpdate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- SHIPMENT CARD + ALERTS ---------------- */}
        <div className="grid grid-cols-3 gap-6">
          {/* SHIPMENT CARD */}
          <div
            className="col-span-2 bg-[#111827] rounded-2xl p-6 cursor-pointer hover:bg-[#1a2332] transition"
            onClick={() => navigate("/ShipmentDetails/main")}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Shipment {shipment.id}
                </h2>
                <p className="text-gray-400 text-sm">
                  {shipment.origin} → {shipment.dest}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm ${shipment.status === "In Transit" ? "bg-blue-500" : "bg-yellow-500"}`}
              >
                {shipment.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">ETA:</span> {shipment.eta}
              </div>
              <div>
                <span className="text-gray-400">Alerts:</span>{" "}
                {shipment.alerts.length}
              </div>
              <div>
                <span className="text-gray-400">Battery:</span>{" "}
                {shipment.battery}
              </div>
            </div>
          </div>

          {/* RECENT ALERTS */}
          <div className="col-span-1 bg-[#111827] p-6 rounded-2xl h-[200px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
            {shipment.alerts.length > 0 ? (
              shipment.alerts.slice(0, 3).map((alert, i) => {
                const timestamp = alert.timestamp
                  ? alert.timestamp.toDate
                    ? new Date(alert.timestamp.toDate()).toLocaleTimeString()
                    : new Date(alert.timestamp).toLocaleTimeString()
                  : "Now";

                return (
                  <Alert
                    key={i}
                    type={alert.severity?.toLowerCase() || "info"}
                    title={alert.description || alert.desc || "Alert"}
                    subtitle={alert.device || "System"}
                    time={timestamp}
                  />
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">No recent alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function MetricCard({ title, value, icon, color }) {
  return (
    <div
      className={`${color} p-5 rounded-2xl flex items-center gap-4 hover:scale-105 transition duration-300 cursor-pointer`}
    >
      <div>{icon}</div>
      <div>
        <div className="text-gray-400 text-xs mb-1">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function Alert({ type, title, subtitle, time }) {
  const typeColors = {
    critical: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
    safe: "text-green-400",
  };

  return (
    <div className="mb-4">
      <div
        className={`font-semibold ${typeColors[type] || "text-gray-200"} text-sm`}
      >
        {title}
      </div>
      <div className="text-gray-400 text-xs">{subtitle}</div>
      <div className="text-gray-600 text-xs mt-1">{time}</div>
    </div>
  );
}
