import { toast } from 'react-toastify';

class ProductService {
  constructor() {
    // Initialize ApperClient
    this.getApperClient = () => {
      const { ApperClient } = window.ApperSDK;
      return new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    };
    
    this.tableName = 'product_c';
    this.fields = [
      { field: { Name: "Name" } },
      { field: { Name: "Tags" } },
      { field: { Name: "Owner" } },
      { field: { Name: "CreatedOn" } },
      { field: { Name: "CreatedBy" } },
      { field: { Name: "ModifiedOn" } },
      { field: { Name: "ModifiedBy" } },
      { field: { Name: "price_c" } },
      { field: { Name: "original_price_c" } },
      { field: { Name: "images_c" } },
      { field: { Name: "category_c" } },
      { field: { Name: "metal_c" } },
      { field: { Name: "gemstone_c" } },
      { field: { Name: "weight_c" } },
      { field: { Name: "sizes_c" } },
      { field: { Name: "stock_c" } },
      { field: { Name: "description_c" } },
      { field: { Name: "rating_c" } },
      { field: { Name: "reviews_c" } },
      { field: { Name: "is_new_c" } },
      { field: { Name: "discount_c" } }
    ];
  }

  // Transform database record to UI format
  transformProduct(dbProduct) {
    if (!dbProduct) return null;
    
    return {
      Id: dbProduct.Id,
      name: dbProduct.Name || '',
      price: parseFloat(dbProduct.price_c) || 0,
      originalPrice: parseFloat(dbProduct.original_price_c) || 0,
      images: dbProduct.images_c ? JSON.parse(dbProduct.images_c) : [],
      category: dbProduct.category_c || '',
      metal: dbProduct.metal_c || '',
      gemstone: dbProduct.gemstone_c || '',
      weight: dbProduct.weight_c || '',
      sizes: dbProduct.sizes_c ? JSON.parse(dbProduct.sizes_c) : [],
      stock: parseInt(dbProduct.stock_c) || 0,
      description: dbProduct.description_c || '',
      rating: parseFloat(dbProduct.rating_c) || 0,
      reviews: parseInt(dbProduct.reviews_c) || 0,
      isNew: dbProduct.is_new_c || false,
      discount: parseFloat(dbProduct.discount_c) || 0
    };
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }],
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

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = { fields: this.fields };
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }

      return this.transformProduct(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getByCategory(category) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products by category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getFeatured(limit = 8) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [
          {
            FieldName: "rating_c",
            Operator: "GreaterThanOrEqualTo",
            Values: ["4.5"]
          }
        ],
        orderBy: [{ fieldName: "rating_c", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching featured products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getNewArrivals(limit = 8) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [
          {
            FieldName: "is_new_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching new arrivals:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getSaleItems(limit = 8) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [
          {
            FieldName: "discount_c",
            Operator: "GreaterThan",
            Values: ["0"]
          }
        ],
        orderBy: [{ fieldName: "discount_c", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching sale items:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async search(query, filters = {}) {
    try {
      const apperClient = this.getApperClient();
      const whereConditions = [];

      // Text search across multiple fields
      if (query) {
        whereConditions.push({
          FieldName: "Name",
          Operator: "Contains",
          Values: [query]
        });
      }

      // Apply filters
      if (filters.category && filters.category.length > 0) {
        whereConditions.push({
          FieldName: "category_c",
          Operator: "Includes",
          Values: filters.category
        });
      }

      if (filters.metal && filters.metal.length > 0) {
        whereConditions.push({
          FieldName: "metal_c",
          Operator: "Includes",
          Values: filters.metal
        });
      }

      if (filters.gemstone && filters.gemstone.length > 0) {
        whereConditions.push({
          FieldName: "gemstone_c",
          Operator: "Includes",
          Values: filters.gemstone
        });
      }

      if (filters.price && Array.isArray(filters.price) && filters.price.length === 2) {
        const [minPrice, maxPrice] = filters.price;
        whereConditions.push({
          FieldName: "price_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [minPrice.toString()]
        });
        whereConditions.push({
          FieldName: "price_c",
          Operator: "LessThanOrEqualTo",
          Values: [maxPrice.toString()]
        });
      }

      const params = {
        fields: this.fields,
        where: whereConditions,
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getRelated(productId, limit = 4) {
    try {
      // First get the product to find its category
      const product = await this.getById(productId);
      if (!product) return [];

      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "category_c",
                    operator: "EqualTo",
                    values: [product.category]
                  }
                ],
                operator: "AND"
              },
              {
                conditions: [
                  {
                    fieldName: "metal_c",
                    operator: "EqualTo",
                    values: [product.metal]
                  }
                ],
                operator: "AND"
              }
            ]
          }
        ],
        where: [
          {
            FieldName: "Id",
            Operator: "NotEqualTo",
            Values: [productId]
          }
        ],
        orderBy: [{ fieldName: "rating_c", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching related products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
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