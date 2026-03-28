import axios from 'axios';

// The backend is running on 5000, Vite proxies /api to it.
const API_URL = '/api/orders';

export const fetchOrders = () => {
  console.log('📡 Fetching orders...');
  return axios.get(API_URL);
};

export const completeOrder = (id) => {
  console.log(`✅ Completing order: ${id} at ${API_URL}/${id}`);
  return axios.delete(`${API_URL}/${id}`);
};
