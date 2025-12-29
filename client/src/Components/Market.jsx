import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TrendUpIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendDownIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

export default function Market() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "inr",
              order: "market_cap_desc",
              per_page: 100,
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

  const formatMarketCap = (cap) => {
    if (cap >= 1e12) return `₹${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `₹${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e7) return `₹${(cap / 1e7).toFixed(2)}Cr`;
    return `₹${(cap / 1e5).toFixed(2)}L`;
  };

  const filteredCoins = coins
    .filter((coin) =>
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price_high":
          return b.current_price - a.current_price;
        case "price_low":
          return a.current_price - b.current_price;
        case "change_high":
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case "change_low":
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        default:
          return b.market_cap - a.market_cap;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400 font-medium">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-20">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Cryptocurrency <span className="gradient-text">Market</span>
          </h1>
          <p className="text-dark-400">
            Real-time prices for {coins.length} cryptocurrencies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-4 mb-8 sticky top-20 z-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                <SearchIcon />
              </div>
          <input
            type="text"
                placeholder="Search by name or symbol..."
                className="input pl-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Sort */}
            <select
              className="input w-full md:w-48"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="market_cap">Market Cap</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="change_high">24h Change: High</option>
              <option value="change_low">24h Change: Low</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-dark-400 text-sm">
          Showing {filteredCoins.length} of {coins.length} cryptocurrencies
      </div>

        {/* Coins Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCoins.map((coin, index) => (
            <Link
              key={coin.id}
              to={{ pathname: "/coin", hash: coin.name }}
              state={{ value: coin }}
              className="card p-5 hover:border-primary-500/30 hover:shadow-glow-sm transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-10 h-10 rounded-full"
                  />
                <div>
                    <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {coin.name}
                    </h3>
                    <p className="text-dark-500 text-sm uppercase">
                      {coin.symbol}
                    </p>
                  </div>
                </div>
                <span className="text-dark-500 text-sm">#{coin.market_cap_rank}</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-display font-bold text-white mb-1">
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
                    <TrendUpIcon />
                  ) : (
                    <TrendDownIcon />
                  )}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  <span className="text-dark-500 ml-1">24h</span>
                </div>
              </div>

              {/* Sparkline mini chart */}
              {coin.sparkline_in_7d?.price && (
                <div className="h-12 mb-4">
                  <svg
                    viewBox={`0 0 ${coin.sparkline_in_7d.price.length} 50`}
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={`gradient-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={
                            coin.price_change_percentage_24h >= 0
                              ? "#22c563"
                              : "#ef4444"
                          }
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor={
                            coin.price_change_percentage_24h >= 0
                              ? "#22c563"
                              : "#ef4444"
                          }
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={(() => {
                        const prices = coin.sparkline_in_7d.price;
                        const min = Math.min(...prices);
                        const max = Math.max(...prices);
                        const range = max - min || 1;
                        const points = prices
                          .map(
                            (p, i) =>
                              `${i},${50 - ((p - min) / range) * 45}`
                          )
                          .join(" L ");
                        return `M ${points} L ${prices.length - 1},50 L 0,50 Z`;
                      })()}
                      fill={`url(#gradient-${coin.id})`}
                    />
                    <path
                      d={(() => {
                        const prices = coin.sparkline_in_7d.price;
                        const min = Math.min(...prices);
                        const max = Math.max(...prices);
                        const range = max - min || 1;
                        const points = prices
                          .map(
                            (p, i) =>
                              `${i},${50 - ((p - min) / range) * 45}`
                          )
                          .join(" L ");
                        return `M ${points}`;
                      })()}
                      fill="none"
                      stroke={
                        coin.price_change_percentage_24h >= 0
                          ? "#22c563"
                          : "#ef4444"
                      }
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-dark-900/50 rounded-lg p-2">
                  <span className="text-dark-500 block mb-1">24h High</span>
                  <span className="text-white font-medium">
                    {formatPrice(coin.high_24h)}
                  </span>
                      </div>
                <div className="bg-dark-900/50 rounded-lg p-2">
                  <span className="text-dark-500 block mb-1">24h Low</span>
                  <span className="text-white font-medium">
                    {formatPrice(coin.low_24h)}
                  </span>
                      </div>
                    </div>

              {/* Market Cap */}
              <div className="mt-3 pt-3 border-t border-dark-700/50">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-500">Market Cap</span>
                  <span className="text-dark-300 font-medium">
                    {formatMarketCap(coin.market_cap)}
                  </span>
                </div>
          </div>
            </Link>
          ))}
        </div>

        {filteredCoins.length === 0 && (
          <div className="text-center py-12">
            <div className="text-dark-400 mb-2">No cryptocurrencies found</div>
            <button
              onClick={() => setQuery("")}
              className="text-primary-400 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
