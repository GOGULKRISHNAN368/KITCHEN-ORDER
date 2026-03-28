import React, { useState, useEffect, useCallback } from 'react';
import { fetchOrders, completeOrder } from '../api';
import OrderCard from '../components/OrderCard';
import { ChefHat, RefreshCcw, LayoutDashboard, Loader2, AlertCircle, ShoppingBag, Radio } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  const getOrders = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const response = await fetchOrders();
      setOrders(response.data);
      setLastSync(new Date());
      setError(null);
      if (showToast) {
        toast.success('System Synced', {
          style: { background: '#111827', color: '#fff', borderRadius: '14px', fontSize: '12px', fontWeight: 'bold' }
        });
      }
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Sync Interrupted");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleCompleteOrder = async (orderId) => {
    if (!orderId) return;
    
    try {
      // Optimistically remove from UI first for instant feedback
      setOrders(prev => prev.filter(o => o._id !== orderId));
      
      // API call to delete from database
      await completeOrder(orderId);
      
      toast.success('System Transmitted', {
        icon: '✅',
        style: { borderRadius: '14px', background: '#111827', color: '#fff', fontSize: '12px', fontWeight: 'bold' },
      });
    } catch (err) {
      console.error("Order completion failed:", err);
      // If it fails, the next poll (every 5s) will bring the order back if it still exists in DB
      const errorMsg = err.response?.data?.message || 'Transmission Sync Error';
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    getOrders();
    const interval = setInterval(() => {
      getOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, [getOrders]);

  return (
    <div className="min-h-screen bg-[#EEF2F6] font-inter text-[#111827] w-full">
      <Toaster position="top-center" />
      
      {/* SaaS Header Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] px-10 py-5 flex items-center justify-between nav-shadow">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-5">
           <div className="bg-[#22C55E] p-2.5 rounded-2xl shadow-lg shadow-[#22C55E]/20">
             <ChefHat className="w-6 h-6 text-white" />
           </div>
           <div>
             <h1 className="text-xl font-black tracking-tighter text-[#111827] leading-none mb-1.5">KITCHEN OPS</h1>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></div>
                <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest">System Online</span>
             </div>
           </div>
        </div>

        {/* Center: Station Name */}
        <div className="hidden lg:flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] px-8 py-3 rounded-full">
           <Radio className="w-4 h-4 text-[#6B7280]" />
           <span className="text-[11px] font-black text-[#6B7280] uppercase tracking-[0.3em]">Station: Alpha Main Line</span>
        </div>

        {/* Right: Operational Metrics */}
        <div className="flex items-center gap-10">
           <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 opacity-50">Pending Load</span>
             <span className="text-2xl font-black text-[#111827] tracking-tighter">{orders.length < 10 ? `0${orders.length}` : orders.length} <span className="text-[10px] opacity-30">TICKETS</span></span>
           </div>

           <div className="flex items-center gap-4 border-l border-[#E2E8F0] pl-10">
              <div className="text-right">
                <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest opacity-40">Sync Time</p>
                <p className="text-xs font-black text-[#111827]">{lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
              </div>
              <button 
                onClick={() => getOrders(true)}
                className="p-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl transition-all active:scale-90 group"
              >
                <RefreshCcw className={`w-5 h-5 text-[#6B7280] group-hover:text-[#22C55E] ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
           </div>
        </div>
      </nav>

      {/* Surface Panel Grid */}
      <main className="max-w-[1800px] mx-auto pt-10 px-10 pb-20">
        <div className="surface-panel min-h-[calc(100vh-160px)] p-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
               <Loader2 className="w-12 h-12 text-[#22C55E] animate-spin mb-6" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#6B7280]">Initializing Data Streams...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
               <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
               <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Sync Offline</h2>
               <p className="text-sm text-[#6B7280] max-w-xs mb-10 font-medium leading-relaxed">Failed to establish connection with the primary data relay station.</p>
               <button onClick={() => window.location.reload()} className="ready-button px-10 py-4 rounded-full text-white font-black text-xs uppercase tracking-widest">Retry Connection</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {orders.length === 0 ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                    <Package className="w-16 h-16 text-[#E2E8F0] stroke-[1]" />
                    <p className="text-xl font-bold text-[#6B7280]">All orders transmitted.</p>
                    <p className="text-sm text-[#94A3B8]">Waiting for incoming traffic...</p>
                  </div>
                ) : (
                  orders.map((order) => {
                    const uniqueKey = order._id || order.id || order.orderId || Math.random();
                    return (
                      <OrderCard 
                        key={uniqueKey} 
                        order={order} 
                        onComplete={handleCompleteOrder} 
                      />
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Status */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#E2E8F0] px-10 py-4 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.3em] text-[#6B7280] z-50">
          <div className="flex items-center gap-10">
             <div className="flex items-center gap-2.5 text-[#22C55E]"><LayoutDashboard className="w-4 h-4" /> Operations Live</div>
             <div className="opacity-30">Channel: Delta-7</div>
          </div>
          <div className="opacity-20">Kitchen OPS Enterprise v2.5</div>
      </footer>
    </div>
  );
};

export default KitchenDashboard;
