import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  error = "Something went wrong",
  onRetry,
  title = "Oops! Something went wrong",
  className,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("flex flex-col items-center justify-center text-center p-12", className)}
      {...props}
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
      </motion.div>
      
      {/* Error Content */}
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="font-display text-2xl font-bold text-gray-900">
          {title}
        </h2>
        
        <p className="text-gray-600 leading-relaxed">
          {typeof error === "string" ? error : "We encountered an unexpected error while loading your jewelry collection. Please try again or contact our support team if the problem persists."}
        </p>
        
        {/* Error Details */}
        {typeof error === "object" && error.message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <p className="text-sm text-red-800 font-medium mb-1">Error Details:</p>
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          {onRetry && (
            <Button onClick={onRetry} size="lg">
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = "/"}
          >
            <ApperIcon name="Home" size={16} className="mr-2" />
            Go to Homepage
          </Button>
        </div>
        
        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a 
              href="tel:1-800-LUXE-JEWELS" 
              className="flex items-center gap-1 text-gold-600 hover:text-gold-700 transition-colors"
            >
              <ApperIcon name="Phone" size={14} />
              1-800-LUXE-JEWELS
            </a>
            <a 
              href="mailto:support@luxejewels.com" 
              className="flex items-center gap-1 text-gold-600 hover:text-gold-700 transition-colors"
            >
              <ApperIcon name="Mail" size={14} />
              Support Email
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Error;