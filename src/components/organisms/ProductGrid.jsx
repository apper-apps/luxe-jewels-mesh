import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ProductGrid = ({ 
  products = [],
  loading = false,
  error = null,
  onProductClick,
  onAddToCart,
  onQuickView,
  sortBy = "featured",
  viewMode = "grid",
  onSortChange,
  onViewModeChange,
  showFilters = true,
  className,
  ...props 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name A-Z" },
    { value: "rating", label: "Highest Rated" }
  ];
  
  const viewModes = [
    { value: "grid", icon: "Grid3X3", label: "Grid View" },
    { value: "list", icon: "List", label: "List View" }
  ];
  
  // Calculate pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);
  
  // Reset page when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <Error error={error} onRetry={() => window.location.reload()} />;
  }
  
  if (products.length === 0) {
    return (
      <Empty
        title="No products found"
        description="Try adjusting your filters or search terms to find what you're looking for."
        actionText="Clear Filters"
        onAction={() => window.location.reload()}
      />
    );
  }
  
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Toolbar */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} products
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-sm text-gray-600">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange?.(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {viewModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => onViewModeChange?.(mode.value)}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === mode.value
                      ? "bg-white shadow-sm text-gold-600"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                  title={mode.label}
                >
                  <ApperIcon name={mode.icon} size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Products Grid/List */}
      <div className={cn(
        "grid gap-6",
        viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      )}>
        <AnimatePresence mode="wait">
          {currentProducts.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                className={viewMode === "list" ? "flex" : ""}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ApperIcon name="ChevronLeft" size={16} />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;
              
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "w-8 h-8 text-sm rounded-md transition-all",
                      isCurrentPage
                        ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span key={page} className="px-1 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;