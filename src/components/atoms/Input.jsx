import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  size = "md",
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full border rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg"
  };
  
  const stateStyles = error 
    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:ring-gold-500 focus:border-gold-500";
  
  return (
    <input
      type={type}
      ref={ref}
      className={cn(baseStyles, sizes[size], stateStyles, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";
export default Input;