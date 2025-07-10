import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Home,
  Building2,
  ChevronDown,
  X,
  User,
  Settings,
  LogOut,
  LogIn,
  LayoutDashboard,
  MessageCircle,
  Newspaper
} from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import { toast } from 'sonner';

import logo from '../../../assets/images/logo/logo_full.png'
import { useAuth } from '../../../context/AuthContext'
import { cn } from "@/lib/utils"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navigate = useNavigate()

  const { user, isAuthenticated, logout } = useAuth()

  const handleDropdownToggle = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key)
  }

  const handleLogin = () => {
    navigate('/dang-nhap')
    setActiveDropdown(null)
  }

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Đăng xuất thành công", {
        description: "Hẹn gặp lại bạn!",
      });
    } else {
      toast.error("Lỗi đăng xuất", {
        description: result.error,
      });
    }
    setActiveDropdown(null)
    navigate('/')
  }

  const handleAIChat = () => {
    if (!isAuthenticated) {
      navigate('/dang-nhap?redirect=ai-chat')
    } else {
      navigate('/ai-chat')
    }
    setActiveDropdown(null)
    setIsMobileMenuOpen(false)
  }

  const ListItem = React.forwardRef(({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            to={href}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  })
  ListItem.displayName = "ListItem"

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
                <div className="text-sm text-gray-600">Thông tin tuyển sinh</div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  {/* Home */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/" className={navigationMenuTriggerStyle()}>
                        Trang chủ
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Universities Dropdown */}
                  {user?.role !== 'admin' && (
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>
                        Trường đại học
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                          <ListItem href="/danh-sach-truong-dai-hoc" title="Tất cả trường">
                            Danh sách đầy đủ các trường đại học
                          </ListItem>
                          <ListItem href="/search?type=Công lập" title="Trường công lập">
                            Các trường đại học công lập
                          </ListItem>
                          <ListItem href="/search?type=Tư thục" title="Trường tư thục">
                            Các trường đại học tư thục
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )}

                  {/* News Dropdown */}
                  {user?.role !== 'admin' && (
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link to="/tin-tuc" className={navigationMenuTriggerStyle()}>
                          Tin tức
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* User Section & Mobile Menu */}
            <div className="flex items-center">
              {/* User Section - Desktop */}
              <div className="hidden lg:flex items-center space-x-4">
                {/* AI Chat */}
                <NavigationMenu>
                  <NavigationMenuList>
                    {isAuthenticated && (
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <button onClick={handleAIChat} className="flex flex-row items-center space-x-2">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Trợ lý AI</span>
                          </button>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative">
                        {user?.photoURL ? (
                          <div className="cursor-pointer">
                            <img
                              src={user.photoURL}
                              alt={user?.displayName}
                              className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                              referrerPolicy="no-referrer"
                              crossOrigin="anonymous"
                            />
                            <div
                              className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                              style={{ display: 'none' }}
                            >
                              <User className="h-4 w-4" />
                            </div>
                          </div>
                        ) : (
                          <Avatar className="cursor-pointer">
                            <AvatarFallback className="bg-gray-200 text-gray-800">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {user?.role === 'admin' && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      )}
                      {user?.role === 'university' && (
                        <DropdownMenuItem onClick={() => navigate('/university-admin')}>
                          <Building2 className="mr-2 h-4 w-4" />
                          <span>Quản lý trường</span>
                        </DropdownMenuItem>
                      )}
                      {user?.role !== 'admin' && user?.role !== 'university' && (
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Thông tin cá nhân</span>
                      </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Đăng xuất</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" onClick={handleLogin}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Đăng nhập
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-1">
                {/* User Section - Mobile */}
                {isAuthenticated ? (
                  <div>
                    <div className="px-4 py-3 border-b border-gray-200 mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="text-white h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user?.name || user?.email}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    {user?.role === 'university' && (
                      <Link
                        to="/university-admin"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Building2 className="h-4 w-4" />
                        <span>Quản lý trường</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
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
                      <LogIn className="h-4 w-4" />
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
                  <Home className="h-4 w-4" />
                  <span>Trang chủ</span>
                </Link>

                {/* Universities Mobile */}
                {user?.role !== 'admin' && (
                  <div>
                    <button
                      className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => handleDropdownToggle('universities-mobile')}
                    >
                      <div className="flex items-center space-x-3">
                        <span>Trường đại học</span>
                      </div>
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === 'universities-mobile' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'universities-mobile' && (
                      <div className="bg-gray-50">
                        <Link
                          to="/search?type=all"
                          className="block px-8 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Tất cả trường
                        </Link>
                        <Link
                          to="/search?type=Công lập"
                          className="block px-8 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Trường công lập
                        </Link>
                        <Link
                          to="/search?type=Tư thục"
                          className="block px-8 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Trường tư thục
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* News Mobile */}
                {user?.role !== 'admin' && (
                  <div>
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => handleDropdownToggle('news-mobile')}
                    >
                      <div className="flex items-center space-x-3">
                        <Newspaper className="h-4 w-4" />
                        <span>Tin tức</span>
                      </div>
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === 'news-mobile' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'news-mobile' && (
                      <div className="bg-gray-50">
                        <Link
                          to="/tin-tuc"
                          className="block px-8 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Tất cả tin tức
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Chat Mobile */}
                {isAuthenticated && (
                  <button
                    onClick={handleAIChat}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Trợ lý AI</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar