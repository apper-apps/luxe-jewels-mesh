import cartItemsData from "@/services/mockData/cartItems.json";

class CartService {
  constructor() {
    this.cartItems = [...cartItemsData];
    this.loadFromLocalStorage();
  }

  // Simulate API delay
  delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('luxe-jewels-cart');
      if (stored) {
        this.cartItems = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error loading cart from localStorage:', error);
    }
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('luxe-jewels-cart', JSON.stringify(this.cartItems));
    } catch (error) {
      console.warn('Error saving cart to localStorage:', error);
    }
  }

  async getAll() {
    await this.delay();
    return [...this.cartItems];
  }

  async addItem(productId, quantity = 1, size = null) {
    await this.delay();
    
    const existingItem = this.cartItems.find(item => 
      item.productId === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newId = Math.max(...this.cartItems.map(item => item.Id), 0) + 1;
      const newItem = {
        Id: newId,
        productId: productId,
        quantity: quantity,
        size: size,
        addedAt: new Date().toISOString()
      };
      this.cartItems.push(newItem);
    }

    this.saveToLocalStorage();
    return [...this.cartItems];
  }

  async updateQuantity(productId, quantity) {
    await this.delay();
    
    const item = this.cartItems.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
      } else {
        item.quantity = quantity;
      }
    }

    this.saveToLocalStorage();
    return [...this.cartItems];
  }

  async removeItem(productId) {
    await this.delay();
    
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.saveToLocalStorage();
    return [...this.cartItems];
  }

  async clear() {
    await this.delay();
    
    this.cartItems = [];
    this.saveToLocalStorage();
    return [];
  }

  async getItemCount() {
    await this.delay();
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
}

export default new CartService();