import { useState } from 'react'

function AuthPage({ role, onLogin, onSignup, onBack, loading, error }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  })
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    setLocalError('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!isLogin) {
      if (formData.name.trim().length < 2) {
        setLocalError('Name must be at least 2 characters')
        return false
      }
      if (!/^\d{10}$/.test(formData.phone.replace(/[-()\s]/g, ''))) {
        setLocalError('Please enter a valid 10-digit phone number')
        return false
      }
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError('Please enter a valid email address')
      return false
    }
    
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return false
    }
    
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError('')
    
    if (!validateForm()) {
      return
    }
    
    if (isLogin) {
      onLogin({
        email: formData.email,
        password: formData.password,
        role
      })
    } else {
      onSignup({
        ...formData,
        role
      })
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setLocalError('')
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: ''
    })
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 text-slate-600 hover:text-slate-900 flex items-center text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Change account type
      </button>

      {/* Role Badge */}
      <div className="mb-6 p-3 bg-slate-100 rounded-lg border border-slate-200">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-slate-600">Account type:</span>
          <span className={`px-3 py-1 rounded-md text-sm font-medium ${
            role === 'buyer' 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-900 text-white'
          }`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        </div>
      </div>

      {/* Login/Signup Toggle */}
      <div className="mb-6 flex bg-slate-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => isLogin || switchMode()}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
            isLogin
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => !isLogin || switchMode()}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
            !isLogin
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Error Display */}
      {(error || localError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {localError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-slate-700 mb-1.5 text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1.5 text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-slate-700 mb-1.5 text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-slate-700 mb-1.5 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={isLogin ? 'Enter your password' : 'Minimum 6 characters'}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={switchMode}
              className="text-slate-900 hover:underline font-medium"
            >
              Create one
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={switchMode}
              className="text-slate-900 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

export default AuthPage
