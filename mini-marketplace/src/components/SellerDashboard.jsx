import { useState } from 'react'

function SellerDashboard({ products, session, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: null
  })
  const [error, setError] = useState('')

  // Filter products for current seller
  const myProducts = (products || []).filter(p => 
    p.sellerName === session?.email || 
    p.sellerName === session?.name ||
    p.sellerId === session?.id ||
    p.seller_id === session?.id
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e) => {
    setError('')
    const file = e.target.files[0]
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        e.target.value = ''
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file')
        e.target.value = ''
        return
      }
      
      setFormData({ ...formData, image: file })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!editingProduct && !formData.image) {
      setError('Please select an image')
      return
    }
    
    const productData = new FormData()
    productData.append('name', formData.name)
    productData.append('price', formData.price)
    productData.append('description', formData.description)
    productData.append('category', formData.category)
    if (formData.image) {
      productData.append('image', formData.image)
    }
    
    try {
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, productData)
        setEditingProduct(null)
      } else {
        await onAddProduct(productData)
      }
      setFormData({ name: '', price: '', description: '', category: '', image: null })
      setShowAddForm(false)
    } catch (err) {
      setError(err.message || 'Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      category: product.category || '',
      image: null
    })
    setShowAddForm(true)
    setError('')
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setFormData({ name: '', price: '', description: '', category: '', image: null })
    setShowAddForm(false)
    setError('')
  }

  const handleDelete = async (productId) => {
    try {
      await onDeleteProduct(productId)
      setDeleteConfirm(null)
    } catch (err) {
      setError(err.message || 'Failed to delete product')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-4">
      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Total Products</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{myProducts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Active Listings</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{myProducts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Total Value</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              ₹{myProducts.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2.5 font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Add New Product
            </button>
          ) : (
            <button
              onClick={handleCancelEdit}
              className="px-5 py-2.5 font-medium rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1.5 text-sm font-medium">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5 text-sm font-medium">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-slate-700 mb-1.5 text-sm font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mt-4">
                <label className="block text-slate-700 mb-1.5 text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe your product..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition resize-none"
                  required
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-slate-700 mb-1.5 text-sm font-medium">
                  Product Image {editingProduct && '(leave empty to keep current)'}
                </label>
                {editingProduct && editingProduct.imageUrl && (
                  <div className="mb-2">
                    <img 
                      src={editingProduct.imageUrl} 
                      alt="Current" 
                      className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                    />
                    <p className="text-xs text-slate-500 mt-1">Current image</p>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  required={!editingProduct}
                />
                <p className="mt-1 text-xs text-slate-500">Max file size: 5MB</p>
              </div>
              
              <button
                type="submit"
                className="mt-6 px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        )}

        {/* My Products */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">My Products</h2>
          
          {myProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">No products listed yet</p>
              <p className="text-sm text-slate-500 mt-1">Click "Add New Product" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                          <path d="M3 6h18" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                      </div>
                    )}
                    {product.category && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-slate-700">
                        {product.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-slate-900">{product.name}</h3>
                    <p className="text-lg font-semibold text-slate-900 mt-1">₹{product.price}</p>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{product.description}</p>
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(product.id)}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete Product</h3>
            <p className="text-slate-600 mt-2">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerDashboard
