import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  // Simulate API delay
  delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.categories];
  }

  async getById(id) {
    await this.delay();
    const category = this.categories.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return { ...category };
  }

  async getBySlug(slug) {
    await this.delay();
    const category = this.categories.find(c => c.slug === slug);
    if (!category) {
      throw new Error(`Category with slug ${slug} not found`);
    }
    return { ...category };
  }
}

export default new CategoryService();