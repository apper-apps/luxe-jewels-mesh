import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";

const PriceRange = ({ 
  min = 0, 
  max = 10000, 
  step = 100,
  value = [0, 10000],
  onChange,
  className,
  ...props 
}) => {
  const [range, setRange] = useState(value);
  
  useEffect(() => {
    setRange(value);
  }, [value]);
  
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    const newRange = [Math.min(newMin, range[1]), range[1]];
    setRange(newRange);
    onChange?.(newRange);
  };
  
  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    const newRange = [range[0], Math.max(newMax, range[0])];
    setRange(newRange);
    onChange?.(newRange);
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };
  
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="flex items-center justify-between text-sm font-medium text-gray-700">
        <span>Price Range</span>
        <span className="text-gold-600">
          {formatPrice(range[0])} - {formatPrice(range[1])}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range[0]}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
        <div className="relative h-2 bg-gray-200 rounded-lg">
          <div
            className="absolute h-2 bg-gradient-to-r from-gold-400 to-gold-500 rounded-lg"
            style={{
              left: `${(range[0] - min) / (max - min) * 100}%`,
              width: `${(range[1] - range[0]) / (max - min) * 100}%`
            }}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Min</label>
          <input
            type="number"
            min={min}
            max={range[1]}
            step={step}
            value={range[0]}
            onChange={handleMinChange}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Max</label>
          <input
            type="number"
            min={range[0]}
            max={max}
            step={step}
            value={range[1]}
            onChange={handleMaxChange}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRange;