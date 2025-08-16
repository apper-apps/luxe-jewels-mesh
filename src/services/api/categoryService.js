import { toast } from 'react-toastify';

class CategoryService {
  constructor() {
    // Initialize ApperClient
    this.getApperClient = () => {
      const { ApperClient } = window.ApperSDK;
      return new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    };
    
    this.tableName = 'category_c';
    this.fields = [
      { field: { Name: "Name" } },
      { field: { Name: "Tags" } },
      { field: { Name: "Owner" } },
      { field: { Name: "CreatedOn" } },
      { field: { Name: "CreatedBy" } },
      { field: { Name: "ModifiedOn" } },
      { field: { Name: "ModifiedBy" } },
      { field: { Name: "slug_c" } },
      { field: { Name: "image_c" } },
      { field: { Name: "product_count_c" } }
    ];
  }

  // Transform database record to UI format
  transformCategory(dbCategory) {
    if (!dbCategory) return null;
    
    return {
      Id: dbCategory.Id,
      name: dbCategory.Name || '',
      slug: dbCategory.slug_c || '',
      image: dbCategory.image_c || '',
      productCount: parseInt(dbCategory.product_count_c) || 0
    };
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }],
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

      return response.data.map(category => this.transformCategory(category));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
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

      return this.transformCategory(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getBySlug(slug) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [
          {
            FieldName: "slug_c",
            Operator: "EqualTo",
            Values: [slug]
          }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      return this.transformCategory(response.data[0]);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with slug ${slug}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
}

export default new CategoryService();