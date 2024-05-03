const request = require('supertest');
const app = require('../../index');
jest.mock('../../--mocks--/supabaseClient.js');

describe('Authentication routes', () => {
    beforeEach(() => {
        require('../../--mocks--/supabaseClient').resetMocks();
    });

    test('User signup should succeed', async () => {
        const response = await request(app)
            .post('/signup')
            .send({ email: 'newuser@example.com', password: 'password123'})
            .expect(201);

        expect(response.body.message).toBe('Signup successful');
        expect(response.body.user).toBeDefined();
    });

    test('User signup should handle errors', async () => {
        const response = await request(app)
            .post('/signup')
            .send({ email: 'error@example.com', password: 'password123' })
            .expect(400);

        expect(response.body.error).toBe('Signup failed');
    });

    test('User login should succeed', async () => {
        const response = await request(app)
            .post('/signin')
            .send({ email: 'fathi-1998@outlook.dk', password: 'Test1234' })
            .expect(200);

        expect(response.body.message).toBe('Sign in successful');
        expect(response.body.user).toBeDefined();
    });

    test('User login should fail for wrong credentials', async () => {
        const response = await request(app)
            .post('/signin')
            .send({ email: 'fathi-1998@outlook.dk', password: 'Test123445554' })
            .expect(400);

        expect(response.body.error).toBe('Login failed');
    });
});