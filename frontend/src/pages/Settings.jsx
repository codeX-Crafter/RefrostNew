import React, { useState } from "react";
import {
  Database,
  Wifi,
  Bell,
  Settings as SettingsIcon,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Settings() {
  const defaultValues = {
    tempLower: -10,
    tempUpper: 30,
    humidityLower: 20,
    humidityUpper: 60,
    gasLower: 0,
    gasUpper: 100,
    vibrationLower: 0,
    vibrationUpper: 50,
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
    language: "English (US)",
    timezone: "UTC +05:30",
  };

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("sensorSettings");
    return saved ? JSON.parse(saved) : defaultValues;
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const resetToDefault = () => {
    setSettings(defaultValues);
  };

  const saveChanges = () => {
    localStorage.setItem("sensorSettings", JSON.stringify(settings));
    console.log("Saved Settings:", settings);
    alert("Settings saved!");
  };

  const idealTemp =
    (Number(settings.tempLower) + Number(settings.tempUpper)) / 2;

  return (
    <div className="min-h-screen bg-[#07101c] text-white">
      <Navbar isLoggedIn={true} />

      <main className="max-w-6xl mx-auto px-6 lg:px-10 pt-24 pb-16 space-y-8">
        <header className="rounded-[32px] border border-white/10 bg-[#0d1724] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                System settings
              </p>
              <h1 className="text-4xl font-semibold mt-3">
                Shipment Monitoring Settings
              </h1>
            </div>
            <button
              onClick={saveChanges}
              className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              <SettingsIcon className="w-4 h-4" /> Save settings
            </button>
          </div>
          <p className="mt-4 text-slate-400 max-w-2xl">
            Configure thresholds, connectivity, and notification preferences for
            your single shipment tracking workflow.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-[#0b1728] p-6">
              <div className="flex items-center gap-3 mb-5">
                <Database className="w-5 h-5 text-cyan-300" />
                <h2 className="text-xl font-semibold">Threshold Settings</h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl bg-[#07101c] p-5 border border-white/10">
                  <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">
                    Temperature
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Lower (°C)"
                      value={settings.tempLower}
                      onChange={(value) => handleChange("tempLower", value)}
                    />
                    <Field
                      label="Upper (°C)"
                      value={settings.tempUpper}
                      onChange={(value) => handleChange("tempUpper", value)}
                    />
                  </div>
                  <div className="mt-5 rounded-3xl bg-white/5 p-4 border border-white/10">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Ideal temperature
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {idealTemp.toFixed(1)}°C
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#07101c] p-5 border border-white/10">
                  <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">
                    Humidity
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Lower (%)"
                      value={settings.humidityLower}
                      onChange={(value) => handleChange("humidityLower", value)}
                    />
                    <Field
                      label="Upper (%)"
                      value={settings.humidityUpper}
                      onChange={(value) => handleChange("humidityUpper", value)}
                    />
                  </div>
                  <div className="rounded-3xl bg-[#07101c] p-5 border border-white/10">
                    <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">
                      CO2 Level
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        label="Lower (ppm)"
                        value={settings.gasLower}
                        onChange={(value) => handleChange("gasLower", value)}
                      />
                      <Field
                        label="Upper (ppm)"
                        value={settings.gasUpper}
                        onChange={(value) => handleChange("gasUpper", value)}
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl bg-[#07101c] p-5 border border-white/10">
                    <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">
                      Vibration
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        label="Lower"
                        value={settings.vibrationLower}
                        onChange={(value) =>
                          handleChange("vibrationLower", value)
                        }
                      />
                      <Field
                        label="Upper"
                        value={settings.vibrationUpper}
                        onChange={(value) =>
                          handleChange("vibrationUpper", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <Bell className="w-5 h-5 text-amber-300" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <div className="space-y-4">
                <ToggleRow
                  label="Email Alerts"
                  checked={settings.emailAlerts}
                  onChange={(checked) => handleChange("emailAlerts", checked)}
                />
                <ToggleRow
                  label="SMS Alerts"
                  checked={settings.smsAlerts}
                  onChange={(checked) => handleChange("smsAlerts", checked)}
                />
                <ToggleRow
                  label="Push Notifications"
                  checked={settings.pushAlerts}
                  onChange={(checked) => handleChange("pushAlerts", checked)}
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-[#0b1728] p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-sky-300" />
                <h3 className="text-lg font-semibold">Connectivity</h3>
              </div>
              <StatusCard
                label="MQTT Broker"
                value="broker.hivemq.com"
                status="Connected"
              />
              <StatusCard
                label="WebSocket"
                value="wss://broker.hivemq.com:8884/mqtt"
                status="Live"
              />
              <StatusCard label="Firestore" value="Active" status="Synced" />
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#0b1728] p-6 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <h3 className="text-lg font-semibold">Preferences</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Language
                  </p>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className="mt-2 w-full rounded-2xl bg-[#07101c] border border-white/10 p-3 text-slate-200"
                  >
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Hindi</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Timezone
                  </p>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleChange("timezone", e.target.value)}
                    className="mt-2 w-full rounded-2xl bg-[#07101c] border border-white/10 p-3 text-slate-200"
                  >
                    <option>UTC +05:30</option>
                    <option>UTC</option>
                    <option>UTC -05:00</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={resetToDefault}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
            >
              Reset to defaults
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-slate-400">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-3xl border border-white/10 bg-[#07101c] p-4 text-white outline-none"
      />
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#07101c] px-4 py-4">
      <div>
        <h4 className="font-semibold text-white">{label}</h4>
        <p className="text-sm text-slate-400">
          Enable real-time alert delivery.
        </p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-14 h-7 rounded-full bg-slate-700 peer-checked:bg-cyan-500 transition" />
        <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-7" />
      </label>
    </div>
  );
}

function StatusCard({ label, value, status }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#07101c] p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
        {label}
      </p>
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-sm text-white">{value}</p>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
          {status}
        </span>
      </div>
    </div>
  );
}
