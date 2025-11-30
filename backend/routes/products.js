import express from 'express'
import { supabase } from '../config/supabase.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        users (
          name,
          phone
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform data to match frontend expectations
    const products = data.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.image_url,
      sellerName: product.users?.name || 'Unknown',
      sellerPhone: product.users?.phone || 'N/A',
      sellerId: product.seller_id,
      createdAt: product.created_at
    }))

    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
})

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        users (
          name,
          phone
        )
      `)
      .eq('id', req.params.id)
      .single()

    if (error) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      })
    }

    const product = {
      id: data.id,
      name: data.name,
      price: data.price,
      description: data.description,
      imageUrl: data.image_url,
      sellerName: data.users?.name || 'Unknown',
      sellerPhone: data.users?.phone || 'N/A',
      sellerId: data.seller_id,
      createdAt: data.created_at
    }

    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
})

// Create product (protected)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body

    // Validate input
    if (!name || !price || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, price, and description are required' 
      })
    }

    let imageUrl = null

    // Upload image to Supabase Storage if provided
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`
      const filePath = `products/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return res.status(400).json({ 
          success: false, 
          message: `Failed to upload image: ${uploadError.message}` 
        })
      }

      // Get public URL
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      imageUrl = data.publicUrl
    }

    // Insert product into database
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          price: parseFloat(price),
          description,
          image_url: imageUrl,
          seller_id: req.user.id
        }
      ])
      .select(`
        *,
        users (
          name,
          phone
        )
      `)
      .single()

    if (error) throw error

    const product = {
      id: data.id,
      name: data.name,
      price: data.price,
      description: data.description,
      imageUrl: data.image_url,
      sellerName: data.users?.name || 'Unknown',
      sellerPhone: data.users?.phone || 'N/A',
      sellerId: data.seller_id,
      createdAt: data.created_at
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
})

// Update product (protected)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body
    const productId = req.params.id

    // Check if product exists and user owns it
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (fetchError || !existingProduct) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      })
    }

    if (existingProduct.seller_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this product' 
      })
    }

    let imageUrl = existingProduct.image_url

    // Upload new image if provided
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)
        imageUrl = publicUrl
      }
    }

    // Update product
    const { data, error } = await supabase
      .from('products')
      .update({
        name: name || existingProduct.name,
        price: price ? parseFloat(price) : existingProduct.price,
        description: description || existingProduct.description,
        image_url: imageUrl
      })
      .eq('id', productId)
      .select(`
        *,
        users (
          name,
          phone
        )
      `)
      .single()

    if (error) throw error

    const product = {
      id: data.id,
      name: data.name,
      price: data.price,
      description: data.description,
      image: data.image_url,
      sellerName: data.users?.name || 'Unknown',
      sellerPhone: data.users?.phone || 'N/A',
      createdAt: data.created_at
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
})

// Delete product (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id

    // Check if product exists and user owns it
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (fetchError || !existingProduct) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      })
    }

    if (existingProduct.seller_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this product' 
      })
    }

    // Delete product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) throw error

    res.json({
      success: true,
      message: 'Product deleted successfully'
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
