const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Wallet = require("../models/Wallet");
const Portfolio = require("../models/Holdings");
const Transaction = require("../models/Transactions");

const jwtSecret = "abcdefghijklmnopqrstuvwxyz";

// Middleware to verify JWT and extract user
const authenticateToken = (req, res, next) => {
  try {
    const authToken = req.body.login || req.headers.authorization?.split(' ')[1];
    if (!authToken) {
      return res.status(401).json({ error: "No token provided" });
    }
    const decoded = jwt.verify(authToken, jwtSecret);
    req.userId = decoded.user.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// GET /trades/holdings - Get user's current holdings
router.post("/holdings", authenticateToken, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.userId });
    
    if (!portfolio) {
      portfolio = await Portfolio.create({ userId: req.userId, holdings: [] });
    }
    
    res.json({ 
      success: true, 
      holdings: portfolio.holdings,
      totalHoldings: portfolio.holdings.length
    });
  } catch (error) {
    console.error("Holdings error:", error);
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

// POST /trades/buy - Buy a coin
router.post("/buy", authenticateToken, async (req, res) => {
  try {
    const { coinId, coinName, symbol, image, quantity, pricePerCoin } = req.body;
    
    // Validate input
    if (!coinId || !quantity || !pricePerCoin || quantity <= 0) {
      return res.status(400).json({ error: "Invalid trade parameters" });
    }
    
    const totalCost = quantity * pricePerCoin;
    
    // Get user's wallet
    const wallet = await Wallet.findOne({ UserId: req.userId });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    
    // Check sufficient balance
    if (wallet.Amount < totalCost) {
      return res.status(400).json({ 
        error: "Insufficient balance",
        required: totalCost,
        available: wallet.Amount
      });
    }
    
    // Update wallet (deduct cost, add to invested)
    wallet.Amount -= totalCost;
    wallet.Invested += totalCost;
    await wallet.save();
    
    // Update or create holdings
    let portfolio = await Portfolio.findOne({ userId: req.userId });
    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.userId, holdings: [] });
    }
    
    // Find existing holding for this coin
    const existingHolding = portfolio.holdings.find(h => h.coinId === coinId);
    
    if (existingHolding) {
      // Calculate new average cost: (oldTotal + newTotal) / (oldQty + newQty)
      const oldTotal = existingHolding.quantity * existingHolding.averageCost;
      const newTotal = quantity * pricePerCoin;
      const newQuantity = existingHolding.quantity + quantity;
      
      existingHolding.quantity = newQuantity;
      existingHolding.averageCost = (oldTotal + newTotal) / newQuantity;
      existingHolding.totalInvested += totalCost;
      existingHolding.lastUpdated = new Date();
    } else {
      // Create new holding
      portfolio.holdings.push({
        coinId,
        coinName: coinName || coinId,
        symbol: symbol || coinId.toUpperCase(),
        image,
        quantity,
        averageCost: pricePerCoin,
        totalInvested: totalCost,
        lastUpdated: new Date()
      });
    }
    
    await portfolio.save();
    
    // Add to transaction log
    const transactionEntry = {
      img: image,
      CoinId: coinId,
      CoinName: coinName || coinId,
      Quantity: quantity,
      Amount: totalCost,
      Prise: pricePerCoin,
      Date: new Date().toISOString(),
      type: "Buy"
    };
    
    let userTransactions = await Transaction.findOne({ UserId: req.userId });
    if (!userTransactions) {
      userTransactions = new Transaction({ UserId: req.userId, Transaction: [] });
    }
    userTransactions.Transaction.push(transactionEntry);
    await userTransactions.save();
    
    res.json({
      success: true,
      message: "Purchase successful",
      trade: {
        type: "BUY",
        coinId,
        quantity,
        pricePerCoin,
        totalCost
      },
      wallet: {
        balance: wallet.Amount,
        invested: wallet.Invested
      },
      holding: portfolio.holdings.find(h => h.coinId === coinId)
    });
    
  } catch (error) {
    console.error("Buy error:", error);
    res.status(500).json({ error: "Trade failed", details: error.message });
  }
});

// POST /trades/sell - Sell a coin
router.post("/sell", authenticateToken, async (req, res) => {
  try {
    const { coinId, coinName, image, quantity, pricePerCoin } = req.body;
    
    // Validate input
    if (!coinId || !quantity || !pricePerCoin || quantity <= 0) {
      return res.status(400).json({ error: "Invalid trade parameters" });
    }
    
    const totalValue = quantity * pricePerCoin;
    
    // Get user's portfolio
    const portfolio = await Portfolio.findOne({ userId: req.userId });
    if (!portfolio) {
      return res.status(400).json({ error: "No holdings found" });
    }
    
    // Find holding for this specific coin
    const holding = portfolio.holdings.find(h => h.coinId === coinId);
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ 
        error: "Insufficient holdings",
        required: quantity,
        available: holding?.quantity || 0
      });
    }
    
    // Calculate profit/loss
    const costBasis = quantity * holding.averageCost;
    const profitLoss = totalValue - costBasis;
    
    // Update holding
    holding.quantity -= quantity;
    holding.totalInvested -= costBasis;
    holding.lastUpdated = new Date();
    
    // Remove holding if quantity is 0
    if (holding.quantity <= 0) {
      portfolio.holdings = portfolio.holdings.filter(h => h.coinId !== coinId);
    }
    
    await portfolio.save();
    
    // Update wallet (add proceeds, reduce invested)
    const wallet = await Wallet.findOne({ UserId: req.userId });
    wallet.Amount += totalValue;
    wallet.Invested = Math.max(0, wallet.Invested - costBasis);
    await wallet.save();
    
    // Add to transaction log
    const transactionEntry = {
      img: image,
      CoinId: coinId,
      CoinName: coinName || coinId,
      Quantity: quantity,
      Amount: totalValue,
      Prise: pricePerCoin,
      Date: new Date().toISOString(),
      type: "Sell"
    };
    
    let userTransactions = await Transaction.findOne({ UserId: req.userId });
    if (!userTransactions) {
      userTransactions = new Transaction({ UserId: req.userId, Transaction: [] });
    }
    userTransactions.Transaction.push(transactionEntry);
    await userTransactions.save();
    
    res.json({
      success: true,
      message: "Sale successful",
      trade: {
        type: "SELL",
        coinId,
        quantity,
        pricePerCoin,
        totalValue,
        profitLoss
      },
      wallet: {
        balance: wallet.Amount,
        invested: wallet.Invested
      }
    });
    
  } catch (error) {
    console.error("Sell error:", error);
    res.status(500).json({ error: "Trade failed", details: error.message });
  }
});

// GET /trades/summary - Get portfolio summary with current values
router.post("/summary", authenticateToken, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ UserId: req.userId });
    const portfolio = await Portfolio.findOne({ userId: req.userId });
    
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    
    const holdings = portfolio?.holdings || [];
    
    res.json({
      success: true,
      wallet: {
        balance: wallet.Amount,
        invested: wallet.Invested
      },
      holdings: holdings.map(h => ({
        coinId: h.coinId,
        coinName: h.coinName,
        symbol: h.symbol,
        image: h.image,
        quantity: h.quantity,
        averageCost: h.averageCost,
        totalInvested: h.totalInvested
      })),
      totalHoldings: holdings.length
    });
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

module.exports = router;

