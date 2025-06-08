import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const UserManagement = () => {
  const [loading, setLoading] = useState(false);

  // Sample data - in real app, this would come from API
  const [users, setUsers] = useState([
    {
      id: 1,
      email: 'student@gmail.com',
      name: 'Nguyễn Văn A',
      role: 'student',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      email: 'admin@hust.edu.vn',
      name: 'Admin HUST',
      role: 'university',
      status: 'active',
      createdAt: '2024-01-05',
      lastLogin: '2024-01-14',
      verified: true
    },
    {
      id: 3,
      email: 'admin@system.com',
      name: 'System Administrator',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15',
      verified: true
    },
    {
      id: 4,
      email: 'newuser@example.com',
      name: 'Người dùng mới',
      role: 'student',
      status: 'pending',
      createdAt: '2024-01-10',
      lastLogin: null,
      verified: false
    }
  ]);

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => {
        const colors = {
          admin: 'red',
          university: 'blue', 
          student: 'green'
        };
        const labels = {
          admin: 'Quản trị',
          university: 'Trường ĐH',
          student: 'Sinh viên'
        };
        return (
          <Tag color={colors[role]}>
            {labels[role]}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const colors = {
          active: 'green',
          pending: 'orange',
          inactive: 'red'
        };
        const labels = {
          active: 'Hoạt động',
          pending: 'Chờ duyệt',
          inactive: 'Tạm khóa'
        };
        return (
          <Tag color={colors[status]}>
            {labels[status]}
          </Tag>
        );
      },
    },
    {
      title: 'Xác minh',
      dataIndex: 'verified',
      key: 'verified',
      width: 100,
      align: 'center',
      render: (verified) => (
        verified ? 
          <CheckCircleOutlined style={{ color: 'green', fontSize: '16px' }} /> : 
          <CloseCircleOutlined style={{ color: 'red', fontSize: '16px' }} />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 130,
      render: (lastLogin) => lastLogin || 'Chưa đăng nhập',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Sửa"
          />
          <Button 
            type="link" 
            icon={<SafetyCertificateOutlined />}
            onClick={() => handleVerify(record.id)}
            disabled={record.verified}
            title="Xác minh"
          />
          {record.role !== 'admin' && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />}
                title="Xóa"
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    // TODO: Open edit modal
    message.info('Chức năng sửa thông tin người dùng');
  };

  const handleVerify = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, verified: true, status: 'active' } : u
    ));
    message.success('Đã xác minh người dùng thành công');
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
    message.success('Đã xóa người dùng thành công');
  };

  const handleAdd = () => {
    // TODO: Open add user modal
    message.info('Chức năng thêm người dùng mới');
  };

  // Filter functions
  const pendingUsers = users.filter(u => u.status === 'pending');
  const unverifiedUsers = users.filter(u => !u.verified);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
          <div className="flex space-x-4 mt-2 text-sm text-gray-600">
            <span>Tổng: {users.length}</span>
            <span>Chờ duyệt: {pendingUsers.length}</span>
            <span>Chưa xác minh: {unverifiedUsers.length}</span>
          </div>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm người dùng
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} người dùng`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default UserManagement; 