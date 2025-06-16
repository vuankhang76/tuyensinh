import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, LogIn } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 h-24 w-24 text-muted-foreground">
          <svg
            fill="none"
            height="96"
            viewBox="0 0 24 24"
            width="96"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 17h-2v-6h2v6zm0-8h-2V7h2v2z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">403</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Xin lỗi, bạn không có quyền truy cập trang này.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Về trang chủ
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/login')}
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 