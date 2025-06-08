import React from 'react';
import { Modal, Descriptions, Avatar, Tag } from 'antd';
import { BankOutlined } from '@ant-design/icons';

const UniversityDetailModal = ({ visible, onCancel, record }) => {
  if (!record) return null;

  return (
    <Modal
      title="Thông tin chi tiết trường đại học"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div className="space-y-6">
        {/* Header with logo and basic info */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <Avatar 
            size={80} 
            src={record.logo} 
            icon={<BankOutlined />}
          />
          <div>
            <h3 className="text-xl font-bold text-gray-800">{record.name}</h3>
            <p className="text-gray-600">{record.code}</p>
            <div className="flex space-x-2 mt-2">
              <Tag color={record.type === 'Công lập' ? 'blue' : 'green'}>
                {record.type}
              </Tag>
              <Tag color={record.status === 'active' ? 'green' : 'red'}>
                {record.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
              </Tag>
            </div>
          </div>
        </div>

        {/* Detailed information */}
        <Descriptions 
          bordered 
          column={2}
          size="middle"
          labelStyle={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}
        >
          <Descriptions.Item label="Tên đầy đủ" span={2}>
            {record.name}
          </Descriptions.Item>
          
          <Descriptions.Item label="Mã trường">
            {record.code}
          </Descriptions.Item>
          
          <Descriptions.Item label="Năm thành lập">
            {record.established || 'Chưa cập nhật'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Loại hình">
            <Tag color={record.type === 'Công lập' ? 'blue' : 'green'}>
              {record.type}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái">
            <Tag color={record.status === 'active' ? 'green' : 'red'}>
              {record.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Địa chỉ" span={2}>
            {record.address}
          </Descriptions.Item>
          
          <Descriptions.Item label="Điện thoại">
            {record.phone || 'Chưa cập nhật'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Email">
            {record.email ? (
              <a href={`mailto:${record.email}`} className="text-blue-600">
                {record.email}
              </a>
            ) : (
              'Chưa cập nhật'
            )}
          </Descriptions.Item>
          
          <Descriptions.Item label="Website" span={2}>
            {record.website ? (
              <a 
                href={record.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {record.website}
              </a>
            ) : (
              'Chưa cập nhật'
            )}
          </Descriptions.Item>
          
          {record.description && (
            <Descriptions.Item label="Mô tả" span={2}>
              <div className="whitespace-pre-wrap">{record.description}</div>
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Statistics section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Thống kê</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Ngành đào tạo</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">1,234</div>
              <div className="text-sm text-gray-600">Sinh viên</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">89</div>
              <div className="text-sm text-gray-600">Giảng viên</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UniversityDetailModal; 