import { useState, useEffect } from "react";
import productService from "@/services/api/productService";

export const useProducts = (category = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  return {
    products,
    loading,
    error,
    refetch: loadProducts
  };
};

export const useFeaturedProducts = (limit = 8) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getFeatured(limit);
        setProducts(data);
      } catch (err) {
        setError(err.message || "Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useNewArrivals = (limit = 8) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getNewArrivals(limit);
        setProducts(data);
      } catch (err) {
        setError(err.message || "Failed to load new arrivals");
      } finally {
        setLoading(false);
      }
    };

    loadNewArrivals();
  }, [limit]);

  return { products, loading, error };
};

export const useProductSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.search(query, filters);
      setResults(data);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search
  };
};