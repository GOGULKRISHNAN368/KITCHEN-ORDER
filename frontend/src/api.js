import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

export const fetchOrders = () => {
  console.log('📡 Fetching pending orders from central relay...');
  // We want to fetch all orders, and filter for 'Pending' on the frontend 
  // OR update the backend to have a specialized /pending route.
  // For now, let's just fetch all and filter for 'Pending' in the component.
  return axios.get(`${API_URL}`);
};

export const completeOrder = (orderId) => {
  console.log(`✅ Completing order: ${orderId}`);
  return axios.put(`${API_URL}/complete/${orderId}`);
};
