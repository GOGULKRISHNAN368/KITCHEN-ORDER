const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const OrderSchema = new mongoose.Schema({
  customerName: String,
  status: String,
  items: Array
});

const Order = mongoose.model('Order', OrderSchema, 'orders');

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders:`);
    orders.forEach(o => {
      console.log(`- ID: ${o._id}, Name: ${o.customerName}, Status: ${o.status}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
