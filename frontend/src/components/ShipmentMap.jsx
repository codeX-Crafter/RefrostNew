import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Clock3, Activity } from "lucide-react";

export default function ShipmentMap({
  position = [51.9225, 4.47917],
  eta = "—",
  speed = "—",
  lastUpdate = "—",
}) {
  return (
    <div className="bg-[#111827] rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.15)]">
      <div className="px-6 py-5 border-b border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Live Map</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time shipment location and route context.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
          <div className="rounded-2xl bg-white/5 p-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-300" />
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Coordinates
              </div>
              <div className="font-medium text-white">
                {position[0].toFixed(4)}, {position[1].toFixed(4)}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3 flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-slate-300" />
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                ETA
              </div>
              <div className="font-medium text-white">{eta}</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-300" />
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Speed
              </div>
              <div className="font-medium text-white">{speed}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[460px]">
        <MapContainer
          center={position}
          zoom={5}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>Shipment is here now</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="px-6 py-4 border-t border-white/10 bg-[#07101c] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-300">
        <div className="font-medium text-white">Last sync: {lastUpdate}</div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-white/5 px-3 py-2">
            Live routing
          </span>
          <span className="rounded-full bg-white/5 px-3 py-2">
            Secure stream
          </span>
        </div>
      </div>
    </div>
  );
}
