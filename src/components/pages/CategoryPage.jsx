import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import ProductGrid from "@/components/organisms/ProductGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";

const CategoryPage = ({ className, ...props }) => {
  const { category } = useParams();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (category) {
        data = await productService.getByCategory(category);
      } else {
        data = await productService.getAll();
      }
      
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  useEffect(() => {
    applyFilters();
  }, [products, appliedFilters, sortBy]);

  const applyFilters = () => {
    let filtered = [...products];

    // Apply filters
    Object.keys(appliedFilters).forEach(filterType => {
      const filterValues = appliedFilters[filterType];
      if (filterValues && filterValues.length > 0) {
        switch (filterType) {
          case 'price':
            if (Array.isArray(filterValues) && filterValues.length === 2) {
              const [minPrice, maxPrice] = filterValues;
              filtered = filtered.filter(product => 
                product.price >= minPrice && product.price <= maxPrice
              );
            }
            break;
          case 'category':
            filtered = filtered.filter(product => 
              filterValues.includes(product.category)
            );
            break;
          case 'metal':
            filtered = filtered.filter(product => 
              filterValues.includes(product.metal)
            );
            break;
          case 'gemstone':
            filtered = filtered.filter(product => 
              filterValues.includes(product.gemstone)
            );
            break;
          default:
            break;
        }
      }
    });

    // Apply sorting
    const sorted = productService.sortProducts(filtered, sortBy);
    setFilteredProducts(sorted);
  };

  const handleFilterChange = (filterType, values) => {
    setAppliedFilters(prev => ({
      ...prev,
      [filterType]: values
    }));
  };

  const handleClearFilters = () => {
    setAppliedFilters({});
  };

  const handleAddToCart = (product) => {
    addToCart(product.Id);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
  };

  const getCategoryTitle = () => {
    if (!category) return "All Products";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

const getCategoryDescription = () => {
    const descriptions = {
      rings: "Discover our exquisite collection of rings, from elegant engagement rings to fashion-forward statement pieces and traditional toe rings.",
      necklaces: "Explore beautiful necklaces that add elegance and sophistication to any outfit, from delicate chains to elaborate temple jewelry.",
      earrings: "Find the perfect earrings to complement your style, from traditional jhumkas and chandbali to modern studs and statement pieces.",
      bracelets: "Browse our stunning bracelet collection, featuring timeless designs and modern innovations in gold, silver, and precious stones.",
      mangalsutras: "Sacred symbols of marriage, our mangalsutra collection combines traditional significance with contemporary elegance for the modern bride.",
      bangles: "Traditional Indian bangles in gold, silver, and designer patterns - essential accessories that celebrate heritage and style.",
      pendants: "Elegant pendants featuring religious motifs, nature-inspired designs, and contemporary patterns - perfect for gifting or personal treasures.",
      "maang-tikkas": "Graceful forehead jewelry that completes your traditional look - from simple designs to elaborate bridal maang tikkas.",
      "nose-pins": "Delicate nose jewelry in traditional and modern styles, crafted in gold and silver with precious stone accents.",
      anklets: "Beautiful anklets and payals that add musical charm to your steps, available in traditional and contemporary designs.",
      "toe-rings": "Traditional toe rings symbolizing marital bliss, crafted in silver and gold with intricate patterns and comfort fit.",
      "diamond-jewelry": "Luxurious diamond collection featuring certified diamonds in contemporary and classic settings for special occasions.",
      "gold-coins": "Investment-grade gold coins in various weights, perfect for festivals, gifts, and building your precious metals portfolio.",
      "gemstone-jewelry": "Vibrant gemstone jewelry featuring rubies, emeralds, sapphires, and semi-precious stones in traditional and modern designs.",
      watches: "Discover luxury timepieces that combine precision engineering with exceptional design, perfect for gifting or personal collection."
    };
    
    return descriptions[category] || "Discover our complete collection of luxury jewelry pieces that celebrate tradition and embrace modern elegance.";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} onRetry={loadProducts} />;
  }

  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)} {...props}>
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button className="hover:text-gold-600">Home</button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-gray-900">{getCategoryTitle()}</span>
        </nav>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {getCategoryTitle()}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              {getCategoryDescription()}
            </p>
          </div>
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gold-500 transition-colors"
            >
              <ApperIcon name="Filter" size={16} />
              Filters
              {Object.keys(appliedFilters).length > 0 && (
                <span className="bg-gold-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {Object.values(appliedFilters).reduce((count, values) => 
                    count + (Array.isArray(values) ? values.length : (values ? 1 : 0)), 0
                  )}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8">
            <FilterSidebar
              appliedFilters={appliedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearFilters}
            />
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="p-4">
                <FilterSidebar
                  appliedFilters={appliedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearFilters}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
            onAddToCart={handleAddToCart}
            sortBy={sortBy}
            viewMode={viewMode}
            onSortChange={handleSortChange}
            onViewModeChange={handleViewModeChange}
            showFilters={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;