import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Thermometer,
  Droplets,
  Zap,
  Activity,
  ShieldAlert,
  Wifi,
  Clock3,
  MapPin,
  Bug,
} from "lucide-react";
import Navbar from "../components/Navbar";
import ShipmentMap from "../components/ShipmentMap";
import {
  subscribeToTopic,
  publishToTopic,
  getClientState,
} from "../utils/mqttClient";
import {
  saveSensorLog,
  saveLocationLog,
  saveAlert,
} from "../utils/firestoreService";

const statusAccent = {
  SAFE: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  ALERT: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  default: "bg-slate-700/40 text-slate-200 border border-slate-500/20",
};

export default function ShipmentDetails() {
  const { id } = useParams();
  const shipmentId = id || "main";
  const [overview, setOverview] = useState({
    status: "SAFE",
    route: "Rotterdam, NL → New York, US",
    eta: "2 days",
    connection: "Disconnected",
    lastUpdated: "—",
    battery: "82%",
  });
  const [metrics, setMetrics] = useState({
    temperature: "--",
    humidity: "--",
    gas: "--",
    vibration: "--",
    status: "SAFE",
  });
  const [location, setLocation] = useState({
    lat: 51.9225,
    lng: 4.47917,
    eta: "2 days",
    speed: "45 km/h",
    updated: "—",
  });
  const [activity, setActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showDebug, setShowDebug] = useState(false);

  const defaultSettings = {
    tempLower: -10,
    tempUpper: 30,
    humidityLower: 20,
    humidityUpper: 60,
    gasLower: 0,
    gasUpper: 100,
    vibrationLower: 0,
    vibrationUpper: 50,
  };

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("sensorSettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const pushActivity = (entry) => {
    setActivity((prev) => [entry, ...prev].slice(0, 8));
  };

  // Track active alerts to avoid duplicates
  const [activeAlerts, setActiveAlerts] = useState(new Set());

  const checkThresholdsAndAlert = (sensorData) => {
    const newAlerts = [];

    // Temperature check
    if (sensorData.temperature !== undefined) {
      const temp = parseFloat(sensorData.temperature);
      const alertKey = `temp_${temp < settings.tempLower ? "low" : "high"}`;

      if (temp < settings.tempLower && !activeAlerts.has(alertKey)) {
        const alert = {
          sensorType: "temperature",
          currentValue: temp,
          thresholdCrossed: `below ${settings.tempLower}°C`,
          severity: temp < settings.tempLower - 10 ? "Critical" : "Warning",
          description: `Temperature too low: ${temp}°C (below ${settings.tempLower}°C)`,
          device: "Temperature Sensor",
          timestamp: new Date(),
          status: "unresolved",
        };
        newAlerts.push(alert);
        setActiveAlerts((prev) => new Set([...prev, alertKey]));
      } else if (temp > settings.tempUpper && !activeAlerts.has(alertKey)) {
        const alert = {
          sensorType: "temperature",
          currentValue: temp,
          thresholdCrossed: `above ${settings.tempUpper}°C`,
          severity: temp > settings.tempUpper + 10 ? "Critical" : "Warning",
          description: `Temperature too high: ${temp}°C (above ${settings.tempUpper}°C)`,
          device: "Temperature Sensor",
          timestamp: new Date(),
          status: "unresolved",
        };
        newAlerts.push(alert);
        setActiveAlerts((prev) => new Set([...prev, alertKey]));
      } else if (
        temp >= settings.tempLower &&
        temp <= settings.tempUpper &&
        activeAlerts.has(alertKey)
      ) {
        // Temperature back to normal, remove from active alerts
        setActiveAlerts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(alertKey);
          return newSet;
        });
      }
    }

    // Humidity check
    if (sensorData.humidity !== undefined) {
      const humidity = parseFloat(sensorData.humidity);
      const alertKey = `humidity_${humidity < settings.humidityLower ? "low" : "high"}`;

      if (humidity < settings.humidityLower && !activeAlerts.has(alertKey)) {
        const alert = {
          sensorType: "humidity",
          currentValue: humidity,
          thresholdCrossed: `below ${settings.humidityLower}%`,
          severity:
            humidity < settings.humidityLower - 10 ? "Critical" : "Warning",
          description: `Humidity too low: ${humidity}% (below ${settings.humidityLower}%)`,
          device: "Humidity Sensor",
          timestamp: new Date(),
          status: "unresolved",
        };
        newAlerts.push(alert);
        setActiveAlerts((prev) => new Set([...prev, alertKey]));
      } else if (
        humidity > settings.humidityUpper &&
        !activeAlerts.has(alertKey)
      ) {
        const alert = {
          sensorType: "humidity",
          currentValue: humidity,
          thresholdCrossed: `above ${settings.humidityUpper}%`,
          severity:
            humidity > settings.humidityUpper + 10 ? "Critical" : "Warning",
          description: `Humidity too high: ${humidity}% (above ${settings.humidityUpper}%)`,
          device: "Humidity Sensor",
          timestamp: new Date(),
          status: "unresolved",
        };
        newAlerts.push(alert);
        setActiveAlerts((prev) => new Set([...prev, alertKey]));
      } else if (
        humidity >= settings.humidityLower &&
        humidity <= settings.humidityUpper &&
        activeAlerts.has(alertKey)
      ) {
        // Humidity back to normal, remove from active alerts
        setActiveAlerts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(alertKey);
          return newSet;
        });
      }
    }

    // Gas check
    if (sensorData.gas !== undefined) {
      const gas = parseFloat(sensorData.gas);
      const alertKey = "gas_high";

      if (gas > settings.gasUpper && !activeAlerts.has(alertKey)) {
        const alert = {
          sensorType: "gas",
          currentValue: gas,
          thresholdCrossed: `above ${settings.gasUpper} ppm`,
          severity: gas > settings.gasUpper + 50 ? "Critical" : "Warning",
          description: `CO2 level too high: ${gas} ppm (above ${settings.gasUpper} ppm)`,
          device: "CO2 Sensor",
          timestamp: new Date(),
          status: "unresolved",
        };
        newAlerts.push(alert);
        setActiveAlerts((prev) => new Set([...prev, alertKey]));
      } else if (gas <= settings.gasUpper && activeAlerts.has(alertKey)) {
        // Gas back to normal, remove from active alerts
        setActiveAlerts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(alertKey);
          return newSet;
        });
      }
    }

    // Vibration check
    if (sensorData.vibration !== undefined) {
      const vibration = parseFloat(sensorData.vibration);
      const alertKey = "vibration_high";

      if (vibration > settings.vibrationUpper && !activeAlerts.has(alertKey)) {
        const alert = {
          sensorType: "vibration",
          currentValue: vibration,
          thresholdCrossed: `above ${settings.vibrationUpper}`,
          severity:
            vibration > settings.vibrationUpper + 20 ? "Critical" : "Warning",
          description: `Vibration too high: ${vibration} (above ${settings.vibrationUpper})`,
          device: "Vibration Sensor",
          timestamp: new Date(),
          status: "unresolved",
        };
        newAlerts.push(alert);
        setActiveAlerts((prev) => new Set([...prev, alertKey]));
      } else if (
        vibration <= settings.vibrationUpper &&
        activeAlerts.has(alertKey)
      ) {
        // Vibration back to normal, remove from active alerts
        setActiveAlerts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(alertKey);
          return newSet;
        });
      }
    }

    // Save and display new alerts
    if (newAlerts.length > 0) {
      console.log("[ALERTS] New alerts generated:", newAlerts);
      newAlerts.forEach((alert) => {
        setAlerts((prev) => [alert, ...prev].slice(0, 6));
        saveAlert(alert);
        pushActivity({
          time: new Date().toLocaleTimeString(),
          title: "Alert triggered",
          description: alert.description,
          type: "alert",
        });
      });
    }
  };

  const testMqtt = () => {
    console.log(
      "[DEBUG] Testing MQTT with sample data that triggers alerts...",
    );
    const sampleData = {
      sensors: {
        temperature:
          Math.random() > 0.5 ? settings.tempLower - 5 : settings.tempUpper + 5, // Will trigger temp alert
        humidity:
          Math.random() > 0.5
            ? settings.humidityLower - 5
            : settings.humidityUpper + 5, // Will trigger humidity alert
        gas: settings.gasUpper + 20, // Will trigger gas alert
        vibration: settings.vibrationUpper + 10, // Will trigger vibration alert
      },
      status: "SAFE",
      location: {
        lat: 51.9225 + (Math.random() - 0.5) * 0.1,
        lng: 4.47917 + (Math.random() - 0.5) * 0.1,
        eta: "2 days",
        speed: Math.round(Math.random() * 80 + 20),
      },
    };

    console.log("[DEBUG] Test data:", sampleData.sensors);
    publishToTopic("shipment/main/sensors", sampleData.sensors);
    publishToTopic("shipment/main/status", { status: sampleData.status });
    publishToTopic("shipment/main/location", sampleData.location);
    publishToTopic("shipment/main/alerts", "Test alert - MQTT working");

    // Also check thresholds for test data
    checkThresholdsAndAlert(sampleData.sensors);
  };

  useEffect(() => {
    const unsubSensors = subscribeToTopic("shipment/main/sensors", (data) => {
      setMetrics((prev) => ({
        temperature:
          data.temperature !== undefined
            ? `${data.temperature}°C`
            : prev.temperature,
        humidity:
          data.humidity !== undefined ? `${data.humidity}%` : prev.humidity,
        gas: data.gas !== undefined ? `${data.gas} ppm` : prev.gas,
        vibration:
          data.vibration !== undefined ? `${data.vibration}` : prev.vibration,
        status: prev.status,
      }));
      setOverview((prev) => ({
        ...prev,
        connection: "Connected",
        lastUpdated: "Live",
      }));
      pushActivity({
        time: new Date().toLocaleTimeString(),
        title: "Sensor update",
        description: `Temp ${data.temperature}°C · Hum ${data.humidity}% · Gas ${data.gas} ppm`,
        type: "sensor",
      });
      saveSensorLog(data);

      // Check thresholds and generate alerts
      checkThresholdsAndAlert(data);
    });

    const unsubStatus = subscribeToTopic("shipment/main/status", (data) => {
      const statusValue =
        typeof data === "string" ? data : data.status || "SAFE";

      setMetrics((prev) => ({ ...prev, status: statusValue }));
      setOverview((prev) => ({
        ...prev,
        status: statusValue,
        eta: typeof data === "object" && data.eta ? data.eta : prev.eta,
        battery:
          typeof data === "object" && data.battery
            ? data.battery
            : prev.battery,
        lastUpdated: "Live",
      }));
      pushActivity({
        time: new Date().toLocaleTimeString(),
        title: "Status update",
        description: `System status changed to ${statusValue}`,
        type: "status",
      });
    });

    const unsubLocation = subscribeToTopic("shipment/main/location", (data) => {
      setLocation((prev) => ({
        lat: data.lat ?? prev.lat,
        lng: data.lng ?? prev.lng,
        eta: data.eta ?? prev.eta,
        speed: data.speed ?? prev.speed,
        updated: "Live",
      }));
      pushActivity({
        time: new Date().toLocaleTimeString(),
        title: "Location update",
        description: `New position ${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`,
        type: "location",
      });
      saveLocationLog(data);
    });

    const unsubAlerts = subscribeToTopic("shipment/main/alerts", (data) => {
      const payload =
        typeof data === "string"
          ? { description: data, severity: "Warning" }
          : data;
      setAlerts((prev) => [payload, ...prev].slice(0, 6));
      pushActivity({
        time: new Date().toLocaleTimeString(),
        title: "Alert triggered",
        description: payload.description || "New alert received",
        type: "alert",
      });
    });

    return () => {
      unsubSensors();
      unsubStatus();
      unsubLocation();
      unsubAlerts();
    };
  }, []);

  const metricCards = [
    {
      label: "Temperature",
      value: metrics.temperature,
      icon: <Thermometer className="w-5 h-5" />,
      note: "Live reading",
    },
    {
      label: "Humidity",
      value: metrics.humidity,
      icon: <Droplets className="w-5 h-5" />,
      note: "Humidity level",
    },
    {
      label: "CO2",
      value: metrics.gas,
      icon: <Zap className="w-5 h-5" />,
      note: "Air quality",
    },
    {
      label: "Vibration",
      value: metrics.vibration,
      icon: <Activity className="w-5 h-5" />,
      note: "Movement index",
    },
    {
      label: "Status",
      value: metrics.status,
      icon: <ShieldAlert className="w-5 h-5" />,
      note: "Safety state",
    },
  ];

  const statusBadge = statusAccent[overview.status] || statusAccent.default;

  return (
    <div className="min-h-screen bg-[#07101c] text-white pb-16">
      <Navbar isLoggedIn={true} />

      <main className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-24 space-y-8">
        <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-[#0d1724] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Shipment command center
                </p>
                <h1 className="text-4xl font-semibold tracking-tight mt-3">
                  Shipment {shipmentId}
                </h1>
                <p className="mt-3 text-slate-400 max-w-2xl">
                  Premium cold-chain monitoring for a single active shipment.
                  Live sensor telemetry, route monitoring, and alert handling in
                  one pane.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl bg-white/5 border border-white/10 px-5 py-4 w-full sm:w-auto">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Current status
                </span>
                <span
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold ${statusBadge}`}
                >
                  {overview.status}
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <InfoChip
                icon={<MapPin className="w-4 h-4 text-cyan-300" />}
                label="Route"
                value={overview.route}
              />
              <InfoChip
                icon={<Clock3 className="w-4 h-4 text-slate-300" />}
                label="ETA"
                value={overview.eta}
              />
              <InfoChip
                icon={<Wifi className="w-4 h-4 text-slate-300" />}
                label="Connection"
                value={overview.connection}
              />
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0d1724] p-6 grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Live summary
                </p>
                <h2 className="text-2xl font-semibold mt-2">
                  Telemetry in focus
                </h2>
              </div>
              <span className="text-sm text-slate-400">
                Updated {overview.lastUpdated}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SmallMetric label="Battery" value={overview.battery} />
              <SmallMetric label="Alerts" value={alerts.length.toString()} />
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#07101c] p-4 text-sm text-slate-300">
              <p className="font-medium text-white">Operations</p>
              <p className="mt-2 text-slate-400">
                This dashboard operates on a real-time MQTT feed and persists
                critical sensor logs into Firestore.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-5">
          {metricCards.map((card) => (
            <div
              key={card.label}
              className="rounded-[28px] border border-white/10 bg-[#0d1724] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.14)]"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="rounded-2xl bg-white/5 p-3 text-slate-200">
                  {card.icon}
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {card.note}
                </span>
              </div>
              <div className="text-3xl font-semibold text-white">
                {card.value}
              </div>
              <div className="mt-2 text-sm text-slate-400">{card.label}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="rounded-[32px] border border-white/10 bg-[#0d1724] p-6">
            <ShipmentMap
              position={[location.lat, location.lng]}
              eta={location.eta}
              speed={location.speed}
              lastUpdate={location.updated}
            />
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0d1724] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Activity feed
                </p>
                <h2 className="text-2xl font-semibold mt-2">Recent events</h2>
              </div>
              <span className="text-sm text-slate-400">Live stream</span>
            </div>
            <div className="space-y-4">
              {activity.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-slate-400">
                  Waiting for live telemetry…
                </div>
              ) : (
                activity.map((item, index) => (
                  <FeedItem key={`${item.time}-${index}`} event={item} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* DEBUG PANEL */}
        <section className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center gap-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 shadow-lg transition"
          >
            <Bug className="w-5 h-5" />
            Debug
          </button>

          {showDebug && (
            <div className="absolute bottom-16 right-0 w-96 rounded-2xl border border-white/20 bg-[#0d1724] p-6 shadow-xl space-y-4">
              <h3 className="font-semibold text-white">MQTT Diagnostics</h3>

              <div className="space-y-3 text-sm">
                {(() => {
                  const state = getClientState();
                  return (
                    <>
                      <div className="rounded-lg bg-[#07101c] p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full animate-pulse ${state.connected ? "bg-emerald-500" : "bg-red-500"}`}
                          />
                          <span className="text-slate-300 font-medium">
                            {state.connected ? "✓ Connected" : "✗ Disconnected"}
                          </span>
                        </div>
                        {state.reconnecting && (
                          <div className="text-amber-300 text-xs">
                            Reconnecting (attempt {state.connectionAttempts})...
                          </div>
                        )}
                        <div className="text-xs text-slate-400 font-mono break-all">
                          {state.brokerUrl}
                        </div>
                      </div>

                      <div className="rounded-lg bg-[#07101c] p-4">
                        <div className="text-xs text-slate-400 mb-2">
                          Active subscriptions
                        </div>
                        {state.topics.length > 0 ? (
                          <div className="space-y-1 text-xs text-slate-300 font-mono">
                            {state.topics.map((t) => (
                              <div key={t} className="flex items-center gap-2">
                                <span className="text-cyan-400">→</span> {t}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-xs">
                            No active subscriptions
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              <button
                onClick={testMqtt}
                className="w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium py-2 transition"
              >
                Send test data
              </button>

              <p className="text-xs text-slate-400 leading-relaxed">
                Click "Send test data" to publish sample MQTT messages to test
                the connection. Check DevTools Console for detailed logs.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function InfoChip({ icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#07101c] p-5">
      <div className="flex items-center gap-3 mb-3 text-slate-300">
        {icon}
        <span className="text-xs uppercase tracking-[0.3em]">{label}</span>
      </div>
      <p className="font-semibold text-white">{value}</p>
    </div>
  );
}

function SmallMetric({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#07101c] p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function FeedItem({ event }) {
  const tone =
    {
      sensor: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
      status: "bg-amber-500/10 border-amber-500/20 text-amber-300",
      location: "bg-sky-500/10 border-sky-500/20 text-sky-300",
      alert: "bg-rose-500/10 border-rose-500/20 text-rose-300",
    }[event.type] || "bg-slate-700/40 border-slate-500/20 text-slate-300";

  return (
    <div className={`rounded-3xl border px-4 py-4 ${tone}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-white">{event.title}</p>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          {event.time}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-200">{event.description}</p>
    </div>
  );
}
