import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn }) {
  return (
    <nav className="w-full fixed top-0 left-0 z-30 bg-[#07101c]/40 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/image.png" className="w-10 h-10 rounded" />
          <h2 className="text-2xl font-semibold text-[#7ac9f4] tracking-wide">
            ReFrost
          </h2>
        </div>

        {/* Right side */}
        {isLoggedIn ? (
          // Logged-in: show profile
          <Link to="/profile">
            <img
              src="/profile.png"
              className="w-9 h-9 rounded-full border border-white/20 cursor-pointer hover:opacity-80 transition"
            />
          </Link>
        ) : (
          // Not logged in: show login / signup
          <div className="flex gap-4">
            <Link to="/login">
              <button className="px-4 py-2 text-sm text-blue-200 hover:text-white transition">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-5 py-2 rounded-md bg-[#7ac9f4] text-[#07101c] font-semibold hover:bg-[#68bde9] transition">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
