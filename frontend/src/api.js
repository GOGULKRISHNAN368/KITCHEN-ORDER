import axios from 'axios';

// The backend is running on 5000, Vite proxies /api to it.
const API_URL = '/api/orders';

export const fetchOrders = () => axios.get(API_URL);
export const completeOrder = (id) => axios.delete(`${API_URL}/${id}`);
