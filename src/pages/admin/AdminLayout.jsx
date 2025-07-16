import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AdminNavbar from '@/components/admin/AdminNavbar';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Bell,
  User,
  Settings,
  Shield,
  GraduationCap,
  DollarSign,
  Trophy,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  
  const currentPath = location.pathname.split('/').pop();
  const selectedMenu = currentPath === 'admin' ? 'dashboard' : currentPath;
  
  const getOpenKeys = () => {
    const universityPages = ['universities', 'majors', 'programs', 'scholarships'];
    const userPages = ['users', 'verification'];
    const contentPages = ['news'];
    
    if (universityPages.includes(selectedMenu)) {
      return { 'university-management': true };
    }
    if (userPages.includes(selectedMenu)) {
      return { 'user-management': true };
    }
    if (contentPages.includes(selectedMenu)) {
      return { 'content-management': true };
    }
    return {};
  };

  React.useEffect(() => {
    setOpenMenus(getOpenKeys());
  }, [selectedMenu]);

  const menuItems = [
    {
      key: 'dashboard',
      icon: LayoutDashboard,
      label: 'Tổng quan',
      type: 'item'
    },
    {
      type: 'divider',
    },
    {
      key: 'universities',
      icon: Building2,
      label: 'Quản lý trường',
      type: 'item',
    },
    {
      key: 'users',
      icon: User,
      label: 'Quản lý người dùng',
      type: 'item',
    },
    {
      key: 'news',
      icon: Bell,
      label: 'Quản lý tin',
      type: 'item',
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: Settings,
      label: 'Cài đặt Hệ thống',
      type: 'item'
    },
  ];

  const handleMenuClick = (key) => {
    if (key === 'dashboard') {
      navigate('/admin');
    } else {
      navigate(`/admin/${key}`);
    }
  };

  const toggleSubMenu = (key) => {
    setOpenMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderMenuItem = (item) => {
    if (item.type === 'divider') {
      return <div key={Math.random()} className="my-2 border-t border-gray-200" />;
    }

    if (item.type === 'group') {
      const isOpen = openMenus[item.key];
      const Icon = item.icon;
      
      return (
        <div key={item.key} className="mb-1">
          <button
            onClick={() => toggleSubMenu(item.key)}
            className="w-full flex items-center justify-between p-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {isOpen && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map(child => {
                const ChildIcon = child.icon;
                const isSelected = selectedMenu === child.key;
                
                return (
                  <button
                    key={child.key}
                    onClick={() => handleMenuClick(child.key)}
                    className={cn(
                      "w-full flex items-center space-x-2 p-2 text-left text-sm rounded-md transition-colors",
                      isSelected 
                        ? "bg-blue-100 text-blue-700 font-medium" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <ChildIcon className="h-4 w-4" />
                    <span>{child.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const Icon = item.icon;
    const isSelected = selectedMenu === item.key;
    
    return (
      <button
        key={item.key}
        onClick={() => handleMenuClick(item.key)}
        className={cn(
          "w-full flex items-center space-x-2 p-2 text-left text-sm rounded-md transition-colors mb-1",
          isSelected 
            ? "bg-blue-100 text-blue-700 font-medium" 
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-lg">
        <div className="py-6 text-center border-b border-r border-gray-200">
          <div className="flex items-center justify-center">
            <span className="text- font-bold text-gray-800">Admin</span>
          </div>
          <div className="text-xs text-gray-600 font-semibold">University Information System</div>
        </div>
        
        <div className="p-4 space-y-1">
          {menuItems.map(renderMenuItem)}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 