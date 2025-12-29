const mongoose = require("mongoose");

// Individual holding for a specific coin
const holdingSchema = new mongoose.Schema({
  coinId: { type: String, required: true },      // e.g., "bitcoin"
  coinName: { type: String, required: true },    // e.g., "Bitcoin"
  symbol: { type: String, required: true },      // e.g., "BTC"
  image: { type: String },                       // coin image URL
  quantity: { type: Number, required: true, default: 0 },
  averageCost: { type: Number, required: true, default: 0 },  // weighted avg purchase price
  totalInvested: { type: Number, required: true, default: 0 }, // total amount spent
  lastUpdated: { type: Date, default: Date.now }
});

// User's portfolio holdings
const portfolioSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: true,
    unique: true 
  },
  holdings: [holdingSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamp
portfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Portfolio", portfolioSchema);

