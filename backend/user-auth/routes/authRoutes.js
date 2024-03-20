const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');

// User registration
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  
  // New user in Supabase
  const { user, error } = await supabase.auth.signUp({ email, password });
  
  // If there's an error, send it back
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Otherwise, send back the new user data
  return res.status(201).json({ message: 'Signup successful', user });
});

// Handle user login
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Attempt sign-in with Supabase
      const { user, session, error } = await supabase.auth.signInWithPassword({ email, password });
  
      if (error) {
        // Differentiate error types for better feedback
        switch (error.code) {
          case 'auth/wrong-password':
            return res.status(400).json({ error: 'Incorrect email or password' });
          case 'auth/user-not-found':
            return res.status(400).json({ error: 'Email not found' });
          case 'network':
            return res.status(500).json({ error: 'Network error during sign-in' });
          default:
            // Handle other unknown errors
            console.error('Signin error:', error);
            return res.status(500).json({ error: 'An error occurred during sign-in' });
        }
      }
  
      // Login successful, send user and session data
      return res.status(200).json({ user, session });
    } catch (error) {
      // Catch unexpected errors
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  });
  

module.exports = router;