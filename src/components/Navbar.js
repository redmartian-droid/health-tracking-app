import { Trophy, Menu, X } from "lucide-react";
import { useState } from "react";
import { auth } from "../firebase/config";

import { useAuthState } from "react-firebase-hooks/auth";

export default function Navigation({
  currentPage,
  setCurrentPage,
  totalPoints,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user] = useAuthState(auth);

  const username = user?.displayName || user?.email || "User";

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-green-800 tracking-tight">
              Medicon
            </h1>
          </div>

          {/* Desktop Points - hidden on mobile */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-2 text-black px-4 py-2 rounded-full text-sm font-medium bg-gray-200">
              🏆
              <span>{totalPoints} pts</span>
            </div>

            <button
              onClick={() => setCurrentPage("settings")}
              className="flex items-center gap-3"
            >
              <img
                src="/userIcon.png"
                alt="Settings"
                className="ml-8 w-8 h-8 cursor-pointer"
              />

              <span className="text-sm font-medium text-gray-700">
                {username}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 py-4">
            {/* Mobile Points */}
            <div className="flex  mb-4">
              <div className="flex items-center gap-2 bg-white-900 text-black px-4 py-2 rounded-full text-sm font-medium">
                🏆
                <span>{totalPoints} pts</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage("settings")}
              className="flex items-center gap-3"
            >
              <img
                src="/userIcon.png"
                alt="Settings"
                className="w-8 h-8 cursor-pointer"
              />

              <span className="text-sm font-medium text-gray-700">
                {username}
              </span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
