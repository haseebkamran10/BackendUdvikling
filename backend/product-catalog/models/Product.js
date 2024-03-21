const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

class Product {
  // Create a new product
  static async create(product) {
    const { data, error } = await supabase.from('products').insert([product]);
    if (error) throw error;
    return data;
  }

  // Get all products
  static async findAll() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  }

  // Find a single product by ID
  static async findById(id) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  // Update a product by ID
  static async updateById(id, updates) {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id);
    if (error) throw error;
    return data;
  }

  // Delete a product by ID
  static async deleteById(id) {
    const { data, error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return data;
  }
  // Retrieve filtered products
  static async findFiltered({ category, minPrice, maxPrice }) {
    let query = supabase.from('products').select('*');

    if (category) {
      query = query.in('category', Array.isArray(category) ? category : [category]);
    }

    if (minPrice) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice) {
      query = query.lte('price', maxPrice);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
  

}

module.exports = Product;
