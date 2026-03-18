import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Stats", path: "/stats" },
    { name: "Trends & Scope", path: "/trends" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all"
        >
          NexusGenisis
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all transform hover:scale-105 ${
                location.pathname === link.path
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-indigo-600 transition-all p-2 hover:bg-indigo-50 rounded-lg"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-linear-to-br from-indigo-50 to-purple-50 border-t border-indigo-200 px-4 py-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`block px-5 py-3 text-sm font-semibold rounded-xl transition-all transform hover:scale-105 ${
                location.pathname === link.path
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-linear-to-r hover:from-indigo-100 hover:to-purple-100 hover:text-indigo-600 shadow-md"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}