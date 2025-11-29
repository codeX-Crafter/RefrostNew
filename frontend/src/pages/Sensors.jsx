import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Search, User, Menu } from "lucide-react";

export default function Sensors() {
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [newSensor, setNewSensor] = useState({
    id: "",
    type: "",
    shipment: "",
  });

  const sensors = [
    {
      id: "SN-48291",
      status: "Active",
      battery: "95%",
      shipment: "SH-9338A",
      last: "2 mins ago",
      levelColor: "bg-green-400",
    },
    {
      id: "SN-50292",
      status: "Active",
      battery: "81%",
      shipment: "SH-2049B",
      last: "5 mins ago",
      levelColor: "bg-green-400",
    },
    {
      id: "SN-31383",
      status: "Low Battery",
      battery: "22%",
      shipment: "SH-5927C",
      last: "15 mins ago",
      levelColor: "bg-yellow-400",
    },
    {
      id: "SN-94214",
      status: "Inactive",
      battery: "54%",
      shipment: "Unassigned",
      last: "2 days ago",
      levelColor: "bg-gray-400",
    },
    {
      id: "SN-23955",
      status: "Active",
      battery: "76%",
      shipment: "SH-1094D",
      last: "8 mins ago",
      levelColor: "bg-green-400",
    },
  ];

  const navItem = "block py-1 transition cursor-pointer";
  const activeClass = "text-[#1C9CF6] font-semibold";
  const normalClass = "text-[#0A4A7A] hover:text-[#1C9CF6]";

  return (
    <div className="flex min-h-screen bg-[#F7FBFF]">
      {/* MOBILE SIDEBAR BTN */}
      <button
        onClick={() => setOpenSidebar(true)}
        className="md:hidden p-3 fixed top-4 left-4 z-[60] bg-white shadow-md rounded-lg"
      >
        <Menu size={22} />
      </button>

      {/* MOBILE SIDEBAR */}
      {openSidebar && (
        <div className="fixed inset-0 bg-black/40 z-50 flex">
          <aside className="bg-white w-60 p-6 shadow-lg">
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
          <div className="flex-1" onClick={() => setOpenSidebar(false)} />
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-60 bg-white/80 backdrop-blur-xl border-r border-[#CFE8FF] p-6 shadow-lg">
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOP NAV */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
          <h2 className="text-xl font-bold text-[#0A4A7A]">
            Sensor Management
          </h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search sensors..."
                className="pl-8 pr-3 py-2 rounded-lg border bg-white text-sm w-52 md:w-72"
              />
            </div>
            <Bell className="text-gray-500 cursor-pointer" />
            <User className="text-gray-500 cursor-pointer" size={26} />
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-4">
          <select className="border rounded-lg px-3 py-2 text-sm">
            <option>Status: All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Low Battery</option>
          </select>
          <select className="border rounded-lg px-3 py-2 text-sm">
            <option>Assignment: All</option>
            <option>Assigned</option>
            <option>Unassigned</option>
          </select>

          <button
            onClick={() => setOpenModal(true)}
            className="ml-auto bg-[#1C9CF6] text-white px-5 py-2 rounded-xl shadow-md hover:bg-[#0A72C2]"
          >
            + Register New Sensor
          </button>
        </div>

        {/* TABLE */}
        <div className="mx-6 bg-white border rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3"></th>
                <th className="p-3 text-left">Sensor ID</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Battery Level</th>
                <th className="p-3 text-left">Assigned Shipment</th>
                <th className="p-3 text-left">Last Seen</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sensors.map((s, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 font-medium">{s.id}</td>

                  <td className="p-3">
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          s.status === "Active"
                            ? "bg-green-500"
                            : s.status === "Low Battery"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      />
                      {s.status}
                    </span>
                  </td>

                  <td className="p-3 flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${s.levelColor}`}
                        style={{ width: s.battery }}
                      />
                    </div>
                    <span>{s.battery}</span>
                  </td>

                  <td className="p-3">{s.shipment}</td>
                  <td className="p-3">{s.last}</td>
                  <td className="p-3 text-[#1C9CF6] font-medium cursor-pointer">
                    Edit
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-3 text-gray-500 text-sm flex justify-between">
            <span>Showing 1-5 of 100</span>
            <div className="flex gap-2">
              <button className="border px-3 py-1 rounded-lg">Previous</button>
              <button className="border px-3 py-1 rounded-lg">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[70]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-[350px] md:w-[420px] p-6 rounded-2xl shadow-xl border border-[#D6ECFF]"
          >
            <h2 className="text-xl font-bold text-[#0A4A7A] mb-4">
              Register New Sensor
            </h2>

            <div className="space-y-4">
              <input
                className="w-full p-2 border rounded-lg"
                placeholder="Sensor ID"
                value={newSensor.id}
                onChange={(e) =>
                  setNewSensor({ ...newSensor, id: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded-lg"
                value={newSensor.type}
                onChange={(e) =>
                  setNewSensor({ ...newSensor, type: e.target.value })
                }
              >
                <option value="">Sensor Type</option>
                <option>Temperature</option>
                <option>Humidity</option>
                <option>Motion/Vibration</option>
              </select>
              <input
                className="w-full p-2 border rounded-lg"
                placeholder="Assign Shipment (optional)"
                value={newSensor.shipment}
                onChange={(e) =>
                  setNewSensor({ ...newSensor, shipment: e.target.value })
                }
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Sensor Registered:", newSensor);
                    setOpenModal(false);
                    setNewSensor({ id: "", type: "", shipment: "" });
                  }}
                  className="px-5 py-2 bg-[#1C9CF6] text-white rounded-lg"
                >
                  Register
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
