import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, BookOpen, Search, DollarSign } from 'lucide-react';
import { universityViewService } from '@/services';

const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  tuition: '',
  tuitionUnit: 'VNĐ/năm',
  year: new Date().getFullYear().toString(),
};

const UniversityProgramsTab = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await universityViewService.getMyPrograms();
      setPrograms(data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu chương trình');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const filtered = programs.filter(program =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPrograms(filtered);
  }, [programs, searchQuery]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Tên chương trình là bắt buộc';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Mô tả là bắt buộc';
    }

    if (!formData.year?.trim()) {
      errors.year = 'Năm là bắt buộc';
    }

    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.year);
    if (isNaN(year) || year < 2000 || year > currentYear + 5) {
      errors.year = `Năm phải từ 2000 đến ${currentYear + 5}`;
    }

    if (formData.tuition && (isNaN(formData.tuition) || formData.tuition < 0)) {
      errors.tuition = 'Học phí phải là số không âm';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        tuition: formData.tuition ? parseFloat(formData.tuition) : null,
        tuitionUnit: formData.tuitionUnit || 'VNĐ/năm',
        year: parseInt(formData.year)
      };

      if (editingProgram) {
        await universityViewService.updateMyProgram(editingProgram.id, {
          ...submitData,
          id: editingProgram.id
        });
        toast.success('Cập nhật chương trình thành công!');
      } else {
        await universityViewService.createMyProgram(submitData);
        toast.success('Thêm chương trình thành công!');
      }

      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Lỗi khi lưu chương trình:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi lưu chương trình');
      }
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name || '',
      description: program.description || '',
      tuition: program.tuition?.toString() || '',
      tuitionUnit: program.tuitionUnit || 'VNĐ/năm',
      year: program.year?.toString() || new Date().getFullYear().toString(),
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await universityViewService.deleteMyProgram(id);
      toast.success('Xóa chương trình thành công!');
      await fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa chương trình:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi xóa chương trình');
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProgram(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  };

  const formatTuition = (tuition, unit) => {
    if (!tuition) return 'Chưa có thông tin';
    
    const formattedTuition = new Intl.NumberFormat('vi-VN').format(tuition);
    return `${formattedTuition} ${unit || 'VNĐ/năm'}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Quản lý chương trình đào tạo</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm chương trình
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProgram ? 'Chỉnh sửa chương trình' : 'Thêm chương trình mới'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Tên chương trình *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={formErrors.name ? "border-red-500" : ""}
                    placeholder="VD: Cử nhân Công nghệ thông tin"
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Năm *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className={formErrors.year ? "border-red-500" : ""}
                      placeholder={new Date().getFullYear().toString()}
                      min="2000"
                      max={new Date().getFullYear() + 5}
                    />
                    {formErrors.year && <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="tuition">Học phí</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="tuition"
                        type="number"
                        value={formData.tuition}
                        onChange={(e) => handleInputChange('tuition', e.target.value)}
                        className={formErrors.tuition ? "border-red-500" : ""}
                        placeholder="20000000"
                        min="0"
                      />
                      <select
                        value={formData.tuitionUnit}
                        onChange={(e) => handleInputChange('tuitionUnit', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                      >
                        <option value="VNĐ/năm">VNĐ/năm</option>
                        <option value="VNĐ/học kỳ">VNĐ/học kỳ</option>
                        <option value="VNĐ/tín chỉ">VNĐ/tín chỉ</option>
                      </select>
                    </div>
                    {formErrors.tuition && <p className="text-red-500 text-sm mt-1">{formErrors.tuition}</p>}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Mô tả *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={formErrors.description ? "border-red-500" : ""}
                    placeholder="Mô tả về chương trình đào tạo..."
                    rows={4}
                  />
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Hủy
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingProgram ? 'Cập nhật' : 'Thêm'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm chương trình..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Badge variant="secondary" className="ml-auto">
            Tổng: {programs.length} chương trình
          </Badge>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên chương trình</TableHead>
                <TableHead>Năm</TableHead>
                <TableHead>Học phí</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'Không tìm thấy chương trình nào' : 'Chưa có chương trình nào'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{program.year}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          {formatTuition(program.tuition, program.tuitionUnit)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={program.description}>
                        {program.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(program)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa chương trình "{program.name}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(program.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversityProgramsTab; 