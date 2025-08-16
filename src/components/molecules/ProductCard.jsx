import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card } from "@/components/atoms/Card";

const ProductCard = ({ 
  product,
  onAddToCart,
  onQuickView,
  className,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };
  
  const handleProductClick = () => {
    navigate(`/product/${product.Id}`);
  };
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };
  
  const handleQuickView = (e) => {
    e.stopPropagation();
    onQuickView?.(product);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group cursor-pointer", className)}
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <Card className="product-card h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
{!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
          )}
          
          {imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
              <ApperIcon name="ImageOff" className="w-8 h-8 mb-2" />
              <p className="text-sm text-center px-2">Image unavailable</p>
              {retryCount < 2 && (
                <button
                  onClick={() => {
                    setImageError(false);
                    setRetryCount(prev => prev + 1);
                  }}
                  className="text-xs text-gold-600 hover:text-gold-700 mt-1"
                >
                  Retry
                </button>
              )}
            </div>
          ) : (
            <img
              src={product.images?.[0]}
              alt={product.name}
              className={cn(
                "product-image-primary w-full h-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
              }}
              onError={() => {
                setImageLoaded(false);
                setImageError(true);
              }}
              key={retryCount}
            />
          )}
          
{product.images?.[1] && !imageError && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="product-image-secondary w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="primary" className="shadow-md">
                New
              </Badge>
            )}
            {product.discount && (
              <Badge variant="error" className="shadow-md">
                -{product.discount}%
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="warning" className="shadow-md">
                Low Stock
              </Badge>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className={cn(
            "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}>
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              title="Quick View"
            >
              <ApperIcon name="Eye" size={16} className="text-gray-600" />
            </button>
            <button
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              title="Add to Wishlist"
            >
              <ApperIcon name="Heart" size={16} className="text-gray-600" />
            </button>
          </div>
          
          {/* Quick Add to Cart */}
          <div className={cn(
            "absolute bottom-3 left-3 right-3 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full shadow-lg"
              disabled={product.stock === 0}
            >
              <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-gold-700 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{product.category}</p>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            {product.metal && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.metal}
              </span>
            )}
            {product.gemstone && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.gemstone}
              </span>
            )}
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ApperIcon name="Star" size={12} className="fill-yellow-400 text-yellow-400" />
                <span>{product.rating || "4.5"}</span>
                <span>({product.reviews || "24"})</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;