import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Select, DatePicker } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import AdmissionNewsModal from './AdmissionNewsModal';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdmissionNewsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [universityFilter, setUniversityFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  // Sample data based on schema - in real app, this would come from API
  const [admissionNews, setAdmissionNews] = useState([
    {
      Id: 1,
      Title: 'Thông báo tuyển sinh năm 2024 - Đại học Bách Khoa Hà Nội',
      Content: 'Trường Đại học Bách Khoa Hà Nội thông báo kế hoạch tuyển sinh năm 2024...',
      PublishDate: '2024-01-15T08:00:00',
      Year: 2024,
      UniversityId: 1,
      UniversityName: 'Đại học Bách Khoa Hà Nội',
      Status: 'published'
    },
    {
      Id: 2,
      Title: 'Điểm chuẩn dự kiến các ngành năm 2024',
      Content: 'Dự kiến điểm chuẩn các ngành tuyển sinh năm 2024...',
      PublishDate: '2024-01-20T10:30:00',
      Year: 2024,
      UniversityId: 1,
      UniversityName: 'Đại học Bách Khoa Hà Nội',
      Status: 'draft'
    },
    {
      Id: 3,
      Title: 'Hướng dẫn đăng ký xét tuyển trực tuyến',
      Content: 'Thí sinh tham khảo hướng dẫn đăng ký xét tuyển trực tuyến...',
      PublishDate: '2024-01-18T14:00:00',
      Year: 2024,
      UniversityId: 2,
      UniversityName: 'Đại học Quốc gia Hà Nội',
      Status: 'published'
    },
    {
      Id: 4,
      Title: 'Thông tin học bổng cho sinh viên năm nhất',
      Content: 'Các chương trình học bổng dành cho sinh viên năm nhất...',
      PublishDate: '2024-01-25T09:15:00',
      Year: 2024,
      UniversityId: 3,
      UniversityName: 'Đại học FPT',
      Status: 'published'
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
      title: 'Tiêu đề',
      dataIndex: 'Title',
      key: 'Title',
      ellipsis: true,
      width: 300,
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
      title: 'Ngày xuất bản',
      dataIndex: 'PublishDate',
      key: 'PublishDate',
      width: 150,
      sorter: (a, b) => moment(a.PublishDate).unix() - moment(b.PublishDate).unix(),
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Năm',
      dataIndex: 'Year',
      key: 'Year',
      width: 80,
      sorter: (a, b) => (a.Year || 0) - (b.Year || 0),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'Status',
      width: 120,
      render: (status) => {
        const colors = {
          published: 'green',
          draft: 'orange',
          archived: 'gray'
        };
        const labels = {
          published: 'Đã xuất bản',
          draft: 'Bản nháp',
          archived: 'Lưu trữ'
        };
        return (
          <Tag color={colors[status]}>
            {labels[status]}
          </Tag>
        );
      },
    },
    {
      title: 'Nội dung',
      dataIndex: 'Content',
      key: 'Content',
      ellipsis: true,
      render: (text) => (
        <span className="text-gray-600">
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="Xem"
          />
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tin này?"
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

  const handleView = (record) => {
    // TODO: Open view modal
    message.info('Chức năng xem chi tiết tin tức');
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setAdmissionNews(admissionNews.filter(n => n.Id !== id));
    message.success('Đã xóa tin tức thành công');
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    if (editingRecord) {
      // Update existing news
      setAdmissionNews(admissionNews.map(n => 
        n.Id === editingRecord.Id ? { 
          ...n, 
          ...values,
          UniversityName: universities.find(u => u.Id === values.UniversityId)?.Name || '',
          PublishDate: values.PublishDate.toISOString()
        } : n
      ));
      message.success('Đã cập nhật tin tức thành công');
    } else {
      // Add new news
      const newNews = { 
        ...values, 
        Id: Date.now(),
        UniversityName: universities.find(u => u.Id === values.UniversityId)?.Name || '',
        PublishDate: values.PublishDate.toISOString(),
        Status: values.Status || 'draft'
      };
      setAdmissionNews([...admissionNews, newNews]);
      message.success('Đã thêm tin tức mới');
    }
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  // Filter news
  let filteredNews = admissionNews;
  if (universityFilter !== 'all') {
    filteredNews = filteredNews.filter(n => n.UniversityId === parseInt(universityFilter));
  }
  if (yearFilter !== 'all') {
    filteredNews = filteredNews.filter(n => n.Year === parseInt(yearFilter));
  }

  // Statistics
  const stats = {
    total: admissionNews.length,
    published: admissionNews.filter(n => n.Status === 'published').length,
    draft: admissionNews.filter(n => n.Status === 'draft').length,
    thisMonth: admissionNews.filter(n => 
      moment(n.PublishDate).month() === moment().month() &&
      moment(n.PublishDate).year() === moment().year()
    ).length
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Tin tức Tuyển sinh</h2>
          <div className="flex space-x-4 mt-2 text-sm text-gray-600">
            <span>Tổng: {stats.total}</span>
            <span>Đã xuất bản: {stats.published}</span>
            <span>Bản nháp: {stats.draft}</span>
            <span>Tháng này: {stats.thisMonth}</span>
          </div>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm tin tức mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
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
        
        <Select
          value={yearFilter}
          onChange={setYearFilter}
          style={{ width: 120 }}
          placeholder="Lọc theo năm"
        >
          <Option value="all">Tất cả năm</Option>
          <Option value={2024}>2024</Option>
          <Option value={2023}>2023</Option>
          <Option value={2022}>2022</Option>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <NotificationOutlined className="text-2xl text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-gray-600">Tổng tin tức</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          <div className="text-gray-600">Đã xuất bản</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
          <div className="text-gray-600">Bản nháp</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{stats.thisMonth}</div>
          <div className="text-gray-600">Tháng này</div>
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredNews}
        rowKey="Id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} tin tức`,
        }}
        scroll={{ x: 1200 }}
      />

      <AdmissionNewsModal
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

export default AdmissionNewsManagement; 