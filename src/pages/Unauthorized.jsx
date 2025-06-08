import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <div className="space-x-4">
            <Button 
              type="primary" 
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
            >
              Về trang chủ
            </Button>
            <Button 
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default Unauthorized; 