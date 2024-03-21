
const supabase = require('@supabase/supabase-js')
class Category {
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