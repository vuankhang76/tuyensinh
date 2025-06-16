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
  BookOpen,
  DollarSign
} from 'lucide-react';
import ProgramModal from './ProgramModal';

const ProgramManagement = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [universityFilter, setUniversityFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

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

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (programToDelete) {
      setPrograms(programs.filter(p => p.Id !== programToDelete.Id));
      toast({
        title: "Thành công",
        description: "Đã xóa chương trình thành công",
      });
    }
    setDeleteDialogOpen(false);
    setProgramToDelete(null);
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
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin chương trình",
      });
    } else {
      // Add new program
      const newProgram = { 
        ...values, 
        Id: Date.now(),
        UniversityName: universities.find(u => u.Id === values.UniversityId)?.Name || ''
      };
      setPrograms([...programs, newProgram]);
      toast({
        title: "Thành công",
        description: "Đã thêm chương trình mới",
      });
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

  const sortedPrograms = [...filteredPrograms].sort((a, b) => a.Name.localeCompare(b.Name));

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
            Thêm chương trình mới
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
                <div className="text-gray-600">Chương trình</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.avgTuition.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-gray-600">Học phí TB (VNĐ)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-semibold text-orange-600">{stats.byUnit.semester}</div>
            <div className="text-gray-600">Học phí theo học kỳ</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-semibold text-purple-600">{stats.byUnit.year}</div>
            <div className="text-gray-600">Học phí theo năm</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Tên chương trình</TableHead>
              <TableHead className="w-48">Trường</TableHead>
              <TableHead className="w-44">Học phí</TableHead>
              <TableHead className="w-20">Năm</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-32">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPrograms.map((program) => (
              <TableRow key={program.Id}>
                <TableCell className="font-medium">{program.Name}</TableCell>
                <TableCell className="text-blue-600">{program.UniversityName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                    <span className="font-semibold">
                      {formatCurrency(program.Tuition, program.TuitionUnit)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{program.Year}</TableCell>
                <TableCell className="max-w-xs truncate" title={program.Description}>
                  {program.Description}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(program)}
                      title="Sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(program)}
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
          Hiển thị 1-{filteredPrograms.length} của {filteredPrograms.length} chương trình
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa chương trình</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chương trình "{programToDelete?.Name}"? 
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