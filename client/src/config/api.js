// API Configuration - Switch between local and production
const isDevelopment = process.env.NODE_ENV === 'development' || 
                      window.location.hostname === 'localhost';

// Local development server
const LOCAL_API = 'http://localhost:4000';

// Production server (Render)
const PROD_API = 'https://cryptofolio-backstack-aiwo.onrender.com';

// Use local API in development, production API otherwise
export const API_BASE_URL = isDevelopment ? LOCAL_API : PROD_API;

// API Endpoints
export const API = {
  // Auth
  signup: `${API_BASE_URL}/register/creatuser`,
  login: `${API_BASE_URL}/register/Signup`,
  
  // Dashboard
  dashboard: `${API_BASE_URL}/dashboard/dashboard`,
  userDetails: `${API_BASE_URL}/dashboard/userdetails`,
  profileUpdate: `${API_BASE_URL}/dashboard/profileUpdate`,
  
  // Wallet
  walletAmount: `${API_BASE_URL}/wallet/getwalletAmount`,
  walletTransactions: `${API_BASE_URL}/wallet/getwalletTransaction`,
  
  // Legacy Transactions (kept for backward compatibility)
  transactions: `${API_BASE_URL}/transactions/transactions`,
  sellTransactions: `${API_BASE_URL}/transactions/selltransactions`,
  
  // New Trade endpoints (with holdings tracking)
  tradesBuy: `${API_BASE_URL}/trades/buy`,
  tradesSell: `${API_BASE_URL}/trades/sell`,
  tradesHoldings: `${API_BASE_URL}/trades/holdings`,
  tradesSummary: `${API_BASE_URL}/trades/summary`,
  
  // Health check
  health: `${API_BASE_URL}/health`,
};

export default API;

