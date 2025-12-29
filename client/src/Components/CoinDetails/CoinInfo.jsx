import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CoinInfo({ state, open }) {
  const navigate = useNavigate();
  const data = state.value;
  const [currency, setCurrency] = useState("INR");
  const login = localStorage.getItem("authToken");

  const formatPrice = (price, curr = currency) => {
    const convertedPrice = curr === "INR" ? (price / 100) * 70 : price / 100;
    return new Intl.NumberFormat(curr === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 2,
      maximumFractionDigits: convertedPrice < 1 ? 6 : 2,
    }).format(convertedPrice);
  };

  const formatMarketCap = (cap) => {
    const convertedCap = currency === "INR" ? (cap / 100) * 70 : cap / 100;
    if (convertedCap >= 1e12) return `${(convertedCap / 1e12).toFixed(2)}T`;
    if (convertedCap >= 1e9) return `${(convertedCap / 1e9).toFixed(2)}B`;
    return `${(convertedCap / 1e6).toFixed(2)}M`;
  };

  const handleBuy = () => {
    if (login) {
      navigate("/transaction", { state: { data } });
    } else {
      open[1](true);
    }
  };

  const handleSell = () => {
    if (login) {
      navigate("/transactionSell", { state: { data } });
    } else {
      open[1](true);
    }
  };

  const priceChange = data.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <img 
              src={data.image} 
              alt={data.name} 
              className="w-16 h-16 md:w-20 md:h-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                {data.name}
              </h1>
              <p className="text-dark-400 uppercase text-lg">{data.symbol}</p>
            </div>
          </div>
          
          {/* Rank Badge */}
          <div className="badge-neutral text-lg px-4 py-2">
            Rank #{data.market_cap_rank}
          </div>
        </div>

        {/* Price Section */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <p className="text-dark-400 text-sm mb-1">Current Price</p>
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                {formatPrice(data.current_price)}
              </div>
              <div className={`flex items-center gap-2 ${isPositive ? 'text-secondary-400' : 'text-accent-red'}`}>
                {isPositive ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span className="text-lg font-semibold">
                  {Math.abs(priceChange).toFixed(2)}%
                </span>
                <span className="text-dark-500">(24h)</span>
              </div>
            </div>

            {/* Currency Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setCurrency("INR")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currency === "INR"
                    ? "bg-primary-500 text-white"
                    : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currency === "USD"
                    ? "bg-primary-500 text-white"
                    : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                }`}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-900/50 rounded-xl p-4">
            <p className="text-dark-400 text-sm mb-1">24h High</p>
            <p className="text-lg font-semibold text-secondary-400">
              {formatPrice(data.high_24h)}
            </p>
          </div>
          <div className="bg-dark-900/50 rounded-xl p-4">
            <p className="text-dark-400 text-sm mb-1">24h Low</p>
            <p className="text-lg font-semibold text-accent-red">
              {formatPrice(data.low_24h)}
            </p>
          </div>
          <div className="bg-dark-900/50 rounded-xl p-4">
            <p className="text-dark-400 text-sm mb-1">Market Cap</p>
            <p className="text-lg font-semibold text-white">
              {currency === "INR" ? "₹" : "$"}{formatMarketCap(data.market_cap)}
            </p>
          </div>
          <div className="bg-dark-900/50 rounded-xl p-4">
            <p className="text-dark-400 text-sm mb-1">24h Volume</p>
            <p className="text-lg font-semibold text-white">
              {currency === "INR" ? "₹" : "$"}{formatMarketCap(data.total_volume)}
            </p>
          </div>
        </div>

        {/* Trade Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleBuy}
            className="py-4 px-6 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-glow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Buy {data.symbol?.toUpperCase()}
          </button>
          <button
            onClick={handleSell}
            className="py-4 px-6 bg-gradient-to-r from-accent-red to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            Sell {data.symbol?.toUpperCase()}
          </button>
        </div>

        {/* Login prompt */}
        {!login && (
          <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl text-center">
            <p className="text-primary-300 text-sm">
              🔐 Please sign in to start trading
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
