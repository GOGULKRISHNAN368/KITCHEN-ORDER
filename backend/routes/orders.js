const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
    console.log(`\n--- DELETE REQUEST ---`);
    console.log(`ID received: [${id}]`);
    console.log(`Connection State: ${mongoose.connection.readyState} (1=Connected)`);

    // Try finding by internal MongoDB ID first
    let order = await Order.findById(id).catch(e => {
      console.log(`Invalid ObjectId format: ${id}`);
      return null;
    });
    
    // Fallback: Try finding by custom orderId string if available
    if (!order) {
      console.log(`🔍 Not found by _id, checking orderId field...`);
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      // Diagnostic: List some IDs in the collection
      const someOrders = await Order.find({}).limit(5);
      const availableIds = someOrders.map(o => o._id.toString());
      console.log(`⚠️ Order NOT FOUND. Available IDs in DB:`, availableIds);
      
      return res.status(404).json({ 
        message: "Order not found in database",
        receivedId: id,
        availableCount: await Order.countDocuments()
      });
    }

    const deletedOrder = await Order.findByIdAndDelete(order._id);
    console.log(`✅ Order ${deletedOrder._id} permanently removed from database.`);
    
    res.status(200).json({ 
      success: true, 
      message: "Order successfully transmitted and removed",
      id: order._id 
    });
  } catch (error) {
    console.error(`❌ Operation failed:`, error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred while processing the order",
      error: error.message 
    });
  }
});

module.exports = router;
