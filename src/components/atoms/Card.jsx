import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className,
  children,
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden";
  const hoverStyles = hover ? "transition-all duration-300 hover:shadow-md hover:scale-[1.02]" : "";
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pb-4", className)} {...props}>
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

const CardContent = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-4", className)} {...props}>
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };