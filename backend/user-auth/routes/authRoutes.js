const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');


router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;

 
  console.log('Signup request body:', req.body);


  const { user, error: authError } = await supabase.auth.signUp({ email, password });

 
  if (authError) {
    console.error('Supabase auth signup error:', authError);
    return res.status(400).json({ error: authError.message });
  }


  console.log('Supabase user created:', user);


  if (user) {
    const { data, error: insertError } = await supabase.from('Users').insert([
      {
        id: user.id,
        email: email,
        firstName: firstName,  
        lastName: lastName,   
        address: '',   
        phoneNumber,

      }
    ]);


    console.log('User data insert attempt:', { data, insertError });

    if (insertError) {
      console.error('Error inserting user data:', insertError);
   

      await supabase.auth.api.deleteUser(user.id); 

      return res.status(400).json({ error: insertError.message });
    }

  
    return res.status(201).json({ message: 'Signup successful', user });
  } else {

    console.error('Unexpected error during signup:', authError);
    return res.status(500).json({ error: 'An unexpected error occurred during signup' });
  }
});


router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {

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

          console.error('Signin error:', error);
          return res.status(500).json({ error: 'An error occurred during sign-in' });
      }
    }


    return res.status(200).json({message: 'Sign in successful', user, session });
  } catch (error) {

    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

module.exports = router;
