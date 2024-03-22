
const supabase = require('@supabase/supabase-js')
class Category {

 // Get all categories
 static async findAll() {
  const { data, error } = await supabase.from('Categories').select('*');
  if (error) throw error;
  return data;
}

// Find a single one by ID
static async findById(id) {
  const { data, error } = await supabase.from('Categories').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
// Find a single category by name
static async findByName(name) {
  const { data, error } = await supabase.from('Categories').select('*').eq('name',name).single;
  if (error) throw error;
  return data;
}

  
static async findByNameOrDescription(search) {
  let query = supabase
    .from('Categories')
    .select('*');
  
     if (search) {
        query = query
          .ilike('name', `%${search}%`)
          .or(`description.ilike.%${search}%`);
      }
  
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  }
  
  
module.exports = Category;