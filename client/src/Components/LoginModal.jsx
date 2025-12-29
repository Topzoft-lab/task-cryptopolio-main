import React, { useState } from "react";
import { API } from "../config/api";

export default function LoginModal({ closemod }) {
  const [credentials, setCredentials] = useState({
    first_name: "",
    last_name: "",
    age: "",
    mob: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!credentials.first_name || !credentials.last_name || !credentials.email || !credentials.password) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (credentials.password.length < 5) {
      setError("Password must be at least 5 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API.signup, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();

      if (json.userexist) {
        setError("User already exists. Please sign in instead.");
      } else if (!json.success) {
        setError("Signup failed. Please check your details.");
      } else {
        localStorage.setItem("authToken", json.authToken);
        closemod[0](false);
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
        onClick={() => closemod[0](false)}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-card p-8 animate-scale-in">
        {/* Close button */}
        <button
          onClick={() => closemod[0](false)}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Create Account</h2>
          <p className="text-dark-400">Start your crypto journey today</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-xl text-accent-red text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">First Name *</label>
              <input
                type="text"
                name="first_name"
                value={credentials.first_name}
                onChange={onChange}
                className="input"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={credentials.last_name}
                onChange={onChange}
                className="input"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={credentials.age}
                onChange={onChange}
                className="input"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Mobile</label>
              <input
                type="tel"
                name="mob"
                value={credentials.mob}
                onChange={onChange}
                className="input"
                placeholder="+91 1234567890"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Email *</label>
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
            <label className="block text-sm font-medium text-dark-300 mb-2">Password *</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              className="input"
              placeholder="••••••••"
            />
            <p className="text-dark-500 text-xs mt-1">Minimum 5 characters</p>
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
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              closemod[1](true);
              closemod[0](false);
            }}
            className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
          >
            Already have an account? <span className="font-medium">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
