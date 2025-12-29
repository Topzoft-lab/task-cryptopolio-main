import React, { useState } from "react";
import { API } from "../config/api";

export default function Signup({ closemod }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.text();

      if (data === "No such user found") {
        setError("Invalid email or password");
      } else {
        const json = JSON.parse(data);
        localStorage.setItem("authToken", json.authToken);
        closemod[1](false);
        window.location.reload();
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-950/90 backdrop-blur-sm"
        onClick={() => closemod[1](false)}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card p-8 animate-scale-in">
        {/* Close button */}
        <button
          onClick={() => closemod[1](false)}
          className="absolute top-4 right-4 text-dark-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-dark-400">Sign in to your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-xl text-accent-red text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              className="input"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-dark-900/50 rounded-xl border border-dark-700/50">
          <p className="text-dark-400 text-xs mb-2">Demo Credentials:</p>
          <p className="text-dark-300 text-sm font-mono">test@example.com / test12345</p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              closemod[0](true);
              closemod[1](false);
            }}
            className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
          >
            Don't have an account? <span className="font-medium">Sign Up</span>
          </button>
        </div>
      </div>
    </div>
  );
}
