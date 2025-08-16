import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ cartCount = 0, onCartClick, className, ...props }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const navigate = useNavigate();
  
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
  
  const categories = [
    {
      name: "Rings",
      items: ["Engagement Rings", "Wedding Bands", "Fashion Rings", "Stackable Rings"]
    },
    {
      name: "Necklaces",
      items: ["Diamond Necklaces", "Gold Chains", "Pearl Necklaces", "Statement Pieces"]
    },
    {
      name: "Earrings",
      items: ["Stud Earrings", "Drop Earrings", "Hoop Earrings", "Chandelier Earrings"]
    },
    {
      name: "Bracelets",
      items: ["Tennis Bracelets", "Gold Bracelets", "Charm Bracelets", "Bangles"]
    }
  ];
  
  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSubmenu(null);
  };
  
  const handleSubmenuToggle = (categoryName) => {
    setActiveSubmenu(activeSubmenu === categoryName ? null : categoryName);
  };
  
  return (
    <header className={cn("sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200", className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-gold-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Gem" size={20} className="text-white" />
            </div>
            <span className="font-display text-xl lg:text-2xl font-bold text-gray-900">
              SANDOOK LUXE
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {categories.map((category) => (
              <div 
                key={category.name}
                className="relative group"
                onMouseEnter={() => setActiveSubmenu(category.name)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
<Link
                  to={`/category/${category.name.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                >
                  {category.name}
                </Link>
                
                {/* Mega Menu */}
                <AnimatePresence>
                  {activeSubmenu === category.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
                    >
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <Link
key={item}
                            to={`/category/${category.name.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block text-sm text-gray-600 hover:text-blue-600 py-1 transition-colors"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
<Link
              to="/collections"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Collections
            </Link>
            
            <Link
to="/new-arrivals"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              to="/sale"
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Sale
            </Link>
          </nav>
          
          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar
                onSearch={handleSearch}
                suggestions={searchSuggestions}
                className="w-64"
              />
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
{/* Mobile Search */}
              <button className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <ApperIcon name="Search" size={20} />
              </button>
              
{/* Wishlist */}
              <button className="hidden sm:block p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <ApperIcon name="Heart" size={20} />
              </button>
              
{/* Cart */}
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ApperIcon name="ShoppingBag" size={20} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-gold-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 text-gray-700 hover:text-gold-600 transition-colors"
              >
                <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search (when search is active) */}
        <div className="md:hidden border-t border-gray-200 px-4 py-3">
          <SearchBar
            onSearch={handleSearch}
            suggestions={searchSuggestions}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-6 space-y-4">
              {categories.map((category) => (
                <div key={category.name}>
                  <button
                    onClick={() => handleSubmenuToggle(category.name)}
                    className="flex items-center justify-between w-full text-left text-gray-900 font-medium py-2"
                  >
                    <span>{category.name}</span>
                    <ApperIcon 
                      name={activeSubmenu === category.name ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {activeSubmenu === category.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 space-y-2 overflow-hidden"
                      >
                        {category.items.map((item) => (
                          <Link
                            key={item}
                            to={`/category/${category.name.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block text-sm text-gray-600 py-1"
                            onClick={toggleMenu}
                          >
                            {item}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              <Link
                to="/collections"
                className="block text-gray-900 font-medium py-2"
                onClick={toggleMenu}
              >
                Collections
              </Link>
              
              <Link
                to="/new-arrivals"
                className="block text-gray-900 font-medium py-2"
                onClick={toggleMenu}
              >
                New Arrivals
              </Link>
              
              <Link
                to="/sale"
                className="block text-red-600 font-medium py-2"
                onClick={toggleMenu}
              >
                Sale
              </Link>
              
              <div className="pt-4 border-t border-gray-200">
                <Button variant="primary" className="w-full">
                  <ApperIcon name="Heart" size={16} className="mr-2" />
                  Wishlist
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;