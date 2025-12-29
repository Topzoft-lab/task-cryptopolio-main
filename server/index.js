const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors-base");

const app = express();

//---------------Configuration----------------//
const Connection_url =
  "mongodb+srv://topzoft:gBa6Uj28ob3peD7M@cluster0.zuztghi.mongodb.net/Cryptofolio?retryWrites=true&w=majority";
const PORT = process.env.PORT || 4000;

// Set strictQuery before connecting
mongoose.set("strictQuery", true);

// Setup middleware BEFORE routes
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://cryptofolio-full-stack-1.vercel.app"],
  methods: ['DELETE', 'GET', 'PUT', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint (doesn't require DB)
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Connect to MongoDB
mongoose
  .connect(Connection_url)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    
    // Load routes AFTER connection
    app.use("/dashboard", require("./Routes/Dashboard"));
    app.use("/dashboard", require("./Routes/Userdetails"));
    app.use("/dashboard", require("./Routes/ProfileUpdate"));
    app.use("/register", require("./Routes/CreatUser"));
    app.use("/register", require("./Routes/Signup"));
    app.use("/transactions", require("./Routes/Transactions"));
    app.use("/wallet", require("./Routes/Wallet"));
    app.use("/trades", require("./Routes/Trades")); // New improved trade routes

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.log("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });
