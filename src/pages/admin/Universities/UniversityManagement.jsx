import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Building2
} from 'lucide-react';
import UniversityModal from './UniversityModal';
import UniversityDetailModal from './UniversityDetailModal';

const UniversityManagement = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);

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

  const handleView = (record) => {
    setViewingRecord(record);
    setIsDetailModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (university) => {
    setUniversityToDelete(university);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (universityToDelete) {
      setUniversities(universities.filter(u => u.id !== universityToDelete.id));
      toast({
        title: "Thành công",
        description: "Đã xóa trường đại học thành công",
      });
    }
    setDeleteDialogOpen(false);
    setUniversityToDelete(null);
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
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin trường đại học",
      });
    } else {
      // Add new university
      const newUniversity = { 
        ...values, 
        id: Date.now(),
        status: values.status || 'active'
      };
      setUniversities([...universities, newUniversity]);
      toast({
        title: "Thành công",
        description: "Đã thêm trường đại học mới",
      });
    }
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const getTypeBadge = (type) => {
    return type === 'Công lập' ? 'default' : 'secondary';
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? 'secondary' : 'destructive';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý Trường Đại học</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm trường mới
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Logo</TableHead>
              <TableHead>Tên trường</TableHead>
              <TableHead className="w-24">Mã trường</TableHead>
              <TableHead className="w-32">Địa chỉ</TableHead>
              <TableHead className="w-24">Loại hình</TableHead>
              <TableHead className="w-32">Trạng thái</TableHead>
              <TableHead className="w-44">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {universities.map((university) => (
              <TableRow key={university.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={university.logo} alt={university.name} />
                    <AvatarFallback>
                      <Building2 className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{university.name}</TableCell>
                <TableCell>{university.code}</TableCell>
                <TableCell>{university.address}</TableCell>
                <TableCell>
                  <Badge variant={getTypeBadge(university.type)}>
                    {university.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(university.status)}>
                    {university.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(university)}
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(university)}
                      title="Sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(university)}
                      className="text-red-600 hover:text-red-700"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị 1-{universities.length} của {universities.length} trường
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa trường đại học</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa trường "{universityToDelete?.name}" ({universityToDelete?.code})? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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