import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItem = "block py-1 transition cursor-pointer";
  const activeClass = "text-[#1C9CF6] font-semibold";
  const normalClass = "text-[#0A4A7A] hover:text-[#1C9CF6]";

  return (
    <div className="flex h-screen bg-[#EAF6FF]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-3 fixed top-4 left-4 z-50 bg-white shadow-md rounded-lg"
      >
        ☰
      </button>

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static z-40 w-60 h-full bg-white/80 backdrop-blur-xl border-r border-[#CFE8FF] p-6 shadow-lg transition-all`}
      >
        <div className="flex items-center gap-2 mb-8">
          <img src="/image.png" className="w-9 h-9 rounded" />
          <h2 className="text-2xl font-bold text-[#0A6FB7]">ReFrost</h2>
        </div>

        <nav className="space-y-4 font-medium">
          <NavLink
            to="/Dashboard"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : normalClass}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/Analytics"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : normalClass}`
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="/ShipmentDetails"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : normalClass}`
            }
          >
            Shipments
          </NavLink>
          <NavLink
            to="/Sensors"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : normalClass}`
            }
          >
            Sensors
          </NavLink>
          <NavLink
            to="/Settings"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : normalClass}`
            }
          >
            Settings
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 p-6 overflow-auto bg-gradient-to-b from-[#F7FBFF] to-[#E8F4FF]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A4A7A]">System Settings</h1>
          <div className="w-10 h-10 bg-[#CFE8FF] rounded-full border border-[#A9D8FF]" />
        </div>

        {/* Notification Controls */}
        <section className="bg-white/80 backdrop-blur-xl border border-[#CFE8FF] rounded-xl p-6 shadow mb-6">
          <h2 className="font-bold text-lg text-[#0A4A7A] mb-4">
            Notification Preferences
          </h2>

          {[
            "Email Alerts",
            "Push Notifications",
            "SMS Alerts",
            "Critical Alert Priority",
            "Device Offline Alerts",
          ].map((s) => (
            <label
              key={s}
              className="flex justify-between py-2 items-center text-[#0A4A7A]"
            >
              {s}
              <input
                type="checkbox"
                className="accent-[#1C9CF6] h-5 w-5"
                defaultChecked
              />
            </label>
          ))}
        </section>

        {/* Alert Thresholds */}
        <section className="bg-white/80 backdrop-blur-xl border border-[#CFE8FF] rounded-xl p-6 shadow mb-6">
          <h2 className="font-bold text-lg text-[#0A4A7A] mb-4">
            Alert Thresholds
          </h2>

          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-[#0A4A7A] mb-1">
                Max Temperature Threshold (°C)
              </p>
              <input
                type="range"
                min="0"
                max="15"
                className="w-full accent-[#1C9CF6]"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-[#0A4A7A] mb-1">
                Humidity Limit (%)
              </p>
              <input
                type="range"
                min="40"
                max="100"
                className="w-full accent-[#1C9CF6]"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-[#0A4A7A] mb-1">
                Light Sensitivity Level
              </p>
              <input
                type="range"
                min="1"
                max="10"
                className="w-full accent-[#1C9CF6]"
              />
            </div>
          </div>

          <button className="mt-4 px-4 py-2 bg-[#1C9CF6] text-white font-medium rounded-lg hover:bg-[#1480D1] transition">
            Update Thresholds
          </button>
        </section>

        {/* Security */}
        <section className="bg-white/80 backdrop-blur-xl border border-[#CFE8FF] rounded-xl p-6 shadow mb-6">
          <h2 className="font-bold text-lg text-[#0A4A7A] mb-4">
            Security & Access
          </h2>

          <button className="px-4 py-2 bg-[#ff4b4b] text-white rounded-lg font-medium hover:bg-[#e53d3d] transition">
            Reset Password
          </button>
        </section>

        {/* System */}
        <section className="bg-white/80 backdrop-blur-xl border border-[#CFE8FF] rounded-xl p-6 shadow">
          <h2 className="font-bold text-lg text-[#0A4A7A] mb-4">
            System Controls
          </h2>

          <label className="flex justify-between items-center py-2 text-[#0A4A7A]">
            Dark Mode
            <input type="checkbox" className="accent-[#1C9CF6] h-5 w-5" />
          </label>

          <label className="flex justify-between items-center py-2 text-[#0A4A7A]">
            Auto Firmware Updates
            <input
              type="checkbox"
              className="accent-[#1C9CF6] h-5 w-5"
              defaultChecked
            />
          </label>

          <label className="flex justify-between items-center py-2 text-[#0A4A7A]">
            Data Sync
            <input
              type="checkbox"
              className="accent-[#1C9CF6] h-5 w-5"
              defaultChecked
            />
          </label>
        </section>
      </div>
    </div>
  );
}
