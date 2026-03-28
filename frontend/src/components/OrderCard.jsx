import React, { useState } from 'react';
import { Clock, User, CheckCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderCard = ({ order, onComplete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    // Let animation play for 600ms
    setTimeout(async () => {
      await onComplete(order._id);
    }, 600);
  };

  const formattedTime = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative bg-gray-900 border-l-8 ${isCompleting ? 'border-green-500 completed-anim' : 'border-orange-500'} 
        rounded-xl shadow-2xl overflow-hidden min-w-[320px] transition-all duration-300 hover:shadow-orange-500/10 hover:ring-1 hover:ring-orange-500/20`}
    >
      <div className="p-6">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded">
              ID: {order.orderId ? order.orderId : `#${order._id.slice(-6).toUpperCase()}`}
            </span>
            <div className="flex items-center mt-3 text-gray-100 font-bold text-xl uppercase tracking-tight">
              <User className="w-5 h-5 mr-2 text-gray-400" />
              {order.customerName || "Walk-in Guest"}
            </div>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center text-gray-400 text-sm font-medium">
               <Clock className="w-4 h-4 mr-1" />
               {formattedTime}
             </div>
             <div className="mt-2 text-2xl font-black text-gray-100">
                ₹{order.totalPrice || order.totalAmount || 0}
             </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3 my-6 border-y border-gray-800 py-6">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center group">
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-gray-800 text-orange-400 w-10 h-10 rounded-lg mr-3 group-hover:bg-orange-500/20 group-hover:text-orange-300 transition-colors duration-200">
                  <span className="font-bold text-lg">{item.quantity}</span>
                </div>
                <div className="text-lg font-semibold tracking-wide text-gray-200 group-hover:text-white transition-colors duration-200 uppercase">
                  {item.name}
                </div>
              </div>
              <div className="text-gray-500 font-medium tracking-tight">
                x ₹{item.price}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-4">
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className={`w-full py-4 rounded-xl flex items-center justify-center font-black text-lg transition-all transform active:scale-95 shadow-lg group
              ${isCompleting 
                ? 'bg-green-600 cursor-not-allowed opacity-80' 
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20 hover:shadow-orange-500/40'}`}
          >
            {isCompleting ? (
              <>
                <CheckCircle className="w-6 h-6 mr-3 animate-pulse" />
                MARKING COMPLETED...
              </>
            ) : (
              <>
                <Package className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                MARK AS COMPLETED
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
