import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found",
  description = "We couldn't find any items matching your criteria.",
  actionText = "Explore Collection",
  onAction,
  icon = "Search",
  className,
  ...props 
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      window.location.href = "/";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("flex flex-col items-center justify-center text-center p-12", className)}
      {...props}
    >
      {/* Empty State Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-24 h-24 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mb-8"
      >
        <ApperIcon name={icon} size={40} className="text-gold-600" />
      </motion.div>
      
      {/* Empty State Content */}
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="font-display text-2xl font-bold text-gray-900">
          {title}
        </h2>
        
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
        
        {/* Suggestions */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="font-medium text-gray-900 mb-3">Try these suggestions:</h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <ApperIcon name="Check" size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>Adjust your search filters or criteria</span>
            </li>
            <li className="flex items-start gap-2">
              <ApperIcon name="Check" size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>Browse our featured jewelry collections</span>
            </li>
            <li className="flex items-start gap-2">
              <ApperIcon name="Check" size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>Check back later for new arrivals</span>
            </li>
            <li className="flex items-start gap-2">
              <ApperIcon name="Check" size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>Contact us for custom jewelry requests</span>
            </li>
          </ul>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button onClick={handleAction} size="lg">
            <ApperIcon name="Gem" size={16} className="mr-2" />
            {actionText}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = "/category/rings"}
          >
            <ApperIcon name="Sparkles" size={16} className="mr-2" />
            Browse Rings
          </Button>
        </div>
        
        {/* Popular Categories */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Popular categories</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {["Rings", "Necklaces", "Earrings", "Bracelets"].map((category) => (
              <button
                key={category}
                onClick={() => window.location.href = `/category/${category.toLowerCase()}`}
                className="px-3 py-1.5 text-sm text-gold-700 bg-gold-50 hover:bg-gold-100 rounded-full transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;