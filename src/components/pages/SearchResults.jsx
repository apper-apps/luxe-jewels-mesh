import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import ProductGrid from "@/components/organisms/ProductGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useProductSearch } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";

const SearchResults = ({ className, ...props }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { results, loading, error, search } = useProductSearch();
  const { addToCart } = useCart();
  
  const [appliedFilters, setAppliedFilters] = useState({});
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  
  const query = searchParams.get("q") || "";

  const searchSuggestions = [
    "Diamond Rings",
    "Gold Necklace", 
    "Pearl Earrings",
    "Silver Bracelet",
    "Wedding Rings",
    "Engagement Rings",
    "Tennis Bracelet",
    "Statement Necklace"
  ];

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    await search(query, appliedFilters);
  };

  const handleNewSearch = (newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    }
  };

  const handleFilterChange = (filterType, values) => {
    const newFilters = {
      ...appliedFilters,
      [filterType]: values
    };
    setAppliedFilters(newFilters);
    
    // Re-run search with new filters
    search(query, newFilters);
  };

  const handleClearFilters = () => {
    setAppliedFilters({});
    search(query, {});
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

  if (loading && !results.length) {
    return <Loading />;
  }

  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)} {...props}>
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button 
            onClick={() => navigate("/")}
            className="hover:text-gold-600"
          >
            Home
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-gray-900">Search Results</span>
        </nav>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleNewSearch}
            suggestions={searchSuggestions}
            className="max-w-2xl"
            placeholder={`Search for "${query}" or try something else...`}
          />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-lg text-gray-600">
                {loading ? (
                  "Searching..."
                ) : results.length === 0 ? (
                  <>No results found for <span className="font-medium">"{query}"</span></>
                ) : (
                  <>
                    {results.length} {results.length === 1 ? 'result' : 'results'} for{" "}
                    <span className="font-medium">"{query}"</span>
                  </>
                )}
              </p>
            )}
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

        {/* Search Suggestions */}
        {!query && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {searchSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleNewSearch(suggestion)}
                  className="px-3 py-1.5 text-sm text-gold-700 bg-gold-50 hover:bg-gold-100 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {query && (
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
            {error ? (
              <Error error={error} onRetry={performSearch} />
            ) : results.length === 0 && !loading ? (
              <Empty
                title="No products found"
                description={`We couldn't find any jewelry matching "${query}". Try adjusting your search terms or browse our categories below.`}
                icon="Search"
                actionText="Browse All Products"
                onAction={() => navigate("/products")}
              />
            ) : (
              <ProductGrid
                products={results}
                loading={loading}
                error={error}
                onAddToCart={handleAddToCart}
                sortBy={sortBy}
                viewMode={viewMode}
                onSortChange={handleSortChange}
                onViewModeChange={handleViewModeChange}
                showFilters={true}
              />
            )}
          </div>
        </div>
      )}

      {/* No Query State */}
      {!query && (
        <div className="text-center py-12">
          <div className="max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Search" size={32} className="text-gold-600" />
            </div>
            
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              What are you looking for?
            </h2>
            <p className="text-gray-600 mb-8">
              Enter a search term above to find your perfect piece of jewelry, or browse our popular categories.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {["Rings", "Necklaces", "Earrings", "Bracelets"].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                  className="h-12"
                >
                  <ApperIcon name="Sparkles" size={16} className="mr-2" />
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;