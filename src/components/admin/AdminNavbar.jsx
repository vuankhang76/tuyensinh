import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  LogOut,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleViewProfile = () => {
    navigate('/admin/profile');
  };

  const handleGoToMainSite = () => {
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-10 py-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative" onClick={handleGoToMainSite}>
            <Home className="h-5 w-5" />
            <span>Trang chủ</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center w-10 h-10">
                <Avatar>
                  <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col px-2 py-1.5">
                <p className="text-sm font-medium">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar; 