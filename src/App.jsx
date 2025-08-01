import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

import { AuthProvider } from './context/AuthContext'

import Homepage from './pages/Homepage'
import AuthActionHandler from './pages/AuthActionHandler'
import UniversityDetail from './pages/UniversityDetail'
import NotFoundPage from './pages/NotFoundPage'
import SearchResults from './pages/SearchResults'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import EmailVerification from './pages/EmailVerification'
import AllUniversities from './pages/AllUniversities'
import AllNews from './pages/AllNews'
import AdminLayout from './pages/admin/AdminLayout'
import Overview from './pages/admin/Dashboard/Overview'
import UniversityManagement from './pages/admin/Universities/UniversityManagement'
import UniversityDetailPage from './pages/admin/Universities/UniversityDetailPage'
import UserManagement from './pages/admin/Users/UserManagement'
import UserProfile from './pages/user/UserProfile'
import AIChat from './pages/AIChat'
import Unauthorized from './pages/Unauthorized'
import Navbar from './components/common/Layout/Navbar'
import Footer from './components/common/Layout/Footer'
import ProtectedRoute from './routes/ProtectedRoute'
import UniversityCreatePage from './pages/admin/Universities/UniversityCreatePage';
import UniversityLayout from './pages/university/UniversityLayout';
import UniversityAdmin from './pages/university/UniversityAdmin';

import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="universities" element={<UniversityManagement />} />
              <Route path="universities/create" element={<UniversityCreatePage />} />
              <Route path="universities/:id" element={<UniversityDetailPage />} />
              <Route path="users" element={<UserManagement />} />
            </Route>

            <Route path="/university" element={
              <ProtectedRoute requiredRole="university">
                <UniversityLayout />
              </ProtectedRoute>
            }>
              <Route index element={<UniversityAdmin />} />
              <Route path="admin" element={<UniversityAdmin />} />
            </Route>

            <Route path="/ai-chat" element={
              <main className="h-screen">
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              </main>
            } />

            <Route path="/*" element={
              <>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/danh-sach-truong-dai-hoc/:id" element={<UniversityDetail />} />
                    <Route path="/danh-sach-truong-dai-hoc" element={<AllUniversities />} />
                    <Route path="/tin-tuc" element={<AllNews />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/dang-nhap" element={<Login />} />
                    <Route path="/dang-ky" element={<Register />} />
                    <Route path="/quen-mat-khau" element={<ForgotPassword />} />
                    <Route path="/dat-lai-mat-khau" element={<ResetPassword />} />
                    <Route path="/xac-minh-email" element={<EmailVerification />} />
                    <Route path="/auth-action" element={<AuthActionHandler />} />
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

export default App;