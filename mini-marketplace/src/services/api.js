const API_URL = 'http://localhost:5000/api'

class ApiService {
  constructor() {
    // Always get fresh token from localStorage
  }

  getToken() {
    return localStorage.getItem('token')
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const token = this.getToken()
    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const config = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async signup(userData) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    if (response.success && response.data.session) {
      this.setToken(response.data.session.access_token)
    }
    
    return response
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.success && response.data.session) {
      console.log('Setting token from login:', response.data.session.access_token)
      this.setToken(response.data.session.access_token)
    }
    
    return response
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    })
    this.setToken(null)
    return response
  }

  // Product endpoints
  async getProducts() {
    return await this.request('/products', {
      method: 'GET',
      skipAuth: true,
    })
  }

  async getProduct(id) {
    return await this.request(`/products/${id}`, {
      method: 'GET',
      skipAuth: true,
    })
  }

  async createProduct(formData) {
    const token = this.getToken()
    console.log('Creating product with token:', token ? 'Token exists' : 'No token')
    
    // For FormData, don't set Content-Type (browser will set it with boundary)
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('Create product error:', data)
      throw new Error(data.message || 'Failed to create product')
    }

    return data
  }

  async updateProduct(id, formData) {
    const token = this.getToken()
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product')
    }

    return data
  }

  async deleteProduct(id) {
    return await this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }
}

export default new ApiService()
