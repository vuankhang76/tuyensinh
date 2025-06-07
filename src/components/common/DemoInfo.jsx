import React, { useState } from 'react';
import { Card, Button, Table, Tag } from 'antd';
import { InfoCircleOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const DemoInfo = () => {
  const [visible, setVisible] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null; // Hide in production
  }

  const demoAccounts = [
    {
      key: '1',
      type: 'Sinh viên',
      email: 'student@gmail.com',
      username: 'student1',
      password: '123456',
      role: 'student'
    },
    {
      key: '2',
      type: 'Trường ĐH',
      email: 'admin@hust.edu.vn',
      username: 'hust_admin',
      password: '123456',
      role: 'university'
    }
  ];

  const columns = [
    {
      title: 'Loại tài khoản',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => (
        <Tag color={record.role === 'student' ? 'blue' : 'green'}>
          {text}
        </Tag>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        type="primary"
        icon={visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        onClick={() => setVisible(!visible)}
        className="mb-2"
      >
        Demo Accounts
      </Button>
      
      {visible && (
        <Card 
          title={
            <div className="flex items-center gap-2">
              <InfoCircleOutlined />
              <span>Demo Accounts (Development)</span>
            </div>
          }
          className="w-96 shadow-lg"
          size="small"
        >
          <Table 
            columns={columns} 
            dataSource={demoAccounts} 
            pagination={false}
            size="small"
          />
          <div className="mt-3 text-xs text-gray-500">
            💡 Google Login cũng hoạt động bình thường
          </div>
        </Card>
      )}
    </div>
  );
};

export default DemoInfo; 