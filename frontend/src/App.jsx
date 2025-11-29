import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ShipmentDetails from "./pages/ShipmentDetails";
import Analytics from "./pages/Analytics";
import Sensors from "./pages/Sensors";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import SensorDetails from "./pages/SensorDetails";

import AlertsPage from "./pages/AlertsPage";
import ShipmentAnalytics from "./pages/ShipmentAnalytics";

import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/ShipmentDetails" element={<ShipmentDetails />} />
      {/* <Route path="/SensorDetails" element={<SensorDetails />} /> */}
      <Route path="/Analytics" element={<ShipmentAnalytics />} />
      <Route path="/AlertsPage" element={<AlertsPage />} />
      <Route path="/Sensors" element={<Sensors />} />
      <Route path="/Settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      {/* Add more pages later */}
      {/* <Route path="/devices" element={<Devices />} /> */}
      {/* <Route path="/shipments" element={<Shipments />} /> */}
    </Routes>
  );
}

export default App;
