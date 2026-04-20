import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  BarChart3,
  Bell,
  Settings,
  User,
  X,
} from "lucide-react";

export default function Navbar({ isLoggedIn }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileImg = localStorage.getItem("profileImage");

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      to: "/ShipmentDetails/main",
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="w-4 h-4" />,
      to: "/Analytics",
    },
    {
      label: "Alerts",
      icon: <Bell className="w-4 h-4" />,
      to: "/AlertsPage",
    },
  ];

  const isActive = (to) => {
    if (to === "/ShipmentDetails/main") {
      return location.pathname.startsWith("/ShipmentDetails");
    }
    return location.pathname === to;
  };

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-40 bg-[#07101c]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/image.png"
              alt="ReFrost Logo"
              className="w-10 h-10 rounded-2xl shadow-lg"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-lg font-semibold tracking-wide text-white">
                ReFrost
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Cold Chain Console
              </span>
            </div>
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/Settings")}
                className="p-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="p-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
                aria-label="Profile"
              >
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          ) : null}
        </div>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu overlay"
          />

          <aside className="relative ml-auto h-full w-80 max-w-xs bg-[#0a1724] border-l border-white/10 p-6 shadow-2xl">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-3">
                Control center
              </p>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.to);
                      setDrawerOpen(false);
                    }}
                    className={`w-full rounded-2xl px-4 py-3 text-left flex items-center gap-3 transition ${
                      isActive(item.to)
                        ? "bg-slate-900 border border-cyan-500/30 text-white"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-white/10 pt-5">
              <button
                onClick={() => {
                  navigate("/Settings");
                  setDrawerOpen(false);
                }}
                className="w-full rounded-2xl px-4 py-3 text-left flex items-center gap-3 text-slate-300 hover:bg-white/5 transition"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
