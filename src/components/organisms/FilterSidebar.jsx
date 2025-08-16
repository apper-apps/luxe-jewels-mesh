import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PriceRange from "@/components/molecules/PriceRange";

const FilterSidebar = ({ 
  filters,
  appliedFilters = {},
  onFilterChange,
  onClearAll,
  className,
  ...props 
}) => {
  const [openSections, setOpenSections] = useState({
    price: true,
    category: true,
    metal: true,
    gemstone: true,
    size: false,
    brand: false
  });
  
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleFilterSelect = (filterType, value) => {
    const currentValues = appliedFilters[filterType] || [];
    let newValues;
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    onFilterChange?.(filterType, newValues);
  };
  
  const handlePriceChange = (range) => {
    onFilterChange?.('price', range);
  };
  
  const getAppliedFiltersCount = () => {
    return Object.values(appliedFilters).reduce((count, values) => {
      if (Array.isArray(values)) {
        return count + values.length;
      }
      return count + (values ? 1 : 0);
    }, 0);
  };
  
  const appliedCount = getAppliedFiltersCount();
  
const filterSections = [
    {
      key: 'category',
      title: 'Category',
      options: ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Mangalsutras', 'Bangles', 'Pendants', 'Maang Tikkas', 'Nose Pins', 'Anklets', 'Toe Rings', 'Diamond Jewelry', 'Gold Coins', 'Gemstone Jewelry', 'Watches']
    },
    {
      key: 'metal',
      title: 'Metal Type',
      options: ['Gold', 'Silver', 'Platinum', 'Rose Gold', 'White Gold', 'Kundan', 'Meenakari', 'Antique Gold']
    },
    {
      key: 'gemstone',
      title: 'Gemstone',
      options: ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'Polki', 'Kundan', 'Coral', 'Turquoise', 'Amethyst', 'Topaz', 'Garnet']
    },
    {
      key: 'size',
      title: 'Size',
      options: ['XS', 'S', 'M', 'L', 'XL', 'Adjustable', 'One Size']
    },
    {
      key: 'brand',
      title: 'Brand',
      options: ['Heritage Collection', 'Temple Jewelry', 'Bridal Elegance', 'Contemporary Craft', 'Royal Traditions', 'Designer Series']
    }
  ];
  
  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg", className)} {...props}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {appliedCount > 0 && (
            <Badge variant="primary" size="sm">
              {appliedCount} applied
            </Badge>
          )}
        </div>
        
        {appliedCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="w-full"
          >
            <ApperIcon name="X" size={14} className="mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>
      
      {/* Price Range */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h4 className="font-medium text-gray-900">Price Range</h4>
          <ApperIcon 
            name={openSections.price ? "ChevronUp" : "ChevronDown"} 
            size={16}
            className="text-gray-500"
          />
        </button>
        
        <AnimatePresence>
          {openSections.price && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PriceRange
                min={0}
                max={10000}
                value={appliedFilters.price || [0, 10000]}
                onChange={handlePriceChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Other Filter Sections */}
      {filterSections.map((section) => (
        <div key={section.key} className="p-6 border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleSection(section.key)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h4 className="font-medium text-gray-900">{section.title}</h4>
            <div className="flex items-center gap-2">
              {appliedFilters[section.key]?.length > 0 && (
                <Badge variant="primary" size="sm">
                  {appliedFilters[section.key].length}
                </Badge>
              )}
              <ApperIcon 
                name={openSections[section.key] ? "ChevronUp" : "ChevronDown"} 
                size={16}
                className="text-gray-500"
              />
            </div>
          </button>
          
          <AnimatePresence>
            {openSections[section.key] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {section.options.map((option) => {
                  const isSelected = appliedFilters[section.key]?.includes(option);
                  return (
                    <label
                      key={option}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleFilterSelect(section.key, option)}
                        className="w-4 h-4 text-gold-600 bg-white border-gray-300 rounded focus:ring-gold-500 focus:ring-2"
                      />
                      <span className={cn(
                        "text-sm transition-colors",
                        isSelected 
                          ? "text-gray-900 font-medium" 
                          : "text-gray-600 group-hover:text-gray-900"
                      )}>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      
      {/* Quick Filters */}
      <div className="p-6">
        <h4 className="font-medium text-gray-900 mb-4">Quick Filters</h4>
        <div className="space-y-2">
          <button
            onClick={() => onFilterChange?.('quickFilter', 'bestsellers')}
            className="w-full text-left text-sm text-gray-600 hover:text-gold-600 py-1"
          >
            Best Sellers
          </button>
          <button
            onClick={() => onFilterChange?.('quickFilter', 'new')}
            className="w-full text-left text-sm text-gray-600 hover:text-gold-600 py-1"
          >
            New Arrivals
          </button>
          <button
            onClick={() => onFilterChange?.('quickFilter', 'sale')}
            className="w-full text-left text-sm text-gray-600 hover:text-gold-600 py-1"
          >
            On Sale
          </button>
          <button
            onClick={() => onFilterChange?.('quickFilter', 'under-500')}
            className="w-full text-left text-sm text-gray-600 hover:text-gold-600 py-1"
          >
            Under $500
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;