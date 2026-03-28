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

// Direct delete route for testing/fallback
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`🔥 DIRECT DELETE HIT: ${id}`);
  try {
    const deleted = await mongoose.model('Order').findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ success: true, message: "Deleted via direct route" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

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
