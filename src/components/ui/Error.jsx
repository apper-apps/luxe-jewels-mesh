import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Error = ({ error, onRetry, title = "Something went wrong", variant = "default", className, ...props }) => {
  const getErrorIcon = () => {
    if (error?.message?.includes('image') || error?.message?.includes('Image')) {
      return 'ImageOff';
    }
    if (error?.message?.includes('network') || error?.message?.includes('Network')) {
      return 'WifiOff';
    }
    return 'AlertTriangle';
  };

  const getErrorMessage = () => {
    if (error?.message) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return "An unexpected error occurred. Please try again.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        variant === "compact" && "p-4",
        className
      )}
      {...props}
    >
      <div className={cn(
        "rounded-full bg-red-50 p-4 mb-4",
        variant === "compact" && "p-2 mb-2"
      )}>
        <ApperIcon 
          name={getErrorIcon()} 
          className={cn(
            "w-8 h-8 text-red-500",
            variant === "compact" && "w-6 h-6"
          )} 
        />
      </div>
      
      <h3 className={cn(
        "text-lg font-semibold text-gray-900 mb-2",
        variant === "compact" && "text-base mb-1"
      )}>
        {title}
      </h3>
      
      <p className={cn(
        "text-gray-600 mb-6 max-w-md",
        variant === "compact" && "text-sm mb-3"
      )}>
        {getErrorMessage()}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size={variant === "compact" ? "sm" : "default"}
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;