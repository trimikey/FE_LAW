import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  // Set token in axios default headers
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me')
          if (response.data.success) {
            setUser(response.data.data.user)
          }
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          setToken(null)
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.success) {
        const { token: newToken, refreshToken, user: userData } = response.data.data
        setToken(newToken)
        setUser(userData)
        localStorage.setItem('token', newToken)
        localStorage.setItem('refreshToken', refreshToken)
        toast.success('Đăng nhập thành công!')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại'
      toast.error(message)
      return { success: false, message }
    }
  }

  const signup = async (formData) => {
    try {
      const response = await api.post('/auth/signup',   formData)
      if (response.data.success) {
        toast.success('Đăng ký thành công! Vui lòng check mail để xác thực.')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng ký thất bại'
      const errors = error.response?.data?.errors
      if (errors) {
        errors.forEach(err => toast.error(err.msg || err.message))
      } else {
        toast.error(message)
      }
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      toast.success('Đăng xuất thành công!')
    }
  }

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      if (response.data.success) {
        toast.success(response.data.message)
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Gửi email thất bại'
      toast.error(message)
      return { success: false, message }
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword })
      if (response.data.success) {
        toast.success(response.data.message)
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Đặt lại mật khẩu thất bại'
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!token && !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
