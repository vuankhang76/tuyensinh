import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  BookOpen
} from 'lucide-react';
import MajorModal from './MajorModal';

const MajorManagement = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [universityFilter, setUniversityFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [majorToDelete, setMajorToDelete] = useState(null);

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

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (major) => {
    setMajorToDelete(major);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (majorToDelete) {
      setMajors(majors.filter(m => m.Id !== majorToDelete.Id));
      toast({
        title: "Thành công",
        description: "Đã xóa ngành học thành công",
      });
    }
    setDeleteDialogOpen(false);
    setMajorToDelete(null);
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
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin ngành học",
      });
    } else {
      // Add new major
      const newMajor = { 
        ...values, 
        Id: Date.now(),
        UniversityName: universities.find(u => u.Id === values.UniversityId)?.Name || ''
      };
      setMajors([...majors, newMajor]);
      toast({
        title: "Thành công",
        description: "Đã thêm ngành học mới",
      });
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

  const sortedMajors = [...filteredMajors].sort((a, b) => a.Code.localeCompare(b.Code));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý ngành học</h2>
          <div className="flex space-x-4 mt-2 text-sm text-gray-600">
            <span>Tổng: {stats.total} ngành</span>
            <span>Có điểm chuẩn: {stats.withScore}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Select value={universityFilter} onValueChange={setUniversityFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Lọc theo trường" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trường</SelectItem>
              {universities.map(uni => (
                <SelectItem key={uni.Id} value={uni.Id.toString()}>
                  {uni.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm ngành mới
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-gray-600">Tổng ngành</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Mã ngành</TableHead>
              <TableHead>Tên ngành</TableHead>
              <TableHead>Trường</TableHead>
              <TableHead className="w-32">Điểm chuẩn</TableHead>
              <TableHead className="w-20">Năm</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-32">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMajors.map((major) => (
              <TableRow key={major.Id}>
                <TableCell className="font-medium">{major.Code}</TableCell>
                <TableCell>{major.Name}</TableCell>
                <TableCell className="text-blue-600">{major.UniversityName}</TableCell>
                <TableCell>
                  {major.AdmissionScore ? (
                    <Badge variant="secondary">{major.AdmissionScore}</Badge>
                  ) : (
                    <Badge variant="outline">Chưa có</Badge>
                  )}
                </TableCell>
                <TableCell>{major.Year}</TableCell>
                <TableCell className="max-w-xs truncate" title={major.Description}>
                  {major.Description}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(major)}
                      title="Sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(major)}
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
          Hiển thị 1-{filteredMajors.length} của {filteredMajors.length} ngành học
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa ngành học</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa ngành "{majorToDelete?.Name}" ({majorToDelete?.Code})? 
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