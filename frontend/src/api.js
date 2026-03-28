import axios from 'axios';

// The backend is running on 5000, Vite proxies /api to it.
const API_URL = '/api/orders';

export const fetchOrders = () => {
  console.log('📡 Fetching active orders...');
  return axios.get(`${API_URL}/active`);
};

export const completeOrder = (id) => {
  console.log(`✅ Completing order: ${id} at ${API_URL}/complete/${id}`);
  return axios.put(`${API_URL}/complete/${id}`);
};
