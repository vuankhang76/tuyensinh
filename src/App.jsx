import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import './index.css'

// Context
import { AuthProvider } from './context/AuthContext'

// Pages
import Homepage from './pages/Homepage'
import UniversityDetail from './pages/UniversityDetail'
import SearchResults from './pages/SearchResults'
import CompareUniversities from './pages/CompareUniversities'
import Login from './pages/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Overview from './pages/admin/Dashboard/Overview'
import UniversityManagement from './pages/admin/Universities/UniversityManagement'
import UserManagement from './pages/admin/Users/UserManagement'
import MajorManagement from './pages/admin/Majors/MajorManagement'
import AdmissionNewsManagement from './pages/admin/AdmissionNews/AdmissionNewsManagement'
import ProgramManagement from './pages/admin/Programs/ProgramManagement'
import Unauthorized from './pages/Unauthorized'

// Layout components
import Navbar from './components/common/Layout/Navbar'
import Footer from './components/common/Layout/Footer'
import DemoInfo from './components/common/DemoInfo'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/university/:slug" element={<UniversityDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/compare" element={<CompareUniversities />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes example */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <div className="p-8">Profile Page</div>
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Overview />} />
                  <Route path="universities" element={<UniversityManagement />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="majors" element={<MajorManagement />} />
                  <Route path="programs" element={<ProgramManagement />} />
                  <Route path="scholarships" element={<div className="p-8">Quản lý Học bổng - Đang phát triển</div>} />
                  <Route path="news" element={<AdmissionNewsManagement />} />
                  <Route path="verification" element={<div className="p-8">Xác minh Thông tin - Đang phát triển</div>} />
                  <Route path="settings" element={<div className="p-8">Cài đặt Hệ thống - Đang phát triển</div>} />
                </Route>
                
                <Route path="/university-admin" element={
                  <ProtectedRoute requiredRole="university">
                    <div className="p-8">University Admin Dashboard</div>
                  </ProtectedRoute>
                } />
                
                <Route path="/unauthorized" element={<Unauthorized />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Demo accounts info - only in development */}
            <DemoInfo />
          </div>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App