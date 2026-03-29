import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const VerifyEmail = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const token = params.get('token')

    if (!token) {
      toast.error('Link xác thực không hợp lệ')
      return
    }

    api.get(`/auth/verify-email?token=${token}`)
      .then(res => {
        toast.success(res.data.message || 'Xác thực email thành công')
        setTimeout(() => navigate('/login'), 1500)
      })
      .catch(err => {
        toast.error(
          err.response?.data?.message ||
          'Link xác thực không hợp lệ hoặc đã hết hạn'
        )
      })
  }, [params, navigate])

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>🔐 Đang xác thực email...</h2>
      <p>Vui lòng chờ trong giây lát</p>
    </div>
  )
}

export default VerifyEmail
