import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from "framer-motion";


export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
        key="cart"
          initial={{ x: "500", opacity:0 }}
          animate={{ x: 0, opacity:1 }}
          exit={{ x: "500",opactiy :0 }}
          transition={{ 
            type:"spring",
            stiffness:120,
            damping:18
           }}
          className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-xl sm:top-0 sm:right-0 sm:h-full sm:w-96 dark:from-blue-950 dark:via-blue-900 dark:to-blue-900"
        >
  
        <div className="flex items-center justify-between border-b border-amber-200 p-4 md:p-6 dark:border-blue-800">
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-slate-100">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-amber-100 dark:text-slate-100 dark:hover:bg-blue-800/60"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-center text-gray-500 dark:text-white">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex space-x-3 border-b border-amber-200 pb-4 md:space-x-4 dark:border-blue-800">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-900 md:text-base dark:text-slate-100">{item.name}</h3>
                      <p className="text-amber-600 font-bold text-sm md:text-base">${item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="rounded p-1 hover:bg-amber-100 dark:hover:bg-blue-800/60"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm md:text-base dark:text-slate-100">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="rounded p-1 hover:bg-amber-100 dark:hover:bg-blue-800/60"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-amber-200 p-4 md:space-y-4 md:p-6 dark:border-blue-800">
              <div className="flex justify-between text-sm text-gray-600 md:text-base dark:text-white">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 md:text-base dark:text-white">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-amber-200 pt-3 text-lg font-bold text-gray-900 md:pt-4 md:text-xl dark:border-blue-800 dark:text-slate-100">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors text-sm md:text-base font-medium"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
         </motion.div>
    )}
  </AnimatePresence>
);

}
