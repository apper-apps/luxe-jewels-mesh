import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";

const CartDrawer = ({ 
  isOpen,
  onClose,
  cartItems = [],
  products = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  className,
  ...props 
}) => {
const getProductById = (productId) => {
    return (products || []).find(product => product?.Id == productId);
  };
  
  const calculateSubtotal = () => {
return (cartItems || []).reduce((total, item) => {
      const product = getProductById(item?.productId);
      if (product) {
        return total + ((product?.price || 0) * (item?.quantity || 0));
      }
      return total;
    }, 0);
  };
  
  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };
  
  const calculateShipping = (subtotal) => {
    return subtotal > 500 ? 0 : 25; // Free shipping over $500
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };
  
  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;
  
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col",
              className
            )}
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="font-display text-xl font-bold text-gray-900">
                  Shopping Cart
                </h2>
                <p className="text-sm text-gray-600">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ApperIcon name="ShoppingBag" size={24} className="text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Discover our exquisite jewelry collections and add some sparkle to your cart.
                  </p>
                  <Button onClick={onClose} className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
{(cartItems || []).map((item) => {
                    const product = getProductById(item?.productId);
                    if (!product) return null;
                    
                    return (
                      <CartItem
                        key={item.productId}
                        item={item}
                        product={product}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveItem={onRemoveItem}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">{formatPrice(tax)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-lg text-gray-900">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="space-y-3">
<Button 
                    onClick={onCheckout}
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-600 to-gold-600 hover:from-blue-700 hover:to-gold-700"
                  >
                    <ApperIcon name="CreditCard" size={16} className="mr-2" />
                    Secure Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
                
                {/* Free Shipping Notice */}
                {shipping > 0 && (
                  <div className="text-xs text-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <ApperIcon name="Truck" size={14} className="inline mr-1" />
                    Add {formatPrice(500 - subtotal)} more for free shipping!
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;