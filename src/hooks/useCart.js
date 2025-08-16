import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import cartService from "@/services/api/cartService";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getAll();
      setCartItems(data);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, size = null) => {
    try {
      const updatedCart = await cartService.addItem(productId, quantity, size);
      setCartItems(updatedCart);
      toast.success("Item added to cart!");
      return true;
    } catch (err) {
      toast.error("Failed to add item to cart");
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const updatedCart = await cartService.updateQuantity(productId, quantity);
      setCartItems(updatedCart);
      return true;
    } catch (err) {
      toast.error("Failed to update quantity");
      return false;
    }
  };

  const removeItem = async (productId) => {
    try {
      const updatedCart = await cartService.removeItem(productId);
      setCartItems(updatedCart);
      toast.success("Item removed from cart");
      return true;
    } catch (err) {
      toast.error("Failed to remove item");
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const updatedCart = await cartService.clear();
      setCartItems(updatedCart);
      toast.success("Cart cleared");
      return true;
    } catch (err) {
      toast.error("Failed to clear cart");
      return false;
    }
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
    refetch: loadCart
  };
};