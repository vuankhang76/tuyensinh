import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Users, 
  CheckCircle, 
  Clock, 
  Eye,
  Check,
  X,
  Edit
} from 'lucide-react';

const UniversityAdmin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  // Mock data for university
  const universityInfo = {
    name: "Đại học FPT",
    code: "FPU",
    logo: "/images/fpu.jpg",
    location: "Hà Nội",
    type: "Tư thục",
    establishedYear: 2006,
    students: 15000,
    website: "https://fpt.edu.vn",
    email: "info@fpt.edu.vn",
    phone: "024 7300 1955"
  };

  // Mock pending approvals
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 1,
      type: 'admission_info',
      title: 'Thông tin tuyển sinh 2024',
      content: 'Cập nhật điểm chuẩn và chỉ tiêu tuyển sinh',
      submittedBy: 'admin@fpt.edu.vn',
      submittedAt: '2024-01-15',
      status: 'pending'
    },
    {
      id: 2,
      type: 'program_update',
      title: 'Chương trình đào tạo mới',
      content: 'Thêm ngành AI và Machine Learning',
      submittedBy: 'dean@fpt.edu.vn',
      submittedAt: '2024-01-14',
      status: 'pending'
    },
    {
      id: 3,
      type: 'fee_update',
      title: 'Cập nhật học phí',
      content: 'Điều chỉnh học phí các ngành kỹ thuật',
      submittedBy: 'finance@fpt.edu.vn',
      submittedAt: '2024-01-13',
      status: 'approved'
    }
  ]);

  const handleApprove = (id) => {
    setPendingApprovals(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
  };

  const handleReject = (id) => {
    setPendingApprovals(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Chờ duyệt</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Đã duyệt</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Từ chối</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Building2 className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý trường đại học</h1>
            <p className="text-gray-600">Xin chào {user?.displayName} - {universityInfo.name}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'info' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('info')}
          >
            Thông tin trường
          </Button>
          <Button
            variant={activeTab === 'approvals' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('approvals')}
          >
            Duyệt thông tin
            {pendingApprovals.filter(item => item.status === 'pending').length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {pendingApprovals.filter(item => item.status === 'pending').length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Thông tin cơ bản</span>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tên trường</label>
                  <p className="text-gray-800">{universityInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mã trường</label>
                  <p className="text-gray-800">{universityInfo.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Loại hình</label>
                  <p className="text-gray-800">{universityInfo.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Năm thành lập</label>
                  <p className="text-gray-800">{universityInfo.establishedYear}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Địa điểm</label>
                  <p className="text-gray-800">{universityInfo.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Sinh viên</label>
                  <p className="text-gray-800">{universityInfo.students.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Thông tin liên hệ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Website</label>
                <p className="text-blue-600 hover:underline cursor-pointer">{universityInfo.website}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-800">{universityInfo.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Điện thoại</label>
                <p className="text-gray-800">{universityInfo.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Thống kê nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-gray-600">Ngành đào tạo</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1,200</div>
                  <div className="text-sm text-gray-600">Sinh viên mới</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">85%</div>
                  <div className="text-sm text-gray-600">Tỷ lệ việc làm</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4.2</div>
                  <div className="text-sm text-gray-600">Đánh giá TB</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Approvals Tab */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Danh sách chờ duyệt</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{item.content}</p>
                        <div className="text-xs text-gray-500">
                          Gửi bởi: {item.submittedBy} • {item.submittedAt}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                        {item.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(item.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(item.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UniversityAdmin; 