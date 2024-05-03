const mockSupabaseClient = {
    auth: {
        signUp: jest.fn((credentials) => {
            if (credentials.email === "error@example.com") {
                return Promise.resolve({ user: null, error: { message: "Signup failed" } });
            }
            return Promise.resolve({ user: { id: 'user123', email: credentials.email }, error: null });
        }),
        signInWithPassword: jest.fn((credentials) => {
            if (credentials.email === "error@example.com") {
                return Promise.resolve({ user: null, session: null, error: { message: "Login failed" } });
            }
            return Promise.resolve({ user: { id: 'user123', email: credentials.email }, session: { token: "fake-token" }, error: null });
        }),
        api: {
            deleteUser: jest.fn((userId) => Promise.resolve({ data: { message: "User deleted" }, error: null }))
        }
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn(function() {
        if (this.eqFn) {
            return this.eqFn();
        }
        return Promise.resolve({
            data: [
                { id: '12', name: 'SS Ton Gladiator', price: 3499 },
                { id: '3', name: 'SG Sunny Gold', price: 3199 }
            ],
            error: null
        });
    }),
    eq: jest.fn((key, val) => {
        mockSupabaseClient.eqFn = () => {
            if (val === 'error-causing-id') {
                return Promise.resolve({ data: null, error: { message: 'Internal Server Error' } });
            } else if (val === '59999999') {
                return Promise.resolve({ data: [], error: null });
            } else {
                return Promise.resolve({ data: [{ id: val, name: 'Product', price: 20 }], error: null });
            }
        };
        return mockSupabaseClient;
    }),
    insert: jest.fn((data) => Promise.resolve({ data: data, error: null })),
    resetMocks: function() {
        this.eqFn = undefined;
        this.auth.signUp.mockClear();
        this.auth.signInWithPassword.mockClear();
        this.auth.api.deleteUser.mockClear();
    }
};

module.exports = mockSupabaseClient;
