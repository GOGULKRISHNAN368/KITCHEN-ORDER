import React, { useState } from 'react';
import { Clock, User, CheckCircle, Package, ShoppingBag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderCard = ({ order, onComplete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    setTimeout(async () => {
      await onComplete(order._id);
    }, 700);
  };

  const formattedTime = new Date(order.createdAt).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative kds-card overflow-hidden group border-t border-[#E5E7EB] ${isCompleting ? 'completed-anim' : ''}`}
    >
      {/* Status Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#22C55E]/20 to-transparent group-hover:via-[#22C55E]/40 transition-all duration-500"></div>

      <div className="p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#22C55E]/80">Terminal Order</span>
             </div>
             <h2 className="text-xl font-black text-[#111827] uppercase tracking-tighter">
                {order.customerName || "GUEST STATION"}
             </h2>
             <p className="text-[10px] font-bold text-[#6B7280] tracking-widest uppercase">
                ID: {order.orderId ? order.orderId : `#${order._id.slice(-6).toUpperCase()}`}
             </p>
          </div>
          <div className="text-right">
             <div className="flex items-center justify-end text-[#6B7280] text-xs font-bold gap-1.5 mb-2">
                <Clock className="w-3 h-3 text-[#22C55E]/40" />
                {formattedTime}
             </div>
             <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-[#111827] to-[#6B7280] tabular-nums">
                ₹{(order.totalPrice || order.totalAmount || 0).toLocaleString()}
             </div>
          </div>
        </div>

        {/* Item List */}
        <div className="mt-8 space-y-4 border-t border-[#E5E7EB] pt-8 mb-10">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 group/item">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] flex items-center justify-center border border-[#E5E7EB] group-hover/item:border-[#22C55E]/30 transition-colors duration-300">
                   <span className="text-lg font-black text-[#22C55E]">{item.quantity}</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E5E7EB] border border-[#E5E7EB] rounded-full scale-0 group-hover/item:scale-100 transition-transform duration-300"></div>
              </div>

              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                   <span className="text-sm font-black text-[#111827] uppercase tracking-wide truncate group-hover/item:text-black transition-colors">
                     {item.name}
                   </span>
                   <span className="text-[10px] font-black text-[#6B7280] tabular-nums whitespace-nowrap">@ ₹{item.price}</span>
                </div>
                
                {(item.preference || item.customDescription) && (
                  <div className="space-y-2">
                    {item.preference && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.preference.split(',').map((p, i) => (
                          <span key={i} className="text-[9px] font-black bg-[#F1F5F9] text-[#6B7280] px-2 py-0.5 rounded-full border border-[#E5E7EB] uppercase tracking-wider">
                            {p.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.customDescription && (
                      <div className="relative bg-[#F6F8FA] p-2.5 rounded-xl border-l-2 border-[#22C55E]/20 overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 opacity-5">
                           <ShoppingBag className="w-8 h-8 rotate-12" />
                        </div>
                        <p className="text-[10px] font-medium italic text-[#6B7280] leading-relaxed relative z-10">
                          <span className="text-[#22C55E]/70 not-italic mr-1 text-[8px] font-black uppercase">REQ:</span>
                          "{item.customDescription}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className={`w-full group/btn relative overflow-hidden py-5 rounded-[1.5rem] flex items-center justify-center font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 active:scale-95 shadow-lg
            ${isCompleting 
              ? 'bg-[#22C55E]/10 text-[#22C55E] cursor-not-allowed border border-[#22C55E]/10' 
              : 'bg-[#22C55E] hover:bg-[#16A34A] text-white border border-[#22C55E]/20 shadow-[#22C55E]/20'}`}
        >
          {/* Hover Glow Effect */}
          {!isCompleting && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
          )}
          
          {isCompleting ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-[#22C55E]" />
              <span>DISPATCHING...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-white group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300" />
              <span>READY TO TRANSMIT</span>
            </div>
          )}
        </button>
      </div>

      {/* Decorative Ornaments */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#22C55E]/5 rounded-full blur-3xl -z-10 group-hover:bg-[#22C55E]/10 transition-colors duration-500"></div>
    </motion.div>
  );
};

export default OrderCard;
