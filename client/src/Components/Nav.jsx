import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API } from "../config/api";

// Logo component
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>
    <span className="text-xl font-display font-bold text-white">
      Crypto<span className="text-primary-400">Folio</span>
    </span>
  </div>
);

export default function Nav({ open }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isLoggedIn = localStorage.getItem("authToken");

  const handleDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(API.dashboard, {
        method: "POST",
        body: JSON.stringify({ Token: localStorage.authToken }),
        headers: { "Content-type": "application/json" },
      });
      const json = await response.json();
      navigate("/dashboard", { state: { id: json.id } });
    } catch (error) {
      console.error("Dashboard error:", error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <Logo />
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => open[1](true)}
                  className="btn-ghost"
                >
                  Sign In
                </button>
                <button
                  onClick={() => open[0](true)}
                  className="btn-primary"
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                <Link to="/market" className="btn-ghost">
                  Market
                </Link>
                <button
                  onClick={handleDashboard}
                  disabled={loading}
                  className="btn-ghost"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Dashboard'
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
