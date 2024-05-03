const request = require('supertest');
const app = require('../../index');
jest.mock('../../--mocks--/supabaseClient.js');


describe('Product Controller', () => {
  describe('GET /products', () => {
    test('should fetch all products successfully', async () => {
      const response = await request(app)
        .get('/products')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(Array.isArray(response.body)).toBeTruthy(); 
    });

    test('should handle errors in fetching products', async () => {
      const response = await request(app)
        .get('/products')
        .expect(500);  

      expect(response.body.error).toBeDefined();  
    });
  });
});

describe('GET /products/:id', () => {
  test('should fetch a single product successfully', async () => {
    const productId = 12;  
    const response = await request(app)
      .get(`/products/${productId}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id', productId);  
  });

  test('should return 404 if the product is not found', async () => {
    const productId = '59999999'; 
    const response = await request(app)
      .get(`/products/${productId}`)
      .expect(404); 
    expect(response.body.error).toBeDefined();  
  });

  test('should handle server errors', async () => {
    const productId = 'error-causing-id';  
    const response = await request(app)
      .get(`/products/${productId}`)
      .expect(500);  

    expect(response.body.error).toBeDefined(); 

  });
    test('should fetch all products successfully', async () => {
      const response = await request(app).get('/products').expect(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toEqual('SS Ton Gladiator');
  });

    test('should return not found for a non-existent product', async () => {
      const response = await request(app).get('/products/59999999').expect(404);
      expect(response.body).toEqual([]); 
  });
 
});
