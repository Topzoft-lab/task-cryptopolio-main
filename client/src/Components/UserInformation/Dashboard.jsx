import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { API } from "../../config/api";

// Icons as simple SVG components
const WalletIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const TrendUpIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendDownIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function Dashboard() {
  const login = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const location = useLocation();
  const userid = location.state?.id;

  // State
  const [userdata, setuserdata] = useState({});
  const [url, seturl] = useState("");
  const [bal, setbal] = useState(0);
  const [inv, setinv] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [allTransaction, setallTransaction] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserData(),
        getAmount(),
        getHoldings(),
        getAllTransaction(),
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(API.userDetails, {
        method: "POST",
        body: JSON.stringify({ UserId: userid }),
        headers: { "Content-type": "application/json" },
      });
      const json = await response.json();
      setuserdata(json);
      seturl(json.userProfile?.[0]?.url || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getAmount = async () => {
    try {
      const response = await axios.post(API.walletAmount, { login });
      setbal(response.data[0]?.Amount || 0);
      setinv(response.data[0]?.Invested || 0);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  const getHoldings = async () => {
    try {
      const response = await axios.post(API.tradesHoldings, { login });
      if (response.data.success) {
        setHoldings(response.data.holdings);
      }
    } catch (error) {
      console.error("Error fetching holdings:", error);
    }
  };

  const getAllTransaction = async () => {
    try {
      const response = await axios.post(API.walletTransactions, { login });
      setallTransaction(response.data?.reverse() || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num, decimals = 2) => {
    if (num < 0.01) return num.toFixed(6);
    return num.toFixed(decimals);
  };

  const totalValue = bal + inv;
  const portfolioChange = inv > 0 ? ((inv / totalValue) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400 font-medium">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm font-medium mb-1">Welcome back,</p>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                {userdata.Data?.first_name} {userdata.Data?.last_name}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/market" className="btn-primary flex items-center gap-2">
                Trade Now
                <ArrowRightIcon />
              </Link>
              {url && (
                <div 
                  className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-primary-500/50 shadow-glow-sm"
                  style={{ backgroundImage: `url(${url})` }}
                />
              )}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Portfolio Value */}
          <div className="stat-card animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <span className="text-dark-400 text-sm font-medium">Total Portfolio Value</span>
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <ChartIcon />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-display font-bold text-white">
                {formatCurrency(totalValue)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 text-sm font-medium ${inv >= 0 ? 'text-secondary-400' : 'text-accent-red'}`}>
                {inv >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                {portfolioChange}% in assets
              </span>
            </div>
          </div>

          {/* Available Balance */}
          <div className="stat-card animate-slide-up delay-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-dark-400 text-sm font-medium">Available Balance</span>
              <div className="p-2 bg-secondary-500/20 rounded-lg text-secondary-400">
                <WalletIcon />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-display font-bold text-white">
                {formatCurrency(bal)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-success">Ready to invest</span>
            </div>
          </div>

          {/* Total Invested */}
          <div className="stat-card animate-slide-up delay-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-dark-400 text-sm font-medium">Total Invested</span>
              <div className="p-2 bg-accent-purple/20 rounded-lg text-accent-purple">
                <ChartIcon />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-display font-bold text-white">
                {formatCurrency(inv)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-dark-400 text-sm">{holdings.length} assets</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="card p-6 animate-slide-up delay-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-white">
                  Your Holdings
                </h2>
                <Link to="/market" className="btn-ghost text-sm flex items-center gap-1">
                  View Market <ArrowRightIcon />
                </Link>
              </div>

              {holdings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChartIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No holdings yet</h3>
                  <p className="text-dark-400 mb-4">Start building your portfolio by purchasing crypto assets</p>
                  <Link to="/market" className="btn-primary inline-flex items-center gap-2">
                    Explore Market <ArrowRightIcon />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {holdings.map((holding, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl hover:bg-dark-700/50 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={holding.image} 
                          alt={holding.coinName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                            {holding.coinName}
                          </h4>
                          <p className="text-sm text-dark-400">
                            {holding.symbol?.toUpperCase()} · {formatNumber(holding.quantity)} units
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white tabular-nums">
                          {formatCurrency(holding.totalInvested)}
                        </p>
                        <p className="text-sm text-dark-400">
                          Avg: ₹{formatNumber(holding.averageCost)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile & Quick Actions - 1 column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="card p-6 animate-slide-up delay-400">
              <div className="text-center mb-6">
                <div 
                  className="w-20 h-20 rounded-full bg-cover bg-center mx-auto mb-4 border-4 border-dark-700"
                  style={{ backgroundImage: url ? `url(${url})` : 'none', backgroundColor: '#334155' }}
                />
                <h3 className="text-lg font-semibold text-white">
                  {userdata.Data?.first_name} {userdata.Data?.last_name}
                </h3>
                <p className="text-dark-400 text-sm">{userdata.Data?.email}</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-dark-700">
                  <span className="text-dark-400">Mobile</span>
                  <span className="text-white font-medium">{userdata.Data?.mob || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-dark-700">
                  <span className="text-dark-400">Age</span>
                  <span className="text-white font-medium">{userdata.Data?.age || 'Not set'}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate("/profileUpdate", { state: { id: userid } })}
                className="btn-secondary w-full mt-6"
              >
                Edit Profile
              </button>
            </div>

            {/* Quick Stats */}
            <div className="card p-6 animate-slide-up delay-500">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-dark-400">Total Trades</span>
                  <span className="text-white font-semibold">{allTransaction.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-400">Assets Held</span>
                  <span className="text-white font-semibold">{holdings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-400">Portfolio %</span>
                  <span className="text-primary-400 font-semibold">{portfolioChange}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <div className="card p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-white">
                Recent Transactions
              </h2>
              <span className="badge-neutral">{allTransaction.length} total</span>
            </div>

            {allTransaction.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-dark-400">No transactions yet. Start trading to see your history.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-dark-400 text-sm border-b border-dark-700">
                      <th className="pb-4 font-medium">Asset</th>
                      <th className="pb-4 font-medium">Type</th>
                      <th className="pb-4 font-medium text-right">Quantity</th>
                      <th className="pb-4 font-medium text-right">Price</th>
                      <th className="pb-4 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransaction.slice(0, 10).map((tx, index) => (
                      <tr key={index} className="table-row">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img src={tx.img} alt={tx.CoinName} className="w-8 h-8 rounded-full" />
                            <span className="font-medium text-white">{tx.CoinName}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`badge ${tx.type === 'Buy' ? 'badge-success' : 'badge-danger'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 text-right text-white tabular-nums">
                          {formatNumber(tx.Quantity, 4)}
                        </td>
                        <td className="py-4 text-right text-dark-400 tabular-nums">
                          ₹{formatNumber(tx.Prise)}
                        </td>
                        <td className="py-4 text-right font-medium text-white tabular-nums">
                          {formatCurrency(tx.Amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
