import express from 'express'
import { supabase, supabaseAdmin } from '../config/supabase.js'

const router = express.Router()

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body

    // Validate input
    if (!name || !phone || !email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      })
    }

    // Validate role
    if (!['buyer', 'seller'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role. Must be buyer or seller' 
      })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role
        },
        emailRedirectTo: `${process.env.APP_URL || 'http://localhost:5173'}/auth/callback`
      }
    })

    if (authError) {
      // Handle specific signup errors
      if (authError.message.includes('already registered')) {
        return res.status(400).json({ 
          success: false, 
          message: 'This email is already registered. Please login instead.' 
        })
      }
      
      if (authError.message.includes('Password')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Password must be at least 6 characters long.' 
        })
      }

      return res.status(400).json({ 
        success: false, 
        message: authError.message 
      })
    }

    // Auto-confirm email for development (using admin client)
    if (process.env.NODE_ENV === 'development') {
      try {
        await supabaseAdmin.auth.admin.updateUserById(authData.user.id, {
          email_confirm: true
        })
        console.log('Email auto-confirmed for development')
      } catch (confirmError) {
        console.error('Failed to auto-confirm email:', confirmError)
      }
    }

    // Insert user profile into users table using admin client (bypasses RLS)
    console.log('Creating user profile for:', authData.user.id)
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authData.user.id,
          name,
          phone,
          email,
          role
        }
      ])
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error details:', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      })
      
      // Try to clean up auth user since profile creation failed
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError)
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create user profile. Please try again.',
        error: profileError.message
      })
    }

    console.log('User profile created successfully:', profileData)

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name,
          phone,
          role
        },
        session: authData.session
      }
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      })
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      // Handle specific Supabase auth errors
      if (error.message.includes('Invalid login credentials')) {
        // Check if user exists
        const { data: userCheck } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single()

        if (!userCheck) {
          return res.status(401).json({ 
            success: false, 
            message: 'User does not exist. Please sign up first.' 
          })
        } else {
          return res.status(401).json({ 
            success: false, 
            message: 'Incorrect password. Please try again.' 
          })
        }
      }
      
      return res.status(401).json({ 
        success: false, 
        message: error.message || 'Invalid credentials' 
      })
    }

    // Get user profile using admin client
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError)
      return res.status(500).json({
        success: false,
        message: 'User profile not found. Please contact support.'
      })
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name,
          phone: profile?.phone,
          role: profile?.role
        },
        session: data.session
      }
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      })
    }

    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
})

export default router
