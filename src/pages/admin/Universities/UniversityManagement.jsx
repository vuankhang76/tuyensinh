import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Avatar, Tag } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BankOutlined
} from '@ant-design/icons';
import UniversityModal from './UniversityModal';
import UniversityDetailModal from './UniversityDetailModal';

const UniversityManagement = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  // Sample data - in real app, this would come from API
  const [universities, setUniversities] = useState([
    {
      id: 1,
      name: 'Đại học Bách Khoa Hà Nội',
      code: 'HUST',
      address: 'Hà Nội',
      phone: '024-3868-3008',
      email: 'info@hust.edu.vn',
      website: 'https://hust.edu.vn',
      status: 'active',
      logo: 'https://example.com/logo1.png',
      description: 'Trường đại học hàng đầu về kỹ thuật và công nghệ',
      established: '1956',
      type: 'Công lập'
    },
    {
      id: 2,
      name: 'Đại học Quốc gia Hà Nội',
      code: 'VNU',
      address: 'Hà Nội',
      phone: '024-3754-7506',
      email: 'info@vnu.edu.vn',
      website: 'https://vnu.edu.vn',
      status: 'active',
      logo: 'https://example.com/logo2.png',
      description: 'Đại học quốc gia đa ngành',
      established: '1906',
      type: 'Công lập'
    },
    {
      id: 3,
      name: 'Đại học FPT',
      code: 'FPT',
      address: 'Hà Nội',
      phone: '024-7300-1866',
      email: 'info@fpt.edu.vn',
      website: 'https://fpt.edu.vn',
      status: 'active',
      logo: 'https://example.com/logo3.png',
      description: 'Trường đại học tư thục chuyên về công nghệ',
      established: '2006',
      type: 'Tư thục'
    }
  ]);

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 80,
      render: (logo) => <Avatar src={logo} icon={<BankOutlined />} />,
    },
    {
      title: 'Tên trường',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mã trường',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 120,
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={type === 'Công lập' ? 'blue' : 'green'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="Xem chi tiết"
          />
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa trường này?"
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
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    setViewingRecord(record);
    setIsDetailModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setUniversities(universities.filter(u => u.id !== id));
    message.success('Đã xóa trường đại học thành công');
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    if (editingRecord) {
      // Update existing university
      setUniversities(universities.map(u => 
        u.id === editingRecord.id ? { ...u, ...values } : u
      ));
      message.success('Đã cập nhật thông tin trường đại học');
    } else {
      // Add new university
      const newUniversity = { 
        ...values, 
        id: Date.now(),
        status: values.status || 'active'
      };
      setUniversities([...universities, newUniversity]);
      message.success('Đã thêm trường đại học mới');
    }
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý Trường Đại học</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm trường mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={universities}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} trường`,
        }}
        scroll={{ x: 1000 }}
      />

      <UniversityModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        editingRecord={editingRecord}
      />

      <UniversityDetailModal
        visible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setViewingRecord(null);
        }}
        record={viewingRecord}
      />
    </div>
  );
};

export default UniversityManagement; 