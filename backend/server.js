const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const orderRoutes = require('./routes/orders');

dotenv.config({ override: true });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// Attach Socket.io to the entire request object for use in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

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
    
    // Set up MongoDB Change Stream for Real-Time synchronization
    const orderCollection = mongoose.connection.collection('orders');
    const changeStream = orderCollection.watch();

    changeStream.on('change', (change) => {
      console.log('📡 DB CHANGE DETECTED:', change.operationType);
      
      if (change.operationType === 'insert') {
        io.emit('orderCreated', change.fullDocument);
      } else if (change.operationType === 'update') {
        // Emit the update to all connected clients
        const updatedFields = change.updateDescription.updatedFields;
        io.emit('orderUpdated', { 
           orderId: change.documentKey._id, 
           ...updatedFields 
        });
      }
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Kitchen backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
