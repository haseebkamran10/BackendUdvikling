const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);
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
  