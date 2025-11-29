import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function Settings() {
  // -------- DEFAULT VALUES --------
  const defaultValues = {
    tempLower: -10,
    tempUpper: 30,
    humidityLower: 20,
    humidityUpper: 60,
    emailAlerts: true,
    smsAlerts: false,
    language: "English (US)",
  };

  // -------- STATE --------
  const [settings, setSettings] = useState(defaultValues);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const resetToDefault = () => {
    setSettings(defaultValues);
  };

  const saveChanges = () => {
    console.log("Saved Settings:", settings);
    alert("Settings saved!");
  };

  // Ideal temp auto-calculated from lower/upper
  const idealTemp = (Number(settings.tempLower) + Number(settings.tempUpper)) / 2;

  return (
    <div className="w-full min-h-screen bg-[#08121f] text-white flex flex-col">
      {/* NAVBAR SAME AS DASHBOARD */}
      <Navbar isLoggedIn={true} />

      <div className="w-full max-w-5xl mx-auto pt-24 pb-16 px-6 space-y-10">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-semibold">Sensor & App Settings</h1>

        {/* ---------------- SENSOR SETTINGS ---------------- */}
        <div className="bg-[#0d1b2a] p-6 rounded-xl border border-gray-700 space-y-6">

          <h2 className="text-xl font-semibold">Sensor Thresholds</h2>

          {/* TEMPERATURE */}
          <div className="bg-[#0b1728] p-4 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold">Temperature</h3>
            <p className="text-gray-400 text-sm mb-4">
              Set acceptable temperature limits for your sensors.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm">Lower Threshold (°C)</label>
                <input
                  type="number"
                  value={settings.tempLower}
                  onChange={(e) => handleChange("tempLower", e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-[#08121f] border border-gray-700"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Upper Threshold (°C)</label>
                <input
                  type="number"
                  value={settings.tempUpper}
                  onChange={(e) => handleChange("tempUpper", e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-[#08121f] border border-gray-700"
                />
              </div>
            </div>

            {/* IDEAL TEMP — NO SLIDER */}
            <div className="mt-6 bg-[#08121f] p-3 rounded-lg border border-gray-700">
              <p className="text-gray-300 text-sm">Ideal Temperature (Auto Calculated)</p>
              <p className="text-xl font-semibold mt-1">{idealTemp.toFixed(1)}°C</p>
            </div>
          </div>

          {/* HUMIDITY */}
          <div className="bg-[#0b1728] p-4 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold">Humidity</h3>
            <p className="text-gray-400 text-sm mb-4">
              Configure acceptable humidity levels.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm">Lower Threshold (%)</label>
                <input
                  type="number"
                  value={settings.humidityLower}
                  onChange={(e) => handleChange("humidityLower", e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-[#08121f] border border-gray-700"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Upper Threshold (%)</label>
                <input
                  type="number"
                  value={settings.humidityUpper}
                  onChange={(e) => handleChange("humidityUpper", e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-[#08121f] border border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-2">
            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              Reset to Default
            </button>

            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* ---------------- NOTIFICATIONS ---------------- */}
        <div className="bg-[#0d1b2a] p-6 rounded-xl border border-gray-700 space-y-6">
          <h2 className="text-xl font-semibold">Notifications</h2>

          <div className="bg-[#0b1728] p-4 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold">Alert Preferences</h3>
            <p className="text-gray-400 text-sm mb-4">
              Choose how alerts are delivered when thresholds are breached.
            </p>

            {/* EMAIL ALERTS */}
            <div className="flex items-center justify-between py-3">
              <span>Email Alerts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.emailAlerts}
                  onChange={(e) => handleChange("emailAlerts", e.target.checked)}
                />
                <div
                  className="
                    w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4
                    peer-focus:ring-blue-800 peer-checked:bg-blue-500
                    after:content-[''] after:absolute after:top-0.5 after:left-[4px]
                    after:bg-white after:border-gray-300 after:border 
                    after:rounded-full after:h-5 after:w-5 
                    after:transition-all peer-checked:after:translate-x-full
                  "
                ></div>
              </label>
            </div>

            {/* SMS ALERTS */}
            <div className="flex items-center justify-between py-3">
              <span>SMS Alerts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.smsAlerts}
                  onChange={(e) => handleChange("smsAlerts", e.target.checked)}
                />
                <div
                  className="
                    w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4
                    peer-focus:ring-blue-800 peer-checked:bg-blue-500
                    after:content-[''] after:absolute after:top-0.5 after:left-[4px]
                    after:bg-white after:border-gray-300 after:border 
                    after:rounded-full after:h-5 after:w-5 
                    after:transition-all peer-checked:after:translate-x-full
                  "
                ></div>
              </label>
            </div>
          </div>
        </div>

        {/* ---------------- GENERAL ---------------- */}
        <div className="bg-[#0d1b2a] p-6 rounded-xl border border-gray-700 space-y-6">
          <h2 className="text-xl font-semibold">General</h2>

          <div className="bg-[#0b1728] p-4 rounded-xl border border-gray-700 space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="mt-1 p-2 bg-[#08121f] rounded-lg border border-gray-700"
              >
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Hindi</option>
                <option>German</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
