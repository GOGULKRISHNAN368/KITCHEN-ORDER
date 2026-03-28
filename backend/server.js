const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orders');

dotenv.config({ override: true });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/orders', orderRoutes);

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected: cluster0.gzmuwmk.mongodb.net/menumagic");
    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => {
      console.log(`🚀 Kitchen backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
