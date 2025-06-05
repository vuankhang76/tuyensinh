import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import './index.css'

// Pages
import Homepage from './pages/Homepage'
import UniversityDetail from './pages/UniversityDetail'
import SearchResults from './pages/SearchResults'
import CompareUniversities from './pages/CompareUniversities'

// Layout components
import Navbar from './components/common/Layout/Navbar'
import Footer from './components/common/Layout/Footer'

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/university/:slug" element={<UniversityDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/compare" element={<CompareUniversities />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ConfigProvider>
  )
}

export default App