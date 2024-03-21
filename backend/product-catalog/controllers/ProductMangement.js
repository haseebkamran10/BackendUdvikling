// First, you need to initialize the Supabase client
const supabase = require('../services/supabaseClient');

// Create a new product
async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product]);
  
  if (error) throw error;
  return data;
}

// Retrieve a list of products
async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) throw error;
  return data;
}

// Retrieve a single product by id
async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Update a product
async function updateProduct(id, updatedFields) {
  const { data, error } = await supabase
    .from('products')
    .update(updatedFields)
    .eq('id', id);
  
  if (error) throw error;
  return data;
}

// Delete a product
async function deleteProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return data;
}
