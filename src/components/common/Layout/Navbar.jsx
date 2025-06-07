import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MenuOutlined,
  HomeOutlined,
  BankOutlined,
  BookOutlined,
  BellOutlined,
  DownOutlined,
  CloseOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons'
import logo from '../../../assets/images/logo/logo_full.png'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [dropdownTimeout, setDropdownTimeout] = useState(null)
  const navigate = useNavigate()

  // Mock user state - replace with actual auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    avatar: null
  })

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout)
      }
    }
  }, [dropdownTimeout])

  const handleDropdownToggle = (key) => {
    // Clear any existing timeout
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setActiveDropdown(activeDropdown === key ? null : key)
  }

  const handleMouseEnter = (key) => {
    // Clear any existing timeout when mouse enters
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setActiveDropdown(key)
  }

  const handleMouseLeave = () => {
    // Add delay before closing dropdown
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 150) // 150ms delay
    setDropdownTimeout(timeout)
  }

  const handleLogin = () => {
    // Mock login
    setIsLoggedIn(true)
    setActiveDropdown(null)
  }

  const handleLogout = () => {
    // Mock logout
    setIsLoggedIn(false)
    setActiveDropdown(null)
  }

  return (
    <>
      <nav className="bg-white sticky top-0 z-50 border-b shadow-sm border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="w-10 h-10" />
              </div>
              <div className="hidden md:block">
                <div className="font-bold text-xl text-gray-800">TuyenSinh.edu</div>
                <div className="text-sm text-gray-600">Thông tin tuyển sinh đại học</div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Home */}
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
              >
                <HomeOutlined />
                <span>Trang chủ</span>
              </Link>

              {/* Universities Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('universities')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                  onClick={() => handleDropdownToggle('universities')}
                >
                  <BankOutlined />
                  <span>Trường đại học</span>
                  <DownOutlined className={`text-xs transition-transform duration-200 ${activeDropdown === 'universities' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'universities' && (
                  <div className="absolute top-full left-0 mt-0 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1">
                    <div className="py-1 px-1">
                      <Link 
                        to="/search?type=Tất cả" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                      >
                        Tất cả trường
                      </Link>
                      <Link 
                        to="/search?type=Công lập" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                      >
                        Trường công lập
                      </Link>
                      <Link 
                        to="/search?type=Tư thục" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                      >
                        Trường tư thục
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Majors Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('majors')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                  onClick={() => handleDropdownToggle('majors')}
                >
                  <BookOutlined />
                  <span>Ngành học</span>
                  <DownOutlined className={`text-xs transition-transform duration-200 ${activeDropdown === 'majors' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'majors' && (
                  <div className="absolute w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1">
                    <div className="py-1 px-1">
                      <Link 
                        to="/search?major=Công nghệ thông tin" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                      >
                        Công nghệ thông tin
                      </Link>
                      <Link 
                        to="/search?major=Kinh doanh" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                      >
                        Kinh tế - Kinh doanh
                      </Link>
                      <Link 
                        to="/search?major=Kỹ thuật" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                      >
                        Kỹ thuật
                      </Link>
                      <Link 
                        to="/search?major=Y khoa" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                      >
                        Y - Dược
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* News Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('news')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                  onClick={() => handleDropdownToggle('news')}
                >
                  <BellOutlined />
                  <span>Tin tức</span>
                  <DownOutlined className={`text-xs transition-transform duration-200 ${activeDropdown === 'news' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'news' && (
                  <div className="absolute w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1">
                    <div className="py-1 px-1">
                      <Link 
                        to="/news?category=admission" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                      >
                        Tin tuyển sinh
                      </Link>
                      <Link 
                        to="/news?category=policy" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                      >
                        Chính sách mới
                      </Link>
                      <Link 
                        to="/news?category=scholarship" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                      >
                        Học bổng
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Section & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* User Section - Desktop */}
              <div className="hidden lg:block">
                {isLoggedIn ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => handleMouseEnter('user')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button 
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                      onClick={() => handleDropdownToggle('user')}
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <UserOutlined className="text-white text-sm" />
                      </div>
                      <span className="max-w-20 truncate">{user.name}</span>
                      <DownOutlined className={`text-xs transition-transform duration-200 ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {activeDropdown === 'user' && (
                      <div className="absolute w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1">
                        <div className="py-1 px-1">
                          <div className="px-3 py-2 border-b border-gray-100">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                          <Link 
                            to="/profile" 
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          >
                            <UserOutlined />
                            <span>Thông tin cá nhân</span>
                          </Link>
                          <Link 
                            to="/settings" 
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          >
                            <SettingOutlined />
                            <span>Cài đặt</span>
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                          >
                            <LogoutOutlined />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleLogin}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                    >
                      <LoginOutlined />
                      <span>Đăng nhập</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <CloseOutlined className="text-xl" />
                  ) : (
                    <MenuOutlined className="text-xl" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-1">
                {/* User Section - Mobile */}
                {isLoggedIn ? (
                  <div>
                    <div className="px-4 py-3 border-b border-gray-200 mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <UserOutlined className="text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserOutlined />
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <SettingOutlined />
                      <span>Cài đặt</span>
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <LogoutOutlined />
                      <span>Đăng xuất</span>
                    </button>
                    <div className="border-t border-gray-200 mt-2 p-1"></div>
                  </div>
                ) : (
                  <div className="space-y-1 border-b border-gray-200 pb-2 mb-2">
                    <button 
                      onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <LoginOutlined />
                      <span>Đăng nhập</span>
                    </button>
                  </div>
                )}

                {/* Home */}
                <Link 
                  to="/" 
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </Link>

                {/* Universities Mobile */}
                <div>
                  <button 
                    className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleDropdownToggle('universities-mobile')}
                  >
                    <div className="flex items-center space-x-3">
                      <BankOutlined />
                      <span>Trường đại học</span>
                    </div>
                    <DownOutlined className={`text-xs transition-transform duration-200 ${activeDropdown === 'universities-mobile' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'universities-mobile' && (
                    <div className="bg-gray-50">
                      <Link 
                        to="/search?type=Tất cả" 
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Tất cả trường
                      </Link>
                      <Link 
                        to="/search?type=Công lập" 
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Trường công lập
                      </Link>
                      <Link 
                        to="/search?type=Tư thục" 
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Trường tư thục
                      </Link>
                    </div>
                  )}
                </div>

                {/* Majors Mobile */}
                <div>
                  <button 
                    className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleDropdownToggle('majors-mobile')}
                  >
                    <div className="flex items-center space-x-3">
                      <BookOutlined />
                      <span>Ngành học</span>
                    </div>
                    <DownOutlined className={`text-xs transition-transform duration-200 ${activeDropdown === 'majors-mobile' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'majors-mobile' && (
                    <div className="bg-gray-50">
                      <Link 
                        to="/search?major=Công nghệ thông tin" 
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Công nghệ thông tin
                      </Link>
                      <Link 
                        to="/search?major=Kinh doanh" 
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Kinh tế - Kinh doanh
                      </Link>
                      <Link 
                        to="/search?major=Kỹ thuật" 
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Kỹ thuật
                      </Link>
                      <Link 
                        to="/search?major=Y khoa" 
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Y - Dược
                      </Link>
                    </div>
                  )}
                </div>

                {/* News Mobile */}
                <div>
                  <button 
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleDropdownToggle('news-mobile')}
                  >
                    <div className="flex items-center space-x-3">
                      <BellOutlined />
                      <span>Tin tức</span>
                    </div>
                    <DownOutlined className={`text-xs transition-transform duration-200 ${activeDropdown === 'news-mobile' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'news-mobile' && (
                    <div className="bg-gray-50">
                      <Link 
                        to="/news?category=admission" 
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Tin tuyển sinh
                      </Link>
                      <Link 
                        to="/news?category=policy" 
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Chính sách mới
                      </Link>
                      <Link 
                        to="/news?category=scholarship" 
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Học bổng
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar