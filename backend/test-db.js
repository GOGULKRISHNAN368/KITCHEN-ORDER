const mongoose = require('mongoose');

const uri = "mongodb+srv://storeorder:admin123@cluster0.gzmuwmk.mongodb.net/menumagic?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("Connection successful!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
