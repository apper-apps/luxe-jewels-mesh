import { toast } from 'react-toastify';

class CartService {
  constructor() {
    // Initialize ApperClient
    this.getApperClient = () => {
      const { ApperClient } = window.ApperSDK;
      return new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    };
    
    this.tableName = 'cart_item_c';
    this.fields = [
      { field: { Name: "Name" } },
      { field: { Name: "Tags" } },
      { field: { Name: "Owner" } },
      { field: { Name: "CreatedOn" } },
      { field: { Name: "CreatedBy" } },
      { field: { Name: "ModifiedOn" } },
      { field: { Name: "ModifiedBy" } },
      { field: { Name: "product_id_c" } },
      { field: { Name: "quantity_c" } },
      { field: { Name: "size_c" } },
      { field: { Name: "added_at_c" } }
    ];
  }

  // Transform database record to UI format
  transformCartItem(dbItem) {
    if (!dbItem) return null;
    
    return {
      Id: dbItem.Id,
      productId: dbItem.product_id_c?.Id || dbItem.product_id_c || '',
      quantity: parseInt(dbItem.quantity_c) || 1,
      size: dbItem.size_c || null,
      addedAt: dbItem.added_at_c || new Date().toISOString()
    };
  }

  // Transform UI format to database format for creation/updates
  transformToDbFormat(uiItem) {
    return {
      Name: `Cart Item ${uiItem.productId}`,
      product_id_c: parseInt(uiItem.productId),
      quantity_c: parseInt(uiItem.quantity),
      size_c: uiItem.size,
      added_at_c: uiItem.addedAt || new Date().toISOString()
    };
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        orderBy: [{ fieldName: "added_at_c", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(item => this.transformCartItem(item));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching cart items:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async addItem(productId, quantity = 1, size = null) {
    try {
      const apperClient = this.getApperClient();
      
      // Check if item already exists
      const existingItems = await this.getAll();
      const existingItem = existingItems.find(item => 
        item.productId == productId && item.size === size
      );

      if (existingItem) {
        // Update existing item
        return await this.updateQuantity(productId, existingItem.quantity + quantity);
      } else {
        // Create new item
        const newItem = {
          productId: productId,
          quantity: quantity,
          size: size,
          addedAt: new Date().toISOString()
        };
        
        const dbItem = this.transformToDbFormat(newItem);
        
        const params = {
          records: [dbItem]
        };
        
        const response = await apperClient.createRecord(this.tableName, params);
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return [];
        }
        
        if (response.results) {
          const failedRecords = response.results.filter(result => !result.success);
          
          if (failedRecords.length > 0) {
            console.error(`Failed to create cart item ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
            
            failedRecords.forEach(record => {
              record.errors?.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`);
              });
              if (record.message) toast.error(record.message);
            });
          }
        }
      }
      
      return await this.getAll();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding item to cart:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async updateQuantity(productId, quantity) {
    try {
      const apperClient = this.getApperClient();
      
      // First get all items to find the one to update
      const items = await this.getAll();
      const item = items.find(item => item.productId == productId);
      
      if (!item) {
        console.error(`Cart item with product ID ${productId} not found`);
        return await this.getAll();
      }

      if (quantity <= 0) {
        return await this.removeItem(productId);
      }
      
      const updatedData = {
        quantity_c: parseInt(quantity)
      };
      
      const params = {
        records: [{
          Id: item.Id,
          ...updatedData
        }]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return await this.getAll();
      }
      
      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update cart items ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
      }
      
      return await this.getAll();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating cart quantity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return await this.getAll();
    }
  }

  async removeItem(productId) {
    try {
      const apperClient = this.getApperClient();
      
      // First get all items to find the one to remove
      const items = await this.getAll();
      const item = items.find(item => item.productId == productId);
      
      if (!item) {
        console.error(`Cart item with product ID ${productId} not found`);
        return await this.getAll();
      }
      
      const params = {
        RecordIds: [item.Id]
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return await this.getAll();
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete cart items ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
      }
      
      return await this.getAll();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing cart item:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return await this.getAll();
    }
  }

  async clear() {
    try {
      const items = await this.getAll();
      
      if (items.length === 0) {
        return [];
      }
      
      const apperClient = this.getApperClient();
      const params = {
        RecordIds: items.map(item => item.Id)
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return items;
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to clear cart items ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
      }
      
      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error clearing cart:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getItemCount() {
    try {
      const items = await this.getAll();
      return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error("Error getting cart item count:", error.message);
      return 0;
    }
  }
}

export default new CartService();
export default new CartService();