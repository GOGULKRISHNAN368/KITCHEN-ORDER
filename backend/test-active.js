const axios = require('axios');

const url = "http://localhost:5000/api/orders/active";

axios.get(url)
  .then(res => {
    console.log("Status:", res.status);
    console.log("Data:", JSON.stringify(res.data, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error("Failed:", err.response ? err.response.status : err.message);
    if (err.response) {
       console.error("Error Data:", JSON.stringify(err.response.data, null, 2));
    }
    process.exit(1);
  });
