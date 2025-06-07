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
                  <ProtectedRoute requiredRole="university">
                    <div className="p-8">University Admin Dashboard</div>
                  </ProtectedRoute>
                } />
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