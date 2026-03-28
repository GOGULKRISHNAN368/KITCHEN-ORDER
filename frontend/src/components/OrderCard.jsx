import React, { useState } from 'react';
import { Clock, CheckCircle, Package, Loader2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderCard = ({ order, onComplete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      // Wait for the exit animation duration before calling the removal logic
      setTimeout(async () => {
        try {
          await onComplete(order._id);
        } catch (err) {
          setIsCompleting(false);
          console.error("Error in onComplete:", err);
        }
      }, 600);
    } catch (err) {
      setIsCompleting(false);
      console.error("handleComplete failed:", err);
    }
  };

  const formattedTime = new Date(order.createdAt).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`kds-card group ${isCompleting ? 'completed-anim' : ''}`}
    >
      <div className="p-8">
        {/* Terminal Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#22C55E]">Terminal Order</span>
            </div>
            <h2 className="text-2xl font-black text-[#111827] tracking-tight truncate max-w-[200px]">
              {order.customerName || "GUEST STATION"}
            </h2>
            <p className="text-[10px] font-bold text-[#6B7280] tracking-widest uppercase opacity-60">
              ID: {order.orderId || (order._id ? `#${order._id.toString().slice(-6).toUpperCase()}` : "N/A")}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end text-[#6B7280] text-[10px] font-black gap-1.5 mb-2 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 text-[#22C55E]/60" />
              {formattedTime}
            </div>
            <div className="text-2xl font-black text-[#111827] tabular-nums">
              ₹{(order.totalPrice || order.totalAmount || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="h-px bg-[#E2E8F0] w-full mb-8"></div>

        {/* Food Items List */}
        <div className="space-y-6 mb-10">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="qty-badge shrink-0">
                {item.quantity}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-base font-extrabold text-[#111827] uppercase tracking-wide leading-tight">
                    {item.name}
                  </h3>
                </div>
                
                {/* Modifiers & Chips */}
                {item.preference && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.preference.split(',').map((p, i) => (
                      <span key={i} className="text-[9px] font-extrabold bg-[#F1F5F9] text-[#6B7280] px-2.5 py-1 rounded-md border border-[#E2E8F0] uppercase tracking-wider">
                        {p.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Special Request Box */}
                {item.customDescription && (
                  <div className="bg-[#22C55E]/5 p-3 rounded-xl border border-[#22C55E]/10 flex gap-2.5 items-start">
                    <Info className="w-3.5 h-3.5 text-[#22C55E] mt-0.5 shrink-0" />
                    <p className="text-[11px] font-bold text-[#22C55E]/80 leading-relaxed italic">
                      {item.customDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Global Dispatch Button */}
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className={`ready-button w-full py-5 rounded-full flex items-center justify-center gap-3 text-white font-black text-xs uppercase tracking-[0.4em] relative overflow-hidden ${isCompleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isCompleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>TRANSMITTING...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>READY TO TRANSMIT</span>
            </>
          )}
          {/* Animated Shine */}
          {!isCompleting && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite]"></div>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default OrderCard;

