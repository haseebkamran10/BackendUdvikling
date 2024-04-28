const express = require('express');
const cors = require('cors');
const supabase = require('../services/supabaseClient');

const router = express.Router();

// Apply CORS middleware to allow cross-origin requests
router.use(cors());

router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;

  try {
    // Attempt Supabase signup
    const { user, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (user) {
      // Insert user data only if signup is successful
      const { data, error: insertError } = await supabase.from('Users').insert([
        {
          id: user.id,
          email,
          firstName,
          lastName,
          address: '',
          phoneNumber,
        },
      ]);

      if (insertError) {
        // Cleanup user if data insertion fails
        await supabase.auth.api.deleteUser(user.id);
        return res.status(400).json({ error: insertError.message });
      }

      // User creation successful, send response
      return res.status(201).json({ message: 'Signup successful', user });
    }
  } catch (error) {
    // Handle any unexpected errors during signup process
    console.error('Error during signup:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const { user, session, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    switch (error.code) {
      case 'auth/wrong-password':
        return res.status(400).json({ error: 'Incorrect email or password' });
      case 'auth/user-not-found':
        return res.status(400).json({ error: 'Email not found' });
      case 'network':
        return res.status(500).json({ error: 'Network error during sign-in' });
      default:
        return res.status(500).json({ error: 'An error occurred during sign-in' });
    }
  }

  return res.status(200).json({ message: 'Sign in successful', user, session });
});

module.exports = router;
