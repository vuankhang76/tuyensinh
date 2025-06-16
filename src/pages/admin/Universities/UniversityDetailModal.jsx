import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

const UniversityDetailModal = ({ visible, onCancel, record }) => {
  if (!record) return null;

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thông tin chi tiết trường đại học</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with logo and basic info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-20 w-20">
              <AvatarImage src={record.logo} alt={record.name} />
              <AvatarFallback>
                <Building2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{record.name}</h3>
              <p className="text-gray-600">{record.code}</p>
              <div className="flex space-x-2 mt-2">
                <Badge variant={record.type === 'Công lập' ? 'default' : 'secondary'}>
                  {record.type}
                </Badge>
                <Badge variant={record.status === 'active' ? 'secondary' : 'destructive'}>
                  {record.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Detailed information */}
          <div className="border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="border-b md:border-r md:border-b-0 p-4">
                <div className="font-bold text-sm text-gray-600 mb-1">Tên đầy đủ</div>
                <div className="text-gray-900">{record.name}</div>
              </div>
              
              <div className="border-b p-4">
                <div className="font-bold text-sm text-gray-600 mb-1">Mã trường</div>
                <div className="text-gray-900">{record.code}</div>
              </div>
              
              <div className="border-b md:border-r md:border-b-0 p-4">
                <div className="font-bold text-sm text-gray-600 mb-1">Năm thành lập</div>
                <div className="text-gray-900">{record.established || 'Chưa cập nhật'}</div>
              </div>
              
              <div className="border-b p-4">
                <div className="font-bold text-sm text-gray-600 mb-1">Loại hình</div>
                <Badge variant={record.type === 'Công lập' ? 'default' : 'secondary'}>
                  {record.type}
                </Badge>
              </div>
              
              <div className="border-b md:border-r md:border-b-0 p-4">
                <div className="font-bold text-sm text-gray-600 mb-1">Trạng thái</div>
                <Badge variant={record.status === 'active' ? 'secondary' : 'destructive'}>
                  {record.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </Badge>
              </div>
              
              <div className="border-b p-4">
                <div className="font-bold text-sm text-gray-600 mb-1">Địa chỉ</div>
                <div className="text-gray-900">{record.address}</div>
              </div>
              
              <div className="border-b md:border-r md:border-b-0 p-4">
                <div className="font-bold text-sm text-gray-600 mb-1">Điện thoại</div>
                <div className="text-gray-900">{record.phone || 'Chưa cập nhật'}</div>
              </div>
              
              <div className="border-b p-4">
                <div className="font-bold text-sm text-gray-600 mb-1">Email</div>
                <div className="text-gray-900">
                  {record.email ? (
                    <a href={`mailto:${record.email}`} className="text-blue-600 hover:text-blue-800">
                      {record.email}
                    </a>
                  ) : (
                    'Chưa cập nhật'
                  )}
                </div>
              </div>
              
              <div className="border-b md:border-r md:border-b-0 p-4 md:col-span-2">
                <div className="font-bold text-sm text-gray-600 mb-1">Website</div>
                <div className="text-gray-900">
                  {record.website ? (
                    <a 
                      href={record.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {record.website}
                    </a>
                  ) : (
                    'Chưa cập nhật'
                  )}
                </div>
              </div>
              
              {record.description && (
                <div className="p-4 md:col-span-2">
                  <div className="font-bold text-sm text-gray-600 mb-1">Mô tả</div>
                  <div className="text-gray-900 whitespace-pre-wrap">{record.description}</div>
                </div>
              )}
            </div>
          </div>

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
      </DialogContent>
    </Dialog>
  );
};

export default UniversityDetailModal; 