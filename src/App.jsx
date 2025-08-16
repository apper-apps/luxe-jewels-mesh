import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CheckoutPage from "@/components/pages/CheckoutPage";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import SearchResults from "@/components/pages/SearchResults";
import CategoryPage from "@/components/pages/CategoryPage";
import ProductDetail from "@/components/pages/ProductDetail";
import Home from "@/components/pages/Home";
import CartDrawer from "@/components/organisms/CartDrawer";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, updateQuantity, removeItem, getItemCount } = useCart();
  const { products } = useProducts();

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    // Navigate to checkout page (not implemented in this demo)
    console.log("Proceeding to checkout...");
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header 
          cartCount={getItemCount()} 
          onCartClick={handleCartClick}
        />
        
        <main className="flex-1">
<Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/products" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/new-arrivals" element={<CategoryPage />} />
          <Route path="/collections" element={<CategoryPage />} />
          <Route path="/sale" element={<CategoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
        
        <Footer />
        
<CartDrawer
          isOpen={isCartOpen}
          onClose={handleCartClose}
          cartItems={cartItems}
          products={products}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={handleCheckout}
        />
        
        <ToastContainer
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
}

export default App;