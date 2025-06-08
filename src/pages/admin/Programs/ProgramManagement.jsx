import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Select, InputNumber } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  DollarOutlined
} from '@ant-design/icons';
import ProgramModal from './ProgramModal';

const { Option } = Select;

const ProgramManagement = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [universityFilter, setUniversityFilter] = useState('all');

  // Sample data based on schema - in real app, this would come from API
  const [programs, setPrograms] = useState([
    {
      Id: 1,
      Name: 'Cử nhân Công nghệ Thông tin',
      Description: 'Chương trình đào tạo cử nhân CNTT 4 năm',
      Tuition: 12000000,
      TuitionUnit: 'học kỳ',
      Year: 2024,
      UniversityId: 1,
      UniversityName: 'Đại học Bách Khoa Hà Nội'
    },
    {
      Id: 2,
      Name: 'Thạc sĩ Kỹ thuật Phần mềm',
      Description: 'Chương trình thạc sĩ KTPM 2 năm',
      Tuition: 18000000,
      TuitionUnit: 'học kỳ',
      Year: 2024,
      UniversityId: 1,
      UniversityName: 'Đại học Bách Khoa Hà Nội'
    },
    {
      Id: 3,
      Name: 'Cử nhân Quản trị Kinh doanh',
      Description: 'Chương trình cử nhân QTKD quốc tế',
      Tuition: 25000000,
      TuitionUnit: 'năm học',
      Year: 2024,
      UniversityId: 2,
      UniversityName: 'Đại học Quốc gia Hà Nội'
    },
    {
      Id: 4,
      Name: 'Liên thông Cao đẳng - Đại học CNTT',
      Description: 'Chương trình liên thông 2.5 năm',
      Tuition: 15000000,
      TuitionUnit: 'năm học',
      Year: 2024,
      UniversityId: 3,
      UniversityName: 'Đại học FPT'
    }
  ]);

  // Mock universities for filter
  const universities = [
    { Id: 1, Name: 'Đại học Bách Khoa Hà Nội' },
    { Id: 2, Name: 'Đại học Quốc gia Hà Nội' },
    { Id: 3, Name: 'Đại học FPT' }
  ];

  const formatCurrency = (amount, unit) => {
    return `${amount.toLocaleString('vi-VN')} VNĐ/${unit}`;
  };

  const columns = [
    {
      title: 'Tên chương trình',
      dataIndex: 'Name',
      key: 'Name',
      width: 250,
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: 'Trường',
      dataIndex: 'UniversityName',
      key: 'UniversityName',
      width: 200,
      render: (text) => (
        <span className="text-blue-600">{text}</span>
      ),
    },
    {
      title: 'Học phí',
      dataIndex: 'Tuition',
      key: 'Tuition',
      width: 180,
      sorter: (a, b) => (a.Tuition || 0) - (b.Tuition || 0),
      render: (tuition, record) => (
        <div className="flex items-center">
          <DollarOutlined className="text-green-500 mr-1" />
          <span className="font-semibold">
            {formatCurrency(tuition, record.TuitionUnit)}
          </span>
        </div>
      ),
    },
    {
      title: 'Năm',
      dataIndex: 'Year',
      key: 'Year',
      width: 80,
      sorter: (a, b) => (a.Year || 0) - (b.Year || 0),
    },
    {
      title: 'Mô tả',
      dataIndex: 'Description',
      key: 'Description',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chương trình này?"
            onConfirm={() => handleDelete(record.Id)}
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

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setPrograms(programs.filter(p => p.Id !== id));
    message.success('Đã xóa chương trình thành công');
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    if (editingRecord) {
      // Update existing program
      setPrograms(programs.map(p => 
        p.Id === editingRecord.Id ? { 
          ...p, 
          ...values,
          UniversityName: universities.find(u => u.Id === values.UniversityId)?.Name || ''
        } : p
      ));
      message.success('Đã cập nhật thông tin chương trình');
    } else {
      // Add new program
      const newProgram = { 
        ...values, 
        Id: Date.now(),
        UniversityName: universities.find(u => u.Id === values.UniversityId)?.Name || ''
      };
      setPrograms([...programs, newProgram]);
      message.success('Đã thêm chương trình mới');
    }
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  // Filter programs by university
  const filteredPrograms = universityFilter === 'all' ? 
    programs : 
    programs.filter(p => p.UniversityId === parseInt(universityFilter));

  // Statistics
  const stats = {
    total: programs.length,
    avgTuition: programs.reduce((sum, p) => sum + p.Tuition, 0) / programs.length,
    byUnit: {
      semester: programs.filter(p => p.TuitionUnit === 'học kỳ').length,
      year: programs.filter(p => p.TuitionUnit === 'năm học').length
    },
    byUniversity: universities.map(u => ({
      ...u,
      count: programs.filter(p => p.UniversityId === u.Id).length
    }))
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Chương trình Đào tạo</h2>
          <div className="flex space-x-4 mt-2 text-sm text-gray-600">
            <span>Tổng: {stats.total} chương trình</span>
            <span>Học phí TB: {stats.avgTuition.toLocaleString('vi-VN')} VNĐ</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Select
            value={universityFilter}
            onChange={setUniversityFilter}
            style={{ width: 200 }}
            placeholder="Lọc theo trường"
          >
            <Option value="all">Tất cả trường</Option>
            {universities.map(uni => (
              <Option key={uni.Id} value={uni.Id}>
                {uni.Name}
              </Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm chương trình mới
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <BookOutlined className="text-2xl text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-gray-600">Chương trình</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {stats.avgTuition.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-gray-600">Học phí TB (VNĐ)</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold text-orange-600">{stats.byUnit.semester}</div>
          <div className="text-gray-600">Học phí theo học kỳ</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-lg font-semibold text-purple-600">{stats.byUnit.year}</div>
          <div className="text-gray-600">Học phí theo năm</div>
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredPrograms}
        rowKey="Id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} chương trình`,
        }}
        scroll={{ x: 1000 }}
      />

      <ProgramModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        editingRecord={editingRecord}
        universities={universities}
      />
    </div>
  );
};

export default ProgramManagement; 