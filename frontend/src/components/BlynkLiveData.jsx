import { useEffect, useState } from "react";

export default function BlynkLiveData({ intervalMs = 1500 }) {
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://blynk.cloud/external/api/get?token=mqy39rcKh0yaO7Zi_vaHVAhG5Y28-MMt&v0&v2&v3&v4&v5"
      );
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching Blynk data", err);
    }
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, intervalMs);
    return () => clearInterval(i);
  }, []);

  const labels = [
    { name: "Temperature", key: "v0", unit: "°C" },
    { name: "Humidity", key: "v2", unit: "%" },
    { name: "Door Status", key: "v3", unit: "cm" },
    { name: "Smoke Level", key: "v4", unit: "ppm" },
    { name: "Tilt", key: "v5", unit: " " },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {labels.map((item, i) => (
        <div
          key={i}
          className="p-4 bg-white rounded-xl shadow border border-blue-100"
        >
          <p className="text-gray-600 text-sm">{item.name}</p>
          <p className="text-xl font-bold text-blue-700">
            {data[item.key] !== undefined ? data[item.key] : "--"} {item.unit}
          </p>
        </div>
      ))}
    </div>
  );
}
