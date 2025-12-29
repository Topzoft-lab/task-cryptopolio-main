import React from "react";
import { Link } from "react-router-dom";
import List from "./List";

// Feature icons
const PortfolioIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const TradeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const SecureIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const features = [
  {
    icon: PortfolioIcon,
    title: "Portfolio Tracking",
    description: "Monitor all your crypto assets in one place with real-time valuations and performance metrics."
  },
  {
    icon: TradeIcon,
    title: "Virtual Trading",
    description: "Practice trading strategies with virtual funds. No risk, all the experience."
  },
  {
    icon: ChartIcon,
    title: "Live Market Data",
    description: "Access real-time prices from CoinGecko with detailed charts and market analytics."
  },
  {
    icon: SecureIcon,
    title: "Secure & Private",
    description: "Your data is encrypted and protected. Trade with confidence and peace of mind."
  }
];

const stats = [
  { value: "100K+", label: "Virtual Trading Volume" },
  { value: "50+", label: "Cryptocurrencies" },
  { value: "Real-time", label: "Market Data" },
  { value: "24/7", label: "Platform Access" }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800/50 border border-dark-700/50 rounded-full mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-dark-300">Demo Platform for Educational Purposes</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white mb-6 animate-slide-up">
              Master Crypto
              <br />
              <span className="gradient-text">Portfolio Management</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto animate-slide-up delay-100">
              Track your assets, simulate trades, and learn portfolio management with our comprehensive crypto tracking platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
              <Link to="/market" className="btn-primary text-lg px-8 py-4 glow-primary">
                Explore Market
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in delay-300">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-dark-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Everything You Need to
              <span className="gradient-text"> Succeed</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Our platform provides all the tools you need to learn crypto trading and portfolio management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card p-6 hover:border-primary-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl flex items-center justify-center text-primary-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                Live Market
                <span className="gradient-text"> Overview</span>
              </h2>
              <p className="text-dark-400 max-w-xl">
                Track real-time prices of top cryptocurrencies. Data powered by CoinGecko API.
              </p>
            </div>
            <Link to="/market" className="btn-primary flex items-center gap-2">
              View All Markets
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Market list component */}
          <List />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
        <div className="absolute inset-0 bg-dark-950/80"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-dark-300 mb-8 text-lg">
            Join CryptoFolio today and experience professional-grade portfolio management tools.
          </p>
          <Link to="/market" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Get Started Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg font-display font-bold text-white">
                Crypto<span className="text-primary-400">Folio</span>
              </span>
            </div>
            <p className="text-dark-500 text-sm">
              © 2025 CryptoFolio. University Project - For Educational Purposes Only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
