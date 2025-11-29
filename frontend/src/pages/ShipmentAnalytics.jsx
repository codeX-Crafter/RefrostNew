import React, { useState } from "react";
import {
  Thermometer,
  Droplets,
  Lock,
  Zap,
  AlertCircle,
  MapPin,
  Sun,
} from "lucide-react";

export default function ShipmentAnalytics() {
  const [range, setRange] = useState("24H");

  const sensorData = [
    {
      name: "Temperature",
      status: "Normal",
      value: "4.5°C",
      icon: <Thermometer className="w-6 h-6" />,
      bgColor: "bg-blue-600",
    },
    {
      name: "Humidity",
      status: "Normal",
      value: "62%",
      icon: <Droplets className="w-6 h-6" />,
      bgColor: "bg-green-600",
    },
    {
      name: "Door Status",
      status: "Alert",
      value: "Closed",
      icon: <Lock className="w-6 h-6" />,
      bgColor: "bg-purple-600",
    },
    {
      name: "Gas Level",
      status: "Normal",
      value: "5 ppm",
      icon: <Zap className="w-6 h-6" />,
      bgColor: "bg-orange-600",
    },
    {
      name: "Vibration",
      status: "Warning",
      value: "0.8g",
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: "bg-yellow-600",
    },
    {
      name: "GPS",
      status: "Normal",
      value: "Online",
      icon: <MapPin className="w-6 h-6" />,
      bgColor: "bg-teal-600",
    },
    {
      name: "Light",
      status: "Normal",
      value: "Dark",
      icon: <Sun className="w-6 h-6" />,
      bgColor: "bg-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white p-8 space-y-8">
      {/* Main Heading */}
      <h1 className="text-3xl font-bold mb-4">Shipment Analysis</h1>

      {/* Sensor Health Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {sensorData.map((sensor, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl flex flex-col justify-between ${sensor.bgColor}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{sensor.name}</span>
              {sensor.icon}
            </div>
            <div className="text-lg font-semibold">{sensor.value}</div>
            <div className="text-sm mt-1">{sensor.status}</div>
          </div>
        ))}
      </div>

      {/* Temperature Excursion Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#161b26] p-6 rounded-xl flex flex-col justify-between">
          <div className="font-semibold mb-2">Temperature Excursion Risk</div>
          <div className="flex items-center justify-center gap-10 mb-4">
            <div className="text-4xl font-bold text-red-600">68%</div>
            <div className="text-right">
              <div className="text-lg font-semibold">High Risk</div>
              <div className="text-gray-400 text-sm">Probability: High</div>
              <div className="text-gray-400 text-sm">Confidence: 95%</div>
            </div>
          </div>
          <div className="text-gray-300 text-sm mb-4">
            Immediate intervention required. Notify driver and check
            refrigeration unit.
          </div>
          <button className="text-blue-400 underline text-sm self-start">
            Full Scenario Analysis
          </button>
        </div>

        {/* Sensor Correlation Matrix */}
        <div className="bg-[#161b26] p-6 rounded-xl">
          <div className="font-semibold mb-2">Sensor Correlation Matrix</div>
          <div className="text-gray-400 text-sm mb-4">
            Impact of one sensor reading on another.
          </div>
          <img
            src="/corr.png"
            alt="correlation matrix"
            className="w-full max-h-80 object-contain rounded"
          />
        </div>
      </div>

      {/* 24-Hour Event Timeline */}
      <div className="bg-[#161b26] p-6 rounded-xl">
        <div className="font-semibold mb-4">24-Hour Event Timeline</div>
        <img
          src="/event-timeline.png"
          alt="event timeline"
          className="w-full h-64 object-contain"
        />
      </div>
    </div>
  );
}
