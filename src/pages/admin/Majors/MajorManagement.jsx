import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Select } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined
} from '@ant-design/icons';
import MajorModal from './MajorModal';

const { Option } = Select;

const MajorManagement = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [universityFilter, setUniversityFilter] = useState('all');

  // Sample data based on schema - in real app, this would come from API
  const [majors, setMajors] = useState([
    {
      Id: 1,
      Name: 'Công nghệ Thông tin',
      Code: 'CNTT',
      Description: 'Ngành đào tạo chuyên gia công nghệ thông tin',
      AdmissionScore: 24.5,
      Year: 2024,
      UniversityId: 1,
      UniversityName: 'Đại học Bách Khoa Hà Nội'
    },
    {
      Id: 2,
      Name: 'Kỹ thuật Phần mềm',
      Code: 'KTPM',
      Description: 'Ngành đào tạo kỹ sư phần mềm',
      AdmissionScore: 25.0,
      Year: 2024,
      UniversityId: 1,
      UniversityName: 'Đại học Bách Khoa Hà Nội'
    },
    {
      Id: 3,
      Name: 'Kinh tế',
      Code: 'KTQT',
      Description: 'Ngành kinh tế quốc tế',
      AdmissionScore: 22.0,
      Year: 2024,
      UniversityId: 2,
      UniversityName: 'Đại học Quốc gia Hà Nội'
    },
    {
      Id: 4,
      Name: 'Quản trị Kinh doanh',
      Code: 'QTKD',
      Description: 'Ngành quản trị kinh doanh',
      AdmissionScore: 21.5,
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

  const columns = [
    {
      title: 'Mã ngành',
      dataIndex: 'Code',
      key: 'Code',
      width: 100,
      sorter: (a, b) => a.Code.localeCompare(b.Code),
    },
    {
      title: 'Tên ngành',
      dataIndex: 'Name',
      key: 'Name',
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: 'Trường',
      dataIndex: 'UniversityName',
      key: 'UniversityName',
      render: (text) => (
        <span className="text-blue-600">{text}</span>
      ),
    },
    {
      title: 'Điểm chuẩn',
      dataIndex: 'AdmissionScore',
      key: 'AdmissionScore',
      width: 120,
      sorter: (a, b) => (a.AdmissionScore || 0) - (b.AdmissionScore || 0),
      render: (score) => score ? 
        <Tag color="green">{score}</Tag> : 
        <Tag color="gray">Chưa có</Tag>,
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
            title="Bạn có chắc chắn muốn xóa ngành này?"
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
    setMajors(majors.filter(m => m.Id !== id));
    message.success('Đã xóa ngành học thành công');
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    if (editingRecord) {
      // Update existing major
      setMajors(majors.map(m => 
        m.Id === editingRecord.Id ? { 
          ...m, 
          ...values,
          UniversityName: universities.find(u => u.Id === values.UniversityId)?.Name || ''
        } : m
      ));
      message.success('Đã cập nhật thông tin ngành học');
    } else {
      // Add new major
      const newMajor = { 
        ...values, 
        Id: Date.now(),
        UniversityName: universities.find(u => u.Id === values.UniversityId)?.Name || ''
      };
      setMajors([...majors, newMajor]);
      message.success('Đã thêm ngành học mới');
    }
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  // Filter majors by university
  const filteredMajors = universityFilter === 'all' ? 
    majors : 
    majors.filter(m => m.UniversityId === parseInt(universityFilter));

  // Statistics
  const stats = {
    total: majors.length,
    withScore: majors.filter(m => m.AdmissionScore).length,
    byUniversity: universities.map(u => ({
      ...u,
      count: majors.filter(m => m.UniversityId === u.Id).length
    }))
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Ngành học</h2>
          <div className="flex space-x-4 mt-2 text-sm text-gray-600">
            <span>Tổng: {stats.total} ngành</span>
            <span>Có điểm chuẩn: {stats.withScore}</span>
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
            Thêm ngành mới
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
              <div className="text-gray-600">Tổng ngành</div>
            </div>
          </div>
        </div>
        {stats.byUniversity.slice(0, 3).map(uni => (
          <div key={uni.Id} className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold">{uni.count}</div>
            <div className="text-gray-600 text-sm">{uni.Name}</div>
          </div>
        ))}
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredMajors}
        rowKey="Id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} ngành học`,
        }}
        scroll={{ x: 1000 }}
      />

      <MajorModal
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

export default MajorManagement; 