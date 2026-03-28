const axios = require('axios');

const url = "http://localhost:5000/api/orders/69c6b770a71746c3ac8c753a/complete";

axios.put(url)
  .then(res => {
    console.log("Update successful:", res.data);
    process.exit(0);
  })
  .catch(err => {
    console.error("Update failed:", err.response ? err.response.data : err.message);
    process.exit(1);
  });
