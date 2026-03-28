require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log("URI from env:", uri.replace(/:[^:@]+@/, ":****@")); // Mask password

mongoose.connect(uri)
  .then(() => {
    console.log("Connection successful with dotenv!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed with dotenv:", err.message);
    process.exit(1);
  });
