
const supabase = require('@supabase/supabase-js')
class Products {

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
  // Find a single product by name
  static async findByName(name) {
    const { data, error } = await supabase.from('Products').select('*').eq('name',name).single;
    if (error) throw error;
    return data;
  }


// Retrieve filtered products
static async filterProducts(filters) {
  try {
    let query = supabase.from('Products').select('*');

    if (filters.category) {
      query = query.eq('category_id', filters.category); 
    }

    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice); 
    }

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice); 
    }

    const { data: products, error } = await query;
    if (error) {
      throw new Error('Error fetching filtered products:', error); 
    }

    return products;
  } catch (error) {
    console.error('Error in filterProducts:', error);
    throw error; // Re-throw the error for handling in calling function
  }
 }
  

}

module.exports = Products;
