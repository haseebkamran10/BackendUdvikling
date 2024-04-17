
const supabase = require('@supabase/supabase-js')
class Products {
  // Create a new product
  static async create(product) {
    const { data, error } = await supabase.from('Products').insert([product]);
    if (error) throw error;
    return data;
  }

  // Get all products
  static async findAll() {
    const { data, error } = await supabase.from('Products').select('*');
    if (error) throw error;
    return data;
  }

  // Find a single product by ID
  static async findById(id) {
    const { data, error } = await supabase.from('Products').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  // Update a product by ID
  static async updateById(id, updates) {
    const { data, error } = await supabase.from('Products').update(updates).eq('id', id);
    if (error) throw error;
    return data;
  }

  // Delete a product by ID
  static async deleteById(id) {
    const { data, error } = await supabase.from('Products').delete().eq('id', id);
    if (error) throw error;
    return data;
  }
  // Retrieve filtered products
  static async findFiltered({ category, minPrice, maxPrice, search }) {
    let query = supabase.from('Products').select(`
      *,
      Categories(name)
    `);

    if (category) {
      query = query.eq('category_id', category);
    }
    if (minPrice) {
      query = query.gte('price', minPrice);
    }
    if (maxPrice) {
      query = query.lte('price', maxPrice);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`).or(`description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
  

}

module.exports = Products;
