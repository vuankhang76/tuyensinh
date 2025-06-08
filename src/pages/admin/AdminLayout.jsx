import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BankOutlined,
  BookOutlined,
  NotificationOutlined,
  UserOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  ReadOutlined,
  DollarOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current path to determine selected menu
  const currentPath = location.pathname.split('/').pop();
  const selectedMenu = currentPath === 'admin' ? 'dashboard' : currentPath;
  
  // Determine which parent menu should be open
  const getOpenKeys = () => {
    const universityPages = ['universities', 'majors', 'programs', 'scholarships'];
    const userPages = ['users', 'verification'];
    const contentPages = ['news'];
    
    if (universityPages.includes(selectedMenu)) {
      return ['university-management'];
    }
    if (userPages.includes(selectedMenu)) {
      return ['user-management'];
    }
    if (contentPages.includes(selectedMenu)) {
      return ['content-management'];
    }
    return [];
  };

  // Menu items with grouping
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      type: 'divider',
    },
    {
      key: 'university-management',
      icon: <BankOutlined />,
      label: <span className="font-semibold text-gray-700">University Management</span>,
      children: [
        {
          key: 'universities',
          icon: <BankOutlined />,
          label: 'Quản lý Trường ĐH',
        },
        {
          key: 'majors',
          icon: <BookOutlined />,
          label: 'Quản lý Ngành học',
        },
        {
          key: 'programs',
          icon: <ReadOutlined />,
          label: 'Chương trình Đào tạo',
        },
        {
          key: 'scholarships',
          icon: <TrophyOutlined />,
          label: 'Học bổng',
        },
      ],
    },
    {
      key: 'user-management',
      icon: <UserOutlined />,
      label: <span className="font-semibold text-gray-700">User Management</span>,
      children: [
        {
          key: 'users',
          icon: <UserOutlined />,
          label: 'Quản lý Người dùng',
        },
        {
          key: 'verification',
          icon: <SafetyCertificateOutlined />,
          label: 'Xác minh Thông tin',
        },
      ],
    },
    {
      key: 'content-management',
      icon: <NotificationOutlined />,
      label: <span className="font-semibold text-gray-700">Content Management</span>,
      children: [
        {
          key: 'news',
          icon: <NotificationOutlined />,
          label: 'Tin tức Tuyển sinh',
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt Hệ thống',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'dashboard') {
      navigate('/admin');
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} theme="light" className="shadow-lg">
        <div className="p-6 text-center border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-center mb-2">
            <span className="text-xl font-bold text-gray-800">Admin</span>
          </div>
          <div className="text-xs text-gray-600 font-semibold">University Information System</div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-none"
          style={{
            padding: '8px 0',
            background: 'transparent'
          }}
        />
      </Sider>
      
      <Layout>
        <Content className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 