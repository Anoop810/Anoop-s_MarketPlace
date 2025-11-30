import { supabaseAdmin } from '../config/supabase.js'

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    console.log('Auth middleware - Header:', authHeader ? 'Present' : 'Missing')
    console.log('Auth middleware - Token:', token ? token.substring(0, 20) + '...' : 'Not found')

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      })
    }

    // Verify token with Supabase using admin client
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      console.error('Token verification failed:', error?.message || 'No user found')
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      })
    }

    console.log('Auth successful for user:', user.id)
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error',
      error: error.message 
    })
  }
}
