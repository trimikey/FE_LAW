import { useAuth } from '../contexts/AuthContext'
import AdminDashboard from './AdminDashboard'
import LawyerDashboard from './LawyerDashboard'
import ClientDashboard from './ClientDashboard'

const Dashboard = () => {
  const { user } = useAuth()

  // Route to appropriate dashboard based on role
  if (user?.role_name === 'admin') {
    return <AdminDashboard />
  } else if (user?.role_name === 'lawyer') {
    return <LawyerDashboard />
  } else if (user?.role_name === 'client') {
    return <ClientDashboard />
  }

  // Fallback if role is not recognized
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Đang tải dashboard...</div>
    </div>
  )
}

export default Dashboard
