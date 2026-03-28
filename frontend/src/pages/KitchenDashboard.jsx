import React, { useState, useEffect, useCallback } from 'react';
import { fetchOrders, completeOrder } from '../api';
import OrderCard from '../components/OrderCard';
import { ChefHat, RefreshCcw, LayoutDashboard, Loader2, AlertCircle, ShoppingBag, Radio, Package, Inbox } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js';

const socket = io('http://localhost:5000'); // Central relay station

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
      // Filter for actionable orders (pending or preparing)
      const pendingOrders = response.data.filter(o => 
        o.status?.toLowerCase() === 'pending' || o.status?.toLowerCase() === 'preparing'
      );
      setOrders(pendingOrders);
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
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      await completeOrder(orderId);
      toast.success('System Transmitted', {
        icon: '✅',
        style: { borderRadius: '12px', background: '#111827', color: '#fff', fontSize: '11px', fontWeight: 'bold' },
      });
    } catch (err) {
      console.error("Order completion failed:", err);
      toast.error('Transmission Sync Error');
      getOrders(); 
    }
  };

  useEffect(() => {
    getOrders();

    socket.on('orderCreated', (newOrder) => {
      console.log('📡 New Traffic Detected:', newOrder);
      const statusLower = newOrder.status?.toLowerCase();
      if (statusLower === 'pending' || statusLower === 'preparing') {
        setOrders(prev => [newOrder, ...prev]);
        setLastSync(new Date());
        toast.success('New Order Received', {
          icon: '📥',
          style: { background: '#22C55E', color: '#fff', borderRadius: '10px' }
        });
      }
    });

    socket.on('orderUpdated', (updatedOrder) => {
      console.log('📡 Order Relay Update:', updatedOrder);
      setOrders(prev => {
        const exists = prev.some(o => o.orderId === updatedOrder.orderId);
        const statusLower = updatedOrder.status?.toLowerCase();
        if (exists) {
          if (statusLower === 'completed') {
            return prev.filter(o => o.orderId !== updatedOrder.orderId);
          }
          return prev.map(o => o.orderId === updatedOrder.orderId ? updatedOrder : o);
        } else if (statusLower === 'pending' || statusLower === 'preparing') {
          return [updatedOrder, ...prev];
        }
        return prev;
      });
      setLastSync(new Date());
    });

    socket.on('orderCompleted', (completedOrder) => {
      console.log('📡 Transmission Complete:', completedOrder.orderId);
      setOrders(prev => prev.filter(o => o.orderId !== completedOrder.orderId));
      setLastSync(new Date());
    });

    return () => {
      socket.off('orderCreated');
      socket.off('orderUpdated');
      socket.off('orderCompleted');
    };
  }, [getOrders]);

  const getStatusColumn = (status) => {
    return orders.filter(o => {
        const currentStatus = o.status?.toLowerCase() || 'pending';
        return currentStatus === status.toLowerCase();
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] font-outfit text-[#111827] w-full flex flex-col">
      <Toaster position="top-right" />
      
      {/* SaaS Glass Header */}
      <nav className="glass-header sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center gap-4">
           <div className="bg-[#22C55E] p-1.5 rounded-lg shadow-sm">
             <ChefHat className="w-5 h-5 text-white" />
           </div>
           <div>
             <h1 className="text-lg font-black tracking-tighter text-[#111827] leading-none mb-1">Kitchen Ops</h1>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></div>
                <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest">System Online</span>
             </div>
           </div>
        </div>

        {/* Center: Station */}
        <div className="hidden lg:flex items-center gap-3 bg-[#F1F5F9] px-6 py-2 rounded-full border border-gray-100">
           <Radio className="w-3.5 h-3.5 text-gray-400" />
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Alpha Main Line</span>
        </div>

        {/* Right: Metrics */}
        <div className="flex items-center gap-8">
           <div className="hidden sm:flex flex-col items-end">
             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Pending Load</span>
             <span className="text-xl font-black text-[#111827] tracking-tight">{orders.length < 10 ? `0${orders.length}` : orders.length} <span className="text-[9px] opacity-20">TICKETS</span></span>
           </div>

           <div className="flex items-center gap-3 border-l border-gray-100 pl-8">
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-40 leading-none mb-1">Sync</p>
                <p className="text-[11px] font-black text-[#111827]">{lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
              </div>
              <button 
                onClick={() => getOrders(true)}
                className="p-2.5 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all active:scale-95"
              >
                <RefreshCcw className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
           </div>
        </div>
      </nav>

      {/* Kanban Order Board */}
      <main className="flex-1 max-w-[1800px] mx-auto w-full px-6 py-6 overflow-hidden">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)]">
                <Loader2 className="w-8 h-8 text-[#22C55E] animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Syncing with Relay Station...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden">
               {/* COLUMN: Pending */}
               <div className="flex flex-col h-full gap-4">
                  <div className="flex justify-between items-center px-2">
                     <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        Pending Orders
                     </span>
                     <span className="badge-pending px-2 py-0.5 rounded-full text-[10px] font-black">{getStatusColumn('pending').length}</span>
                  </div>
                  <div className="kanban-column flex-1 overflow-y-auto p-4 space-y-4">
                     <AnimatePresence mode="popLayout">
                        {getStatusColumn('pending').length === 0 ? (
                           <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                              <Inbox className="w-12 h-12 text-gray-200 mb-4" />
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">All Clear</p>
                           </div>
                        ) : (
                          getStatusColumn('pending').map(order => (
                             <OrderCard key={order.orderId} order={order} onComplete={handleCompleteOrder} />
                          ))
                        )}
                     </AnimatePresence>
                  </div>
               </div>

               {/* COLUMN: Preparing */}
               <div className="flex flex-col h-full gap-4">
                  <div className="flex justify-between items-center px-2">
                     <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Preparing
                     </span>
                     <span className="badge-preparing px-2 py-0.5 rounded-full text-[10px] font-black">{getStatusColumn('preparing').length}</span>
                  </div>
                  <div className="kanban-column flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {getStatusColumn('preparing').map(order => (
                           <OrderCard key={order.orderId} order={order} onComplete={handleCompleteOrder} />
                        ))}
                     </AnimatePresence>
                  </div>
               </div>

               {/* COLUMN: Ready */}
               <div className="flex flex-col h-full gap-4 opacity-50">
                  <div className="flex justify-between items-center px-2">
                     <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        Ready to Transmit
                     </span>
                     <span className="badge-ready px-2 py-0.5 rounded-full text-[10px] font-black">0</span>
                  </div>
                  <div className="kanban-column flex-1 flex flex-col items-center justify-center p-4">
                     <Package className="w-12 h-12 text-gray-100 mb-4" />
                     <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] max-w-[120px] text-center italic">Ready orders are instantly transmitted</p>
                  </div>
               </div>
            </div>
          )}
      </main>

      {/* Footer / Status */}
      <footer className="bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-gray-300">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2 text-emerald-500/60"><LayoutDashboard className="w-3.5 h-3.5" /> Operations Live</div>
             <div>Channel: Delta-7</div>
          </div>
          <div className="opacity-60 font-medium">Kitchen Ops v3.0 // Professional Edition</div>
      </footer>
    </div>
  );
};

export default KitchenDashboard;
