import React, { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import CoinInfo from "./CoinInfo";

let tvScriptLoadingPromise;

export default function Details({ open }) {
  const { state } = useLocation();
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById("tradingview_chart") &&
        "TradingView" in window
      ) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "BITSTAMP:" + `${state.value.symbol}` + "USD",
          interval: "D",
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1",
          locale: "in",
          toolbar_bg: "#0f172a",
          enable_publishing: false,
          hide_legend: false,
          withdateranges: true,
          save_image: true,
          details: true,
          calendar: false,
          container_id: "tradingview_chart",
        });
      }
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link 
          to="/market"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Market
        </Link>

        {/* Chart Section */}
        <div className="card p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-white">
              Price Chart
            </h2>
            <span className="text-dark-400 text-sm">
              Data by TradingView
            </span>
          </div>
          <div className="tradingview-widget-container rounded-xl overflow-hidden">
            <div
              id="tradingview_chart"
              className="h-[400px] md:h-[500px] w-full"
            />
          </div>
        </div>

        {/* Coin Info */}
        <CoinInfo state={state} open={open} />
      </div>
    </div>
  );
}
