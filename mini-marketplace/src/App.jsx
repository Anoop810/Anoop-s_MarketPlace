import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import AuthPage from './components/AuthPage'
import BuyerDashboard from './components/BuyerDashboard'
import SellerDashboard from './components/SellerDashboard'
import api from './services/api'
import logo from './assets/mplogo.png'

// Icons as components for cleaner JSX
const Icons = {
  User: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  ShoppingBag: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Store: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  ),
  Truck: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  CreditCard: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  LogOut: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  ),
}

export default function App() {
  const [currentView, setCurrentView] = useState('products')
  const [session, setSession] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await api.getProducts()
      if (response.success) setProducts(response.data)
    } catch (err) {
      console.error('Failed to load products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleShowAuth = () => {
    setCurrentView('auth')
    setSelectedRole(null)
  }

  const handleBackToProducts = () => {
    setCurrentView('products')
    setSelectedRole(null)
  }

  const handleRoleSelected = (role) => setSelectedRole(role)

  const handleLogin = async (credentials) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.login({
        email: credentials.email,
        password: credentials.password
      })
      if (response.success) {
        const user = response.data.user
        if (user.role !== credentials.role) {
          setError(`This account is registered as a ${user.role}, not a ${credentials.role}`)
          return
        }
        setSession(user)
        setUserRole(user.role)
        setCurrentView('dashboard')
        await loadProducts()
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.signup(userData)
      if (response.success) {
        const user = response.data.user
        setSession(user)
        setUserRole(user.role)
        setCurrentView('dashboard')
        await loadProducts()
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    setSession(null)
    setUserRole(null)
    setSelectedRole(null)
    setCurrentView('products')
  }

  const handleAddProduct = async (formData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.createProduct(formData)
      if (response.success) {
        await loadProducts()
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Product added successfully', type: 'success' } }))
      }
    } catch (err) {
      console.error('Add product error:', err)
      setError(err.message || 'Failed to add product')
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Failed to add product', type: 'error' } }))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProduct = async (id, formData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.updateProduct(id, formData)
      if (response.success) {
        await loadProducts()
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Product updated successfully', type: 'success' } }))
      }
    } catch (err) {
      console.error('Update product error:', err)
      setError(err.message || 'Failed to update product')
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Failed to update product', type: 'error' } }))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.deleteProduct(id)
      if (response.success) {
        await loadProducts()
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Product deleted successfully', type: 'success' } }))
      }
    } catch (err) {
      console.error('Delete product error:', err)
      setError(err.message || 'Failed to delete product')
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Failed to delete product', type: 'error' } }))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="Circle Mini Marketplace" className="h-10 w-auto" />
              <div>
                <h1 className="text-lg font-semibold text-slate-900 leading-none">Circle Mini Marketplace</h1>
                <p className="text-xs text-slate-500">Buy and sell with confidence</p>
              </div>
            </div>

            {/* Search - Desktop */}
            {currentView === 'products' && !session && (
              <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Icons.Search />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              {!session ? (
                <button
                  onClick={handleShowAuth}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Icons.User />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-medium text-slate-700">
                      {(session.name || session.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{session.name || session.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Icons.LogOut />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {/* Landing / Products View */}
        {currentView === 'products' && !session && (
          <motion.div
            key="products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Hero Section */}
            <section className="bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="max-w-2xl">
                  <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                    Welcome to Circle Mini Marketplace
                  </h2>
                  <p className="mt-4 text-lg text-slate-600">
                    Your trusted destination for quality products. Connect with verified sellers, 
                    discover unique items, and shop with complete peace of mind.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      onClick={handleShowAuth}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Start Shopping
                      <Icons.ArrowRight />
                    </button>
                    <button
                      onClick={() => { setSelectedRole('seller'); setCurrentView('auth') }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      Become a Seller
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Trust Signals */}
            <section className="bg-slate-100 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4 bg-white rounded-lg p-4 border border-slate-200">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                      <Icons.Truck />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Fast Shipping</p>
                      <p className="text-sm text-slate-500">Reliable delivery tracking</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white rounded-lg p-4 border border-slate-200">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                      <Icons.Shield />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Buyer Protection</p>
                      <p className="text-sm text-slate-500">Secure transactions guaranteed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white rounded-lg p-4 border border-slate-200">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                      <Icons.CreditCard />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Secure Payments</p>
                      <p className="text-sm text-slate-500">Multiple payment options</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-6 py-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Browse Products</h3>
                  <p className="text-sm text-slate-500 mt-1">{filteredProducts.length} items available</p>
                </div>
                {/* Mobile Search */}
                <div className="md:hidden">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Icons.Search />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-40 pl-9 pr-3 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.ShoppingBag />
                  </div>
                  <p className="text-slate-600 font-medium">No products available yet</p>
                  <p className="text-sm text-slate-500 mt-1">Check back soon or become a seller</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <motion.article
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-200"
                    >
                      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Icons.ShoppingBag />
                          </div>
                        )}
                        {product.category && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-slate-700">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-slate-900 truncate">{product.name}</h4>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-lg font-semibold text-slate-900">${product.price}</span>
                          <button
                            onClick={handleShowAuth}
                            className="px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                          >
                            View
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                          Sold by {product.sellerName || 'Verified Seller'}
                        </p>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        )}

        {/* Auth View */}
        {currentView === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-[calc(100vh-64px)] flex"
          >
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-md">
                <button
                  onClick={handleBackToProducts}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8 transition-colors"
                >
                  <Icons.ArrowLeft />
                  Back to products
                </button>

                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedRole ? 'Sign in to continue' : 'Join Circle Mini Marketplace'}
                </h2>
                <p className="text-slate-600 mt-2">
                  {selectedRole 
                    ? `You're signing in as a ${selectedRole}`
                    : 'Select your account type to get started'
                  }
                </p>

                {!selectedRole ? (
                  <div className="mt-8 space-y-4">
                    <button
                      onClick={() => handleRoleSelected('buyer')}
                      className="w-full p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                            <Icons.ShoppingBag />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Buyer Account</p>
                            <p className="text-sm text-slate-500">Browse and purchase products</p>
                          </div>
                        </div>
                        <Icons.ArrowRight />
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleSelected('seller')}
                      className="w-full p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                            <Icons.Store />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Seller Account</p>
                            <p className="text-sm text-slate-500">List and sell your products</p>
                          </div>
                        </div>
                        <Icons.ArrowRight />
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="mt-8">
                    <AuthPage
                      role={selectedRole}
                      onLogin={handleLogin}
                      onSignup={handleSignup}
                      onBack={() => setSelectedRole(null)}
                      loading={loading}
                      error={error}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Info */}
            <div className="hidden lg:flex w-[480px] bg-slate-900 p-12 flex-col justify-center">
              <div className="text-white">
                <h3 className="text-2xl font-bold">Join Circle Mini Marketplace</h3>
                <p className="mt-4 text-slate-400 leading-relaxed">
                  Our platform connects buyers and sellers in a secure environment. 
                  Every transaction is protected, and our support team is always here to help.
                </p>

                <div className="mt-10 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icons.Shield />
                    </div>
                    <div>
                      <p className="font-medium">Verified Sellers</p>
                      <p className="text-sm text-slate-400">Every seller is verified before listing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icons.CreditCard />
                    </div>
                    <div>
                      <p className="font-medium">Secure Payments</p>
                      <p className="text-sm text-slate-400">Your payment information is encrypted</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icons.Truck />
                    </div>
                    <div>
                      <p className="font-medium">Fast Delivery</p>
                      <p className="text-sm text-slate-400">Track your orders in real-time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dashboards */}
        {currentView === 'dashboard' && userRole === 'buyer' && (
          <motion.div key="buyer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BuyerDashboard products={products} session={session} onLogout={handleLogout} />
          </motion.div>
        )}

        {currentView === 'dashboard' && userRole === 'seller' && (
          <motion.div key="seller" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SellerDashboard 
              products={products} 
              session={session} 
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && currentView !== 'auth' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-4">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-200 hover:text-white">
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
              <span className="text-sm font-medium text-slate-600">Loading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {currentView === 'products' && !session && (
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Circle Mini Marketplace" className="h-8 w-auto" />
                <span className="text-sm font-medium text-slate-900">Circle Mini Marketplace</span>
              </div>
              <p className="text-sm text-slate-500">
                Developed by <span className="font-medium text-slate-700"><a href="https://www.linkedin.com/in/anoopsonawane" target="_blank" rel="noopener noreferrer">Anoop Sonawane</a></span>
              </p>
              
            </div>
          </div>
        </footer>
      )}

      <ToastListener />
    </div>
  )
}

function ToastListener() {
  useEffect(() => {
    function onToast(e) {
      const { message, type } = e.detail || {}
      const el = document.createElement('div')
      el.textContent = message
      el.className = `fixed bottom-6 left-6 px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium ${
        type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'
      }`
      document.body.appendChild(el)
      setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s' }, 2500)
      setTimeout(() => el.remove(), 2800)
    }
    window.addEventListener('toast', onToast)
    return () => window.removeEventListener('toast', onToast)
  }, [])
  return null
}
