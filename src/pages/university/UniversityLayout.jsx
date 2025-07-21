import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Building2,
  LogOut,
  Bell,
  Home,
} from 'lucide-react';

const UniversityLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const currentPath = location.pathname.split('/').pop();
  const selectedMenu = currentPath === 'university' ? 'dashboard' : currentPath;

  const menuItems = [
    {
      key: 'dashboard',
      icon: Building2,
      label: 'Quản lý trường',
      type: 'item'
    },
  ];

  const handleMenuClick = (key) => {
    if (key === 'dashboard') {
      navigate('/university');
    } else {
      navigate(`/university/${key}`);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Đăng xuất thành công", {
        description: "Hẹn gặp lại bạn!",
      });
      navigate('/');
    } else {
      toast.error("Lỗi đăng xuất", {
        description: result.error,
      });
    }
  };

  const handleGoToMainSite = () => {
    navigate('/');
  };

  const renderMenuItem = (item) => {
    if (item.type === 'divider') {
      return (
        <div
          key={Math.random()}
          className="h-px bg-gray-200 my-2"
        />
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
            <span className="text- font-bold text-gray-800">University</span>
          </div>
          <div className="text-xs text-gray-600 font-semibold">University Information System</div>
        </div>
        
        <div className="p-4 space-y-1">
          {menuItems.map(renderMenuItem)}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="container bg-white border-b border-gray-200 py-7 px-10">
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative" onClick={handleGoToMainSite}>
                <Home className="h-5 w-5" />
                <span>Trang chủ</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user?.displayName || 'University Admin'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UniversityLayout; 