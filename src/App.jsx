import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useEffect } from 'react'
import { useSocket } from './contexts/SocketContext'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import HomeLayout from './layouts/HomeLayout'
import DefaultLayout from './layouts/DefaultLayout'
import LawyerList from './pages/LawyerList'
import LawyerDetail from './pages/LawyerDetail'
import VerifyEmail from './pages/VerifyEmail'
import About from './pages/About'
import News from './pages/News'
import Contact from './pages/Contact'
import PayOSReturn from './pages/PayOSReturn'
import LawyerProfilePage from './pages/LawyerProfilePage'
import CaseDetail from './pages/CaseDetail'
import LawyerCaseDetail from './pages/LawyerCaseDetail'

import { SocketProvider } from './contexts/SocketContext'
import { VideoCallProvider } from './contexts/VideoCallContext'
import VideoCallOverlay from './components/video/VideoCallOverlay'

const CaseDetailRoute = () => {
  const { user } = useAuth()

  if (user?.role_name === 'lawyer') {
    return <LawyerCaseDetail />
  }

  return <CaseDetail />
}

const NotificationHandler = () => {
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !user) return;

    socket.on('upcoming_consultation', (data) => {
      toast((t) => (
        <div className="flex flex-col gap-3 min-w-[280px]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 animate-bounce">
              <span className="text-xl">⏳</span>
            </div>
            <div>
              <p className="text-sm font-black text-[#041837] uppercase tracking-tight">Sắp có cuộc gọi video</p>
              <p className="text-[11px] font-bold text-slate-500">{data.message}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#041837] transition-all"
            >
              Bỏ qua
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                window.location.href = '/dashboard';
              }}
              className="px-4 py-2 bg-amber-500 text-[#041837] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black hover:text-amber-500 transition-all"
            >
              Vào Dashboard
            </button>
          </div>
        </div>
      ), {
        duration: 15000,
        id: `reminder-${data.consultationId}`
      });
    });

    return () => {
      socket.off('upcoming_consultation');
    };
  }, [socket, user]);

  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <VideoCallProvider>
          <BrowserRouter>
            <NotificationHandler />
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />
                <Route path="/about" element={<HomeLayout><About /></HomeLayout>} />
                <Route path="/news" element={<HomeLayout><News /></HomeLayout>} />
                <Route path="/contact" element={<HomeLayout><Contact /></HomeLayout>} />
                <Route path="/verify-email" element={<HomeLayout><VerifyEmail /></HomeLayout>} />
                <Route path="/payment/payos-return" element={<HomeLayout><PayOSReturn /></HomeLayout>} />
                <Route path="/login" element={<HomeLayout><Login /></HomeLayout>} />
                <Route path="/lawyer" element={<HomeLayout><LawyerList /></HomeLayout>} />
                <Route path="/lawyer/:id" element={<HomeLayout><LawyerDetail /></HomeLayout>} />
                <Route path="/signup" element={<HomeLayout><Signup /></HomeLayout>} />
                <Route path="/forgot-password" element={<DefaultLayout><ForgotPassword /></DefaultLayout>} />
                <Route path="/reset-password" element={<DefaultLayout><ResetPassword /></DefaultLayout>} />
                <Route
                  path="/dashboard"
                  element={
                    <HomeLayout>
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    </HomeLayout>
                  }
                />
                <Route
                  path="/lawyer/profile"
                  element={
                    <HomeLayout>
                      <ProtectedRoute>
                        <LawyerProfilePage />
                      </ProtectedRoute>
                    </HomeLayout>
                  }
                />
                <Route
                  path="/cases/:caseId"
                  element={
                    <HomeLayout>
                      <ProtectedRoute>
                        <CaseDetailRoute />
                      </ProtectedRoute>
                    </HomeLayout>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster position="top-right" />
            </div>
          </BrowserRouter>
          <VideoCallOverlay />
        </VideoCallProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export { App }
export default App
