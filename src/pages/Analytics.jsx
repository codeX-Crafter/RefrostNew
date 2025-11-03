import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Truck,
  PieChart,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";

// Leaflet fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("Last 7 days");

  const navItem = "block py-1 transition cursor-pointer";
  const activeClass = "text-[#1C9CF6] font-semibold";
  const normalClass = "text-[#0A4A7A] hover:text-[#1C9CF6]";

  return (
    <div className="flex h-screen bg-[#EAF6FF]">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-3 fixed top-4 left-4 z-50 bg-white shadow-md rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
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

      {/* Main */}
      <div className="flex-1 p-6 overflow-auto bg-gradient-to-b from-[#F7FBFF] to-[#E8F4FF]">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A4A7A]">
            Analytics Dashboard
          </h1>
          <div className="w-10 h-10 bg-[#CFE8FF] rounded-full border border-[#A9D8FF]" />
        </div>

        {/* Date Filter */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 mb-6 rounded-xl border border-blue-300 bg-white text-sm shadow-sm"
        >
          <option>Today</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Truck />, label: "Active Shipments", value: "182" },
            {
              icon: <TrendingUp />,
              label: "Avg Stability Score",
              value: "98%",
            },
            { icon: <BarChart3 />, label: "Temp Alerts", value: "12" },
            { icon: <PieChart />, label: "Battery Health OK", value: "94%" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-white/75 backdrop-blur-md border border-[#D6ECFF] shadow-sm hover:shadow-md flex items-center gap-4"
            >
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-gray-600">{item.label}</p>
                <p className="text-xl font-bold text-[#0A6FB7]">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trend + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white/80 p-6 rounded-2xl shadow-md border border-[#CFE8FF]"
          >
            <h3 className="font-semibold text-[#0A4A7A] mb-4">
              Environmental Trend Analysis
            </h3>
            <img
              src="/trend-chart.jpg"
              className="w-full h-[540px] rounded-xl object-cover"
            />
          </motion.div>

          {/* AI Insights — original text restored */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 p-6 rounded-2xl shadow-md border border-[#CFE8FF] space-y-4"
          >
            <h3 className="font-semibold text-[#0A4A7A] mb-3">
              AI-Driven Insights
            </h3>

            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-lg flex gap-2">
              <AlertTriangle size={18} /> Alert: 3 shipments on Route MIA → ORD
              are trending towards a temperature breach. Recommended action:
              Adjust reefer unit settings.
            </div>

            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-xl text-lg flex gap-2">
              <AlertTriangle size={18} /> Unusual vibration patterns detected
              for SHP-00452. Possible rough handling or equipment malfunction.
            </div>

            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-lg flex gap-2">
              <CheckCircle size={18} /> Fleet compliance is above 98% for the
              last 7 days. All monitored routes are within safe parameters.
            </div>
          </motion.div>
        </div>

        {/* Table + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Shipment Table */}
          <div className="bg-white/80 border border-[#CFE8FF] rounded-xl p-5 shadow">
            <h2 className="font-bold text-lg text-[#0A4A7A] mb-3">
              Shipment Health
            </h2>
            <table className="w-full text-sm">
              <thead className="bg-[#F3FAFF] text-[#0A4A7A] border-b border-[#D6ECFF]">
                <tr>
                  <th className="py-2 text-left">Shipment ID</th>
                  <th>Status</th>
                  <th>Temp</th>
                  <th>Battery</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["SHP-45823", "⚠ Risk", "8.4°C ↑", "82%"],
                  ["SHP-00452", "⚠ Vib Alert", "5.9°C", "91%"],
                  ["SHP-78322", "✅ Stable", "4.1°C", "88%"],
                ].map((r, i) => (
                  <tr key={i} className="border-b hover:bg-[#F3FAFF]">
                    {r.map((c, j) => (
                      <td key={j} className="py-2">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Live Map */}
          <div className="bg-white/80 border border-[#CFE8FF] rounded-xl p-5 shadow">
            <h2 className="font-bold text-lg text-[#0A4A7A] mb-3">
              Live Shipment Map
            </h2>
            <div className="rounded-xl overflow-hidden h-[280px]">
              <MapContainer
                center={[37.0902, -95.7129]}
                zoom={4}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[25.76, -80.18]}>
                  <Popup>Miami Shipment</Popup>
                </Marker>
                <Marker position={[34.05, -118.24]}>
                  <Popup>LA Shipment</Popup>
                </Marker>
                <Marker position={[40.71, -74.0]}>
                  <Popup>NY Shipment</Popup>
                </Marker>
                <Marker position={[41.87, -87.62]}>
                  <Popup>Chicago Shipment</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
