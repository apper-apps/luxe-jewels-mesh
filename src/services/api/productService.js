import productsData from "@/services/mockData/products.json";

class ProductService {
  constructor() {
    this.products = [...productsData];
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.products];
  }

  async getById(id) {
    await this.delay();
    const product = this.products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return { ...product };
  }

  async getByCategory(category) {
    await this.delay();
    return this.products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    ).map(p => ({ ...p }));
  }

  async getFeatured(limit = 8) {
    await this.delay();
    return this.products
      .filter(p => p.rating >= 4.5)
      .slice(0, limit)
      .map(p => ({ ...p }));
  }

  async getNewArrivals(limit = 8) {
    await this.delay();
    return this.products
      .filter(p => p.isNew)
      .slice(0, limit)
      .map(p => ({ ...p }));
  }

  async getSaleItems(limit = 8) {
    await this.delay();
    return this.products
      .filter(p => p.discount > 0)
      .slice(0, limit)
      .map(p => ({ ...p }));
  }

  async search(query, filters = {}) {
    await this.delay();
    let results = [...this.products];

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.metal.toLowerCase().includes(searchTerm) ||
        p.gemstone.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (filters.category && filters.category.length > 0) {
      results = results.filter(p => 
        filters.category.includes(p.category)
      );
    }

    if (filters.metal && filters.metal.length > 0) {
      results = results.filter(p => 
        filters.metal.includes(p.metal)
      );
    }

    if (filters.gemstone && filters.gemstone.length > 0) {
      results = results.filter(p => 
        filters.gemstone.includes(p.gemstone)
      );
    }

    if (filters.price && Array.isArray(filters.price)) {
      const [minPrice, maxPrice] = filters.price;
      results = results.filter(p => 
        p.price >= minPrice && p.price <= maxPrice
      );
    }

    return results.map(p => ({ ...p }));
  }

  async getRelated(productId, limit = 4) {
    await this.delay();
    const product = this.products.find(p => p.Id === parseInt(productId));
    if (!product) return [];

    return this.products
      .filter(p => 
        p.Id !== parseInt(productId) && 
        (p.category === product.category || p.metal === product.metal)
      )
      .slice(0, limit)
      .map(p => ({ ...p }));
  }

  sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
      case "price-low":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-high":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "name":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "rating":
        return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return sortedProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case "featured":
      default:
        return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }
}

export default new ProductService();