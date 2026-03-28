import React, { useState, useEffect, useCallback } from 'react';
import { fetchOrders, completeOrder } from '../api';
import OrderCard from '../components/OrderCard';
import { ChefHat, RefreshCcw, LayoutDashboard, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getOrders = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const response = await fetchOrders();
      setOrders(response.data);
      setError(null);
      if (showToast) toast.success('Orders refreshed!', { duration: 2000 });
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Failed to fetch orders from kitchen server.");
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleCompleteOrder = async (id) => {
    try {
      await completeOrder(id);
      setOrders(prev => prev.filter(o => o._id !== id));
      toast.success('Order Completed!', {
         icon: '🍳',
         style: {
           borderRadius: '10px',
           background: '#333',
           color: '#fff',
         },
      });
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => {
    getOrders();
    const interval = setInterval(() => {
      getOrders();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [getOrders]);

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-orange-500 selection:text-white pb-10">
      <Toaster position="top-right" />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-900 px-6 py-5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center">
              Kitchen <span className="text-orange-500 ml-2">Display</span>
            </h1>
            <div className="flex items-center text-xs font-bold text-gray-500 tracking-widest uppercase">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Live Feed • Local Station
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Orders</span>
            <span className="text-xl font-black text-orange-500 leading-tight tracking-tighter">{orders.length} Units</span>
          </div>
          <button 
            onClick={() => getOrders(true)}
            className="p-3 bg-gray-900 border border-gray-800 hover:border-orange-500/50 rounded-xl transition-all duration-300 hover:bg-gray-800 focus:ring-2 focus:ring-orange-500/50 active:scale-95 flex items-center group shadow-md"
            title="Manual Sync"
          >
            <RefreshCcw className={`w-5 h-5 text-gray-400 group-hover:text-orange-400 ${isRefreshing ? 'animate-spin text-orange-400' : 'transition-transform duration-500 group-hover:rotate-180'}`} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1920px] mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
             <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-6 drop-shadow-lg" />
             <div className="text-xl font-bold uppercase tracking-[0.2em] text-gray-500 animate-pulse">Initializing Terminal...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 border-2 border-dashed border-red-500/20 rounded-3xl bg-red-500/5 backdrop-blur-sm max-w-2xl mx-auto">
             <AlertCircle className="w-16 h-16 text-red-500 mb-6 drop-shadow-md" />
             <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{error}</h2>
             <p className="text-gray-400 mb-8 max-w-md font-medium">Please check if the backend server is running and the database password is correctly set in environment variables.</p>
             <button 
               onClick={() => window.location.reload()}
               className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-black transition-all flex items-center shadow-lg shadow-red-900/20 active:scale-95"
             >
               <RefreshCcw className="w-5 h-5 mr-3" />
               RETRY CONNECTION
             </button>
          </div>
        ) : orders.length === 0 ? (
          <AnimatePresence>
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center justify-center min-h-[70vh] text-center p-12 bg-gray-900/30 border-2 border-dashed border-gray-800/50 rounded-[2.5rem] backdrop-blur-md shadow-inner"
            >
              <div className="bg-gray-900 p-8 rounded-full mb-8 shadow-2xl relative">
                  <ShoppingBag className="w-20 h-20 text-gray-700" />
                  <div className="absolute -top-1 -right-1 bg-gray-800 p-2 rounded-full border-4 border-gray-950">
                    <AlertCircle className="w-6 h-6 text-orange-500 animate-pulse" />
                  </div>
              </div>
              <h2 className="text-4xl font-black text-gray-400 mb-4 uppercase tracking-tighter">Kitchen Clear</h2>
              <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed uppercase tracking-widest italic opacity-60">Ready for incoming transmissions... Waiting for guest orders.</p>
              <div className="mt-10 flex gap-4">
                 <div className="w-2 h-2 rounded-full bg-gray-800 animate-bounce delay-75"></div>
                 <div className="w-2 h-2 rounded-full bg-gray-800 animate-bounce delay-150"></div>
                 <div className="w-2 h-2 rounded-full bg-gray-800 animate-bounce delay-300"></div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-2">
            <AnimatePresence mode="popLayout">
              {orders.map((order) => (
                <OrderCard 
                  key={order._id}
                  order={order}
                  onComplete={handleCompleteOrder}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Info Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-lg border-t border-gray-900 px-6 py-2.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 z-50 select-none">
          <div className="flex items-center space-x-6">
             <div className="flex items-center"><LayoutDashboard className="w-3 h-3 mr-1.5 text-orange-500/50" /> Station Gamma-04</div>
             <div className="hidden sm:block">Status: Optimal</div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="text-orange-500/80">Polling Rate: 5 SEC</div>
             <div className="text-gray-700">© 2026 MenuMagic Enterprise</div>
          </div>
      </footer>
    </div>
  );
};

export default KitchenDashboard;
