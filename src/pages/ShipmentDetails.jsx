import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Droplet,
  Battery,
  Sun,
  MapPin,
  Calendar,
} from "lucide-react";

// Leaflet marker icon fix
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export default function Shipments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItem = "block py-1 transition cursor-pointer";
  const activeClass = "text-[#1C9CF6] font-semibold";
  const normalClass = "text-[#0A4A7A] hover:text-[#1C9CF6]";

  const position = [52.520008, 13.404954];
  const routePoints = [
    [38.7223, -9.1393],
    [52.520008, 13.404954],
  ];

  const metrics = [
    { title: "Current Temp", value: "4.5°C", change: "+0.2%", icon: Sun },
    { title: "Humidity", value: "82% RH", change: "-1.0%", icon: Droplet },
    { title: "Battery", value: "78%", change: "Stable", icon: Battery },
    { title: "Light", value: "0.1 lux", change: "+0.0%", icon: Sun },
  ];

  return (
    <div className="flex h-screen bg-[#EAF6FF]">
      {/* Mobile Sidebar Button */}
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

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto bg-gradient-to-b from-[#F7FBFF] to-[#E8F4FF]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">
              Shipment SH-458B2
            </h2>
            <p className="text-gray-500">
              Detailed environmental & route monitoring
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
            Export Report
          </button>
        </div>

        {/* Status Pills */}
        <div className="flex gap-3 mb-6 text-sm">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
            ✅ In Transit
          </span>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle size={15} /> Alert
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            Carrier: Global Freight
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-2xl shadow-md border border-blue-100"
            >
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <m.icon size={18} /> {m.title}
              </div>
              <div className="text-2xl font-bold text-blue-900">{m.value}</div>
              <div className="text-xs text-green-600">{m.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-4 mb-8 h-[400px]">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <MapPin size={18} /> Shipment Route
          </h3>
          <MapContainer
            center={position}
            zoom={5}
            scrollWheelZoom
            className="h-full rounded-xl"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}>
              <Popup>Shipment currently near Berlin</Popup>
            </Marker>
            <Polyline positions={routePoints} />
          </MapContainer>
        </div>

        {/* Info Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Calendar size={18} /> Shipment Info
          </h3>
          <div className="text-gray-700 space-y-1">
            <p>
              <strong>Origin:</strong> Lisbon, Portugal
            </p>
            <p>
              <strong>Destination:</strong> Berlin, Germany
            </p>
            <p>
              <strong>ETA:</strong> 2023-10-29
            </p>
            <p>
              <strong>Contents:</strong> Vaccines (Refrigerated)
            </p>
            <p>
              <strong>Sensor ID:</strong> SN-TEMP-987XYZ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
