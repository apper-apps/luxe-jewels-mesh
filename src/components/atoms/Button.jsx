import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
  
const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-gold-600 text-white hover:from-blue-700 hover:to-gold-700 shadow-md hover:shadow-lg focus:ring-blue-500",
    secondary: "bg-white border-2 border-blue-500 text-blue-700 hover:bg-blue-50 focus:ring-blue-500",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-700 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg",
    xl: "px-8 py-4 text-xl rounded-xl"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;