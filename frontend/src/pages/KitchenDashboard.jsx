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
  const [lastSync, setLastSync] = useState(new Date());

  const getOrders = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const response = await fetchOrders();
      setOrders(response.data);
      setLastSync(new Date());
      setError(null);
      if (showToast) toast.success('Kitchen Synced', { 
        style: { background: '#022c22', color: '#10b981', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.1)' }
      });
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Terminal Offline");
      toast.error('Sync Failed');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleCompleteOrder = async (id) => {
    try {
      await completeOrder(id);
      setOrders(prev => prev.filter(o => o._id !== id));
      toast.success('Order Dispatched', {
         icon: '🚀',
         style: { borderRadius: '12px', background: '#0f172a', color: '#fff' },
      });
    } catch (err) {
      toast.error('Dispatch Failed');
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
    <div className="min-h-screen bg-[#EEF2F6] font-inter text-[#111827]">
      <Toaster position="bottom-right" />
      
      {/* SaaS Header Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] px-8 py-4 flex items-center justify-between nav-shadow">
        {/* Left: Branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-3">
             <div className="bg-[#22C55E]/10 p-2 rounded-xl">
               <ChefHat className="w-6 h-6 text-[#22C55E]" />
             </div>
             <div className="flex flex-col">
               <h1 className="text-lg font-extrabold tracking-tight text-[#111827]">KITCHEN OPS</h1>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#22C55E] uppercase tracking-wider">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></div>
                 System Online
               </div>
             </div>
          </div>
        </div>

        {/* Center: Station Identifier */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center bg-[#F8FAFC] px-6 py-2 rounded-full border border-[#E2E8F0]">
           <span className="text-xs font-black text-[#6B7280] uppercase tracking-[0.2em]">STATION: HOT LINE DELTA</span>
        </div>

        {/* Right: Operational Metrics */}
        <div className="flex items-center space-x-10">
          <div className="hidden lg:flex flex-col items-end border-r border-[#E2E8F0] pr-10">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-0.5">Incoming Load</span>
            <span className="text-xl font-black text-[#111827] tabular-nums leading-none">{orders.length < 10 ? `0${orders.length}` : orders.length} <span className="text-[10px]">TICKETS</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-0.5">Last Sync</span>
              <span className="text-xs font-bold text-[#111827]">{lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
            </div>
            <button 
              onClick={() => getOrders(true)}
              className="p-2.5 bg-[#F8FAFC] hover:bg-[#EEF2F6] border border-[#E2E8F0] rounded-xl transition-all duration-300 active:scale-95 group"
              title="Manual Sync"
            >
              <RefreshCcw className={`w-5 h-5 text-[#6B7280] group-hover:text-[#22C55E] ${isRefreshing ? 'animate-spin' : 'transition-transform duration-700'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Surface Panel Grid */}
      <main className="max-w-[1920px] mx-auto px-10 pt-10 pb-20">
        <div className="surface-panel p-10 min-h-[calc(100vh-140px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
               <Loader2 className="w-12 h-12 text-[#22C55E] animate-spin mb-4" />
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6B7280]">Initializing Terminal...</div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-12 bg-white rounded-[2rem] border border-red-100 max-w-lg mx-auto shadow-sm">
               <AlertCircle className="w-12 h-12 text-red-500 mb-6" />
               <h2 className="text-xl font-bold text-[#111827] mb-2">Network Interruption</h2>
               <p className="text-sm text-[#6B7280] mb-8 leading-relaxed">System failed to establish connection with the primary order sync server. Operations may be impacted.</p>
               <button 
                 onClick={() => window.location.reload()}
                 className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-red-500/10"
               >
                 <RefreshCcw className="w-4 h-4" /> RETRY SYNC
               </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-20 bg-[#F1F5F9]/30 rounded-[3rem] border-2 border-dashed border-[#E2E8F0]">
              <div className="bg-white p-10 rounded-full mb-10 shadow-sm border border-[#E2E8F0]">
                  <ShoppingBag className="w-16 h-16 text-[#E2E8F0]" />
              </div>
              <h2 className="text-3xl font-black text-[#111827] mb-4 tracking-tight">Production Clear</h2>
              <p className="text-[#6B7280] max-w-sm text-lg font-medium leading-relaxed opacity-60">Standing by for incoming customer transmissions. Monitoring all station channels.</p>
              <div className="mt-12 flex space-x-3">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className="w-2 h-2 rounded-full bg-[#E2E8F0] animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                 ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
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
        </div>
      </main>

      {/* Operational Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#E2E8F0] px-10 py-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B7280] z-50">
          <div className="flex items-center space-x-12">
             <div className="flex items-center gap-2 text-[#22C55E]/80"><LayoutDashboard className="w-4 h-4" /> LIVE DISPATCH MONITOR</div>
             <div className="flex items-center gap-2 opacity-50"><div className="w-1.5 h-1.5 rounded-full bg-[#6B7280]"></div> LATENCY: 14MS</div>
          </div>
          <div className="text-[#111827]/40 tracking-[0.5em]">© KITCHEN OPS ENTERPRISE v2.4.0</div>
      </footer>
    </div>
  );
};

export default KitchenDashboard;
