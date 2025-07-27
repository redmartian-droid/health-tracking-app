import { Trophy, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation({ totalPoints }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Medicon
            </h1>
          </div>

          {/* Desktop Points - hidden on mobile */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-2 text-black px-4 py-2 rounded-full text-sm font-medium">
              <Trophy className="w-4 h-4 text-black-400" />
              <span>{totalPoints} pts</span>
            </div>
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
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 bg-white-900 text-black px-4 py-2 rounded-full text-sm font-medium">
                <Trophy className="w-4 h-4 text-black-400" />
                <span>{totalPoints} pts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
