import { Routes, Route, Navigate } from "react-router-dom";
import ShipmentDetails from "./pages/ShipmentDetails";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import AlertsPage from "./pages/AlertsPage";
import ShipmentAnalytics from "./pages/ShipmentAnalytics";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/Dashboard"
        element={<Navigate replace to="/ShipmentDetails/main" />}
      />
      <Route path="/ShipmentDetails" element={<ShipmentDetails />} />
      <Route path="/ShipmentDetails/:id" element={<ShipmentDetails />} />
      <Route path="/Analytics" element={<ShipmentAnalytics />} />
      <Route path="/AlertsPage" element={<AlertsPage />} />
      <Route path="/Settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
