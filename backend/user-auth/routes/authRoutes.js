const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');

// User registration
router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;

  // Log request body details
  console.log('Signup request body:', req.body);

  // Create new user in Supabase Auth
  const { user, error: authError } = await supabase.auth.signUp({ email, password });

  // If there's an error with user creation, log it and send error response
  if (authError) {
    console.error('Supabase auth signup error:', authError);
    return res.status(400).json({ error: authError.message });
  }

  // User created successfully, log details and proceed
  console.log('Supabase user created:', user);

  // If user, attempt to insert additional details
  if (user) {
    const { data, error: insertError } = await supabase.from('Users').insert([
      {
        id: user.id, // assuming 'id' is the primary key and matches the Auth user id
        email: email,
        firstName: firstName,  // Insert first name into separate column
        lastName: lastName,   // Insert last name into separate column
        address: '',         // add address or any additional field if necessary
        phoneNumber,
        // ... any other user info fields
      }
    ]);

    // Log insert attempt details
    console.log('User data insert attempt:', { data, insertError });

    // Handle error on inserting additional user details
    if (insertError) {
      console.error('Error inserting user data:', insertError);
      // Optionally, you may want to roll back user creation in Auth if you want to keep both in sync
      // by deleting the auth user that was just created if you cannot insert into your Users table.
      await supabase.auth.api.deleteUser(user.id); // Consider adding error handling for deletion

      return res.status(400).json({ error: insertError.message });
    }

    // Everything went well, send back the success response
    return res.status(201).json({ message: 'Signup successful', user });
  } else {
    // Handle unexpected error during signup (shouldn't happen often)
    console.error('Unexpected error during signup:', authError);
    return res.status(500).json({ error: 'An unexpected error occurred during signup' });
  }
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
