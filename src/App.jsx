import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

// Context
import { AuthProvider } from './context/AuthContext'

// Pages
import Homepage from './pages/Homepage'
import UniversityDetail from './pages/UniversityDetail'
import NotFoundPage from './pages/NotFoundPage'
import SearchResults from './pages/SearchResults'
import Login from './pages/Login'
import Register from './pages/Register'
import EmailVerification from './pages/EmailVerification'
import AllUniversities from './pages/AllUniversities'
import AllNews from './pages/AllNews'
import AdminLayout from './pages/admin/AdminLayout'
import Overview from './pages/admin/Dashboard/Overview'
import UniversityManagement from './pages/admin/Universities/UniversityManagement'
import UniversityDetailPage from './pages/admin/Universities/UniversityDetailPage'
import UserManagement from './pages/admin/Users/UserManagement'
import MajorManagement from './pages/admin/Majors/MajorManagement'
import AdmissionNewsManagement from './pages/admin/AdmissionNews/AdmissionNewsManagement'
import ProgramManagement from './pages/admin/Programs/ProgramManagement'
import UniversityAdmin from './pages/university/UniversityAdmin'
import UserProfile from './pages/user/UserProfile'
import AIChat from './pages/AIChat'
import Unauthorized from './pages/Unauthorized'
import Navbar from './components/common/Layout/Navbar'
import Footer from './components/common/Layout/Footer'
import ProtectedRoute from './routes/ProtectedRoute'

import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Admin routes without regular navbar */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="universities" element={<UniversityManagement />} />
              <Route path="universities/:id" element={<UniversityDetailPage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="majors" element={<MajorManagement />} />
              <Route path="programs" element={<ProgramManagement />} />
              <Route path="scholarships" element={<div className="p-8">Quản lý Học bổng - Đang phát triển</div>} />
              <Route path="news" element={<AdmissionNewsManagement />} />
              <Route path="verification" element={<div className="p-8">Xác minh Thông tin - Đang phát triển</div>} />
              <Route path="settings" element={<div className="p-8">Cài đặt Hệ thống - Đang phát triển</div>} />
              <Route path="profile" element={<div className="p-8">Admin Profile - Đang phát triển</div>} />
            </Route>

            <Route path="/university-admin" element={
              <ProtectedRoute requiredRole="university">
                <UniversityAdmin />
              </ProtectedRoute>
            } />

            {/* AI Chat route without footer */}
            <Route path="/ai-chat" element={
              <>
                <Navbar />
                <main className="h-screen">
                  <ProtectedRoute>
                    <AIChat />
                  </ProtectedRoute>
                </main>
              </>
            } />

            {/* Regular routes with navbar and footer */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/university/:id" element={<UniversityDetail />} />
                    <Route path="/universities" element={<AllUniversities />} />
                    <Route path="/news" element={<AllNews />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/email-verification" element={<EmailVerification />} />
                    
                    {/* Protected routes */}
                    <Route path="/profile" element={
                      <ProtectedRoute requiredRole="student">
                        <UserProfile />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App