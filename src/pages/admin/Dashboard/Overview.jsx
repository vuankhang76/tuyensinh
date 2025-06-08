import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import {
  BankOutlined,
  BookOutlined,
  UserOutlined,
  NotificationOutlined
} from '@ant-design/icons';

const Overview = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    universities: 15,
    majors: 45,
    users: 128,
    publishedNews: 12
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Tổng quan hệ thống</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số trường ĐH"
              value={stats.universities}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số ngành học"
              value={stats.majors}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={stats.users}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tin tức đã xuất bản"
              value={stats.publishedNews}
              prefix={<NotificationOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} className="mt-6">
        <Col span={12}>
          <Card title="Hoạt động gần đây" className="h-96">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Trường ĐH ABC đã cập nhật thông tin</span>
                <span className="text-gray-500 text-sm">2 giờ trước</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Ngành Công nghệ thông tin mới được thêm</span>
                <span className="text-gray-500 text-sm">5 giờ trước</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Người dùng mới đăng ký</span>
                <span className="text-gray-500 text-sm">1 ngày trước</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Thống kê nhanh" className="h-96">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Trường đã xác minh</span>
                  <span className="font-semibold">12/15</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Người dùng hoạt động</span>
                  <span className="font-semibold">95/128</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '74%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Tin tức chờ duyệt</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Overview; 