import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Card() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "inr",
              order: "market_cap_desc",
              per_page: 8,
              page: 1,
              sparkline: true,
            },
          }
        );
        setCoins(response.data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
      setLoading(false);
    };
    fetchCoins();
  }, []);

  const formatPrice = (price) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)}L`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-dark-700 rounded-full"></div>
              <div>
                <div className="h-4 w-20 bg-dark-700 rounded mb-2"></div>
                <div className="h-3 w-12 bg-dark-700 rounded"></div>
              </div>
            </div>
            <div className="h-6 w-24 bg-dark-700 rounded mb-2"></div>
            <div className="h-4 w-16 bg-dark-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {coins.map((coin, index) => (
        <Link
          key={coin.id}
          to={{ pathname: "/coin", hash: coin.name }}
          state={{ value: coin }}
          className="card p-5 hover:border-primary-500/30 hover:shadow-glow-sm transition-all duration-300 group animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-white text-sm group-hover:text-primary-400 transition-colors truncate">
                {coin.name}
              </h3>
              <p className="text-dark-500 text-xs uppercase">{coin.symbol}</p>
            </div>
          </div>

          {/* Price */}
          <div className="text-lg font-display font-bold text-white mb-1">
            {formatPrice(coin.current_price)}
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              coin.price_change_percentage_24h >= 0
                ? "text-secondary-400"
                : "text-accent-red"
            }`}
          >
            {coin.price_change_percentage_24h >= 0 ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </div>
        </Link>
      ))}
    </div>
  );
}
