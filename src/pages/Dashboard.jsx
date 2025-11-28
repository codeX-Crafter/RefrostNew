import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="w-full h-screen bg-[#0b1623] text-white flex flex-col overflow-hidden">
      {/* NAVBAR (logged in) */}
      <Navbar isLoggedIn={true} />

      {/* MAIN GRID */}
      <div className="flex-1 grid grid-cols-12 gap-6 px-8 py-6 pt-24 select-none">
        {/* ========== LEFT SECTION (9 cols) ========== */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* TOP STATS ROW */}
          <div className="grid grid-cols-3 gap-5 transform -translate-x-4">
            {/* ACTIVE SHIPMENTS */}
            <div className="bg-[#122030] rounded-xl p-5 border border-white/10">
              <p className="text-blue-200 text-sm mb-2">Active Shipments</p>
              <h1 className="text-4xl font-semibold">1,204</h1>
            </div>

            {/* TEMPERATURE ALERTS */}
            <div className="bg-[#122030] rounded-xl p-5 border border-white/10">
              <p className="text-blue-200 text-sm mb-2">Temperature Alerts</p>
              <h1 className="text-4xl font-semibold">17</h1>
            </div>

            {/* AT-RISK ZONES */}
            <div className="bg-[#122030] rounded-xl p-5 border border-white/10">
              <p className="text-blue-200 text-sm mb-2">At-Risk Zones</p>
              <h1 className="text-4xl font-semibold">3</h1>
            </div>
          </div>

          {/* SEARCH + NEW SHIPMENT */}
          <div className="flex items-center justify-between mt-2">
            <input
              placeholder="Search shipments..."
              className="bg-[#0f1b29] rounded-lg px-4 py-2 w-[250px] border border-white/10 text-sm focus:outline-none"
            />
            <button className="bg-[#5fb9f2] text-[#07101c] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4aacdf] transition">
              + New Shipment
            </button>
          </div>

          {/* ACTIVE SHIPMENTS TABLE */}
          <div className="bg-[#122030] flex-1 rounded-xl p-5 border border-white/10 overflow-hidden">
            <h2 className="text-lg font-semibold mb-4">Active Shipments</h2>

            <table className="w-full text-sm">
              <thead className="text-blue-300 text-xs border-b border-white/10">
                <tr>
                  <th className="pb-2 text-left">Shipment ID</th>
                  <th className="pb-2 text-left">Origin</th>
                  <th className="pb-2 text-left">Destination</th>
                  <th className="pb-2 text-left">Status</th>
                  <th className="pb-2 text-left">Temp.</th>
                  <th className="pb-2 text-left">ETA</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {[
                  {
                    id: "#RF58923",
                    origin: "Miami, FL",
                    dest: "Atlanta, GA",
                    status: "In Transit",
                    color: "bg-green-600/30 text-green-300",
                    temp: "2.1°C",
                    eta: "2h 15m",
                  },
                  {
                    id: "#RF58922",
                    origin: "Seattle, WA",
                    dest: "Portland, OR",
                    status: "Delayed",
                    color: "bg-yellow-600/30 text-yellow-300",
                    temp: "3.5°C",
                    eta: "45m",
                  },
                  {
                    id: "#RF58921",
                    origin: "Denver, CO",
                    dest: "Houston, TX",
                    status: "In Transit",
                    color: "bg-green-600/30 text-green-300",
                    temp: "1.8°C",
                    eta: "8h 30m",
                  },
                  {
                    id: "#RF58919",
                    origin: "New York, NY",
                    dest: "Boston, MA",
                    status: "Delivered",
                    color: "bg-blue-600/30 text-blue-300",
                    temp: "2.5°C",
                    eta: "-",
                  },
                ].map((row, i) => (
                  <tr key={i} className="h-12">
                    <td>{row.id}</td>
                    <td>{row.origin}</td>
                    <td>{row.dest}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-md text-xs ${row.color}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>{row.temp}</td>
                    <td>{row.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== RIGHT SECTION (4 cols) ========== */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* LIVE SHIPMENTS MAP */}
          <div className="bg-[#122030] rounded-xl p-5 border border-white/10 flex flex-col items-center justify-center h-[300px]">
            <h2 className="text-lg font-semibold mb-4">Live Shipments Map</h2>

            <img
              src="/map-demo.png"
              className="w-full h-full rounded-xl object-cover"
              alt="map"
            />
          </div>

          {/* LIVE ALERTS */}
          <div className="bg-[#122030] rounded-xl p-5 border border-white/10 flex-1">
            <h2 className="text-lg font-semibold mb-4">Live Alerts</h2>

            <div className="text-blue-200 text-sm">
              • No critical alerts right now.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
