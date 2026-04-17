import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const route = [
  [28.6139, 77.2090],
  [27.1767, 78.0081],
  [23.0225, 72.5714],
  [19.0760, 72.8777],
];

export default function ShipmentMap() {
  const [position, setPosition] = useState(route[0]);
  const [step, setStep] = useState(0);
  const [eta, setEta] = useState("4h 20m");
  const [speed, setSpeed] = useState("45 km/h");
  const [status, setStatus] = useState("On Route");

  useEffect(() => {
    // Later MQTT data will call:
// setPosition([lat, lng])
    const timer = setInterval(() => {
      setStep((prev) => {
        const next = prev < route.length - 1 ? prev + 1 : prev;

        setPosition(route[next]);
        setEta(`${4 - next}h ${20 + next * 5}m`);
        setSpeed(`${40 + next * 5} km/h`);

        return next;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#111827] rounded-2xl p-6 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 text-white">
        <h2 className="text-xl font-semibold">Live Route Tracking</h2>
        <div className="text-sm text-gray-400">{eta}</div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-sm text-white">
        <div className="bg-[#0f172a] p-2 rounded-lg">Status: {status}</div>
        <div className="bg-[#0f172a] p-2 rounded-lg">Speed: {speed}</div>
        <div className="bg-[#0f172a] p-2 rounded-lg">ETA: {eta}</div>
      </div>

      {/* Map */}
      <MapContainer
        center={position}
        zoom={5}
        style={{ height: "400px", width: "100%", borderRadius: "16px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position}>
          <Popup>Shipment Current Location</Popup>
        </Marker>

        <Polyline
          positions={route}
          pathOptions={{
            color: "#3b82f6",
            weight: 5,
            opacity: 0.9,
          }}
        />
      </MapContainer>
    </div>
  );
}