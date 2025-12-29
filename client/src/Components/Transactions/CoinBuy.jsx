import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API } from "../../config/api";

export default function CoinBuy() {
  const { state } = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Quantity, setQuantity] = useState("");
  const [Amount_for_amount, setAmount_for_amount] = useState("");

  const login = localStorage.getItem("authToken");

  useEffect(() => {
    if (state?.data) {
      setData(state.data);
    }
  }, [state]);

  const pricePerCoin = data ? (data.current_price / 100) * 70 : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const calculatedAmount = Quantity ? pricePerCoin * Number(Quantity) : 0;
  const calculatedQuantity = Amount_for_amount ? Number(Amount_for_amount) / pricePerCoin : 0;

  const handleBuyByQuantity = async () => {
    if (Number(Quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API.tradesBuy, {
        login,
        coinId: data.id,
        coinName: data.name,
        symbol: data.symbol,
        image: data.image,
        quantity: Number(Quantity),
        pricePerCoin,
      });

      if (response.data.success) {
        alert(`Successfully bought ${Quantity} ${data.name}!`);
    window.history.go(-1);
      } else {
        alert(response.data.error || "Purchase failed");
      }
    } catch (error) {
      if (error.response?.data?.error === "Insufficient balance") {
        alert(`Not enough balance. Required: ${formatPrice(error.response.data.required)}, Available: ${formatPrice(error.response.data.available)}`);
      } else {
        alert(error.response?.data?.error || "Purchase failed");
      }
    }
    setLoading(false);
  };

  const handleBuyByAmount = async () => {
    if (Number(Amount_for_amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API.tradesBuy, {
        login,
        coinId: data.id,
        coinName: data.name,
        symbol: data.symbol,
        image: data.image,
        quantity: calculatedQuantity,
        pricePerCoin,
      });

      if (response.data.success) {
        alert(`Successfully bought ${calculatedQuantity.toFixed(6)} ${data.name}!`);
        window.history.go(-1);
      } else {
        alert(response.data.error || "Purchase failed");
      }
    } catch (error) {
      if (error.response?.data?.error === "Insufficient balance") {
        alert(`Not enough balance. Required: ${formatPrice(error.response.data.required)}, Available: ${formatPrice(error.response.data.available)}`);
      } else {
        alert(error.response?.data?.error || "Purchase failed");
      }
    }
    setLoading(false);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-dark-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <button 
          onClick={() => window.history.go(-1)}
          className="flex items-center gap-2 text-dark-400 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to coin
        </button>

        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-500/20 text-secondary-400 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Buy Order
            </div>
            <h1 className="text-2xl font-display font-bold text-white">
              Buy {data.name}
            </h1>
          </div>

          {/* Coin Info */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={data.image} alt={data.name} className="w-16 h-16 rounded-full" />
                <div>
                  <h2 className="text-xl font-semibold text-white">{data.name}</h2>
                  <p className="text-dark-400 uppercase">{data.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-dark-400 text-sm mb-1">Current Price</p>
                <p className="text-2xl font-display font-bold text-white">
                  {formatPrice(pricePerCoin)}
                </p>
            </div>
            </div>
          </div>

          {/* Buy Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Buy by Quantity */}
            <div className="bg-dark-900/50 rounded-2xl p-6 border border-dark-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Buy by Quantity</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-2">Quantity</label>
                <input
                    type="number"
                  value={Quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                    className="input text-center text-xl font-mono"
                />
              </div>

                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-dark-400">Total Cost</span>
                    <span className="text-white font-medium tabular-nums">
                      {formatPrice(calculatedAmount)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBuyByQuantity}
                  disabled={loading || !Quantity}
                  className="btn-primary w-full py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700"
                >
                  {loading ? "Processing..." : `Buy ${data.symbol?.toUpperCase()}`}
                </button>
              </div>
            </div>

            {/* Buy by Amount */}
            <div className="bg-dark-900/50 rounded-2xl p-6 border border-dark-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Buy by Amount</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-2">Amount (₹)</label>
                <input
                    type="number"
                  value={Amount_for_amount}
                    onChange={(e) => setAmount_for_amount(e.target.value)}
                    placeholder="0.00"
                    className="input text-center text-xl font-mono"
                />
              </div>

                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-dark-400">You'll Receive</span>
                    <span className="text-white font-medium tabular-nums">
                      {calculatedQuantity.toFixed(6)} {data.symbol?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBuyByAmount}
                  disabled={loading || !Amount_for_amount}
                  className="btn-primary w-full py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700"
                >
                  {loading ? "Processing..." : `Buy ${data.symbol?.toUpperCase()}`}
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
            <p className="text-primary-300 text-sm">
              💡 This is a demo platform. Trades are simulated using virtual funds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
