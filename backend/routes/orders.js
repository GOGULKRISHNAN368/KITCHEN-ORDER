const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   GET /api/orders
// @desc    Get all pending orders
router.get('/', async (req, res) => {
  try {
    // Find where status is either 'pending' or 'Pending'
    const orders = await Order.find({ 
      status: { $regex: /pending/i } 
    }).sort({ createdAt: -1 });
    
    console.log(`📡 GET /api/orders | Found: ${orders.length} orders`);
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete completed order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE Request for ID: ${id}`);
    
    // First try finding it normally
    const order = await Order.findById(id);
    if (!order) {
      console.log(`⚠️ Order not found in DB with ID: ${id}`);
      return res.status(404).json({ message: "Order not found" });
    }

    const deleted = await Order.findByIdAndDelete(id);
    console.log(`✅ Order deleted successfully: ${id}`);
    res.status(200).json({ message: "Order completed and removed" });
  } catch (error) {
    console.error(`❌ Error deleting order (${req.params.id}):`, error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
