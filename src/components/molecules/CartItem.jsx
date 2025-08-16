import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CartItem = ({ 
  item,
  product,
  onUpdateQuantity,
  onRemoveItem,
  className,
  ...props 
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) return;
    
    setQuantity(newQuantity);
onUpdateQuantity?.(item?.productId, newQuantity);
  };
  
  const handleRemove = () => {
onRemoveItem?.(item?.productId);
  };
  
  const total = product.price * quantity;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-4 p-4 bg-white border border-gray-200 rounded-lg", className)}
      {...props}
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
        )}
        <img
src={product?.images?.[0]}
          alt={product?.name || ''}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {product?.name || 'Unknown Product'}
            </h3>
            <p className="text-sm text-gray-600">{product?.category || ''}</p>
            {item?.size && (
              <p className="text-xs text-gray-500">Size: {item.size}</p>
            )}
          </div>
          
          <button
            onClick={handleRemove}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove item"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {product?.metal && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {product.metal}
            </span>
          )}
          {product?.gemstone && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {product.gemstone}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 p-0"
            >
              <ApperIcon name="Minus" size={14} />
            </Button>
            
            <span className="w-8 text-center text-sm font-medium">
              {quantity}
            </span>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
              className="w-8 h-8 p-0"
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>
          
          {/* Price */}
          <div className="text-right">
            <div className="font-semibold text-gray-900">
              {formatPrice(total)}
            </div>
            <div className="text-xs text-gray-500">
              {formatPrice(product.price)} each
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;