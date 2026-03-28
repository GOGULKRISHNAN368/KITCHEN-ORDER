import React, { useState } from 'react';
import { Clock, CheckCircle, MoreHorizontal, Info, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderCard = ({ order, onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      await onComplete(order.orderId);
    } catch (err) {
      setIsProcessing(false);
      console.error("Order completion failed:", err);
    }
  };

  const formattedTime = new Date(order.createdAt).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'preparing') return 'badge-preparing';
    return 'badge-pending';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      className="order-card p-4 flex flex-col gap-4"
    >
      {/* Ticket Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${order.status?.toLowerCase() === 'preparing' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              {order.orderId || "GUEST"}
            </span>
          </div>
          <h3 className="text-sm font-black text-gray-900 leading-none">
            {order.customerName || "Terminal Order"}
          </h3>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
            <Clock className="w-3 h-3 text-gray-300" />
            {formattedTime}
          </div>
          <div className="text-xs font-black text-gray-800">
            ₹{(order.totalAmount || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-50 -mx-4"></div>

      {/* Items Section */}
      <div className="space-y-4 py-1">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex gap-3 items-start">
            <div className="w-6 h-6 shrink-0 bg-gray-50 border border-gray-100 rounded flex items-center justify-center text-[11px] font-black text-gray-600">
              {item.quantity}
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-extrabold text-gray-700 leading-tight uppercase tracking-tight">
                {item.name}
              </span>
              
              {/* Pill Badges for Preferences */}
              {item.preference && (
                <div className="flex flex-wrap gap-1">
                  {item.preference.split(',').map((p, i) => (
                    <span key={i} className="text-[9px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {p.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Special Instructions Bubble */}
              {item.customDescription && (
                <div className="bg-emerald-50/50 p-2 rounded-md border border-emerald-100/50 flex gap-2 items-start">
                  <Info className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-[10px] font-bold text-emerald-700/80 leading-normal italic">
                    {item.customDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2 pt-2">
        <button
          onClick={handleComplete}
          disabled={isProcessing}
          className="flex-1 ready-button h-10 rounded-lg flex items-center justify-center gap-2 text-white font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
        >
          {isProcessing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              READY TO TRANSMIT
            </>
          )}
        </button>
        <button className="w-10 h-10 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default OrderCard;
