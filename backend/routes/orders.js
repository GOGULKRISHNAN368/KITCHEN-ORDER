const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');

// @route   GET /api/orders/active
// @desc    Get all active orders (Pending or Waiting)
router.get('/active', async (req, res) => {
  try {
    // Fetch orders that are in 'Pending' or 'Waiting' status (case-insensitive)
    const orders = await Order.find({ 
      status: { $regex: /pending|waiting/i } 
    }).sort({ createdAt: -1 });
    
    console.log(`📡 GET /api/orders/active | Found: ${orders.length} orders`);
    
    // Always return an array, even if empty, to prevent frontend crashes
    res.status(200).json(orders || []);
  } catch (error) {
    console.error("❌ Error fetching active orders:", error.message);
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message,
      orders: [] // Fallback empty array
    });
  }
});

// @route   GET /api/orders/:orderId
// @desc    Get order by orderId
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(`📡 GET /api/orders/${orderId}`);
    
    // Check if it's a valid MongoDB ObjectId or our custom orderId string
    let order = await Order.findOne({ orderId: orderId });
    
    if (!order && mongoose.Types.ObjectId.isValid(orderId)) {
        order = await Order.findById(orderId);
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Error fetching order:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   PUT /api/orders/complete/:id
// @desc    Mark order as completed by kitchen
router.put('/complete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`\n--- COMPLETE REQUEST ---`);
    console.log(`ID received: [${id}]`);

    // Try finding by internal MongoDB ID first
    let order = await Order.findById(id).catch(e => null);
    
    // Fallback: Try finding by custom orderId string if available
    if (!order) {
      console.log(`🔍 Not found by _id, checking orderId field...`);
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found in database" });
    }

    order.status = 'Completed';
    order.updatedAt = new Date();
    await order.save();
    console.log(`✅ Order ${order._id} marked as Completed.`);
    
    res.status(200).json({ 
      success: true, 
      message: "Order successfully updated to Completed",
      id: order._id 
    });
  } catch (error) {
    console.error(`❌ Operation failed:`, error);
    res.status(500).json({ 
      success: false, 
      message: "Error processing the order completion",
      error: error.message 
    });
  }
});

module.exports = router;
