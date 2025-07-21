import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Award } from 'lucide-react';
import { TableSkeleton } from '@/components/common/Loading/LoadingSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { universityViewService } from '@/services';

const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  value: '',
  valueType: '',
  criteria: '',
  year: new Date().getFullYear().toString(),
};


const UniversityScholarshipsTab = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    setScholarships([]);
    try {
      const data = await universityViewService.getMyScholarships();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setScholarships(sortedData);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách học bổng');
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validateForm = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();
    if (!formData.name?.trim()) {
      errors.name = 'Tên học bổng là bắt buộc.';
    }
    if (formData.value) {
      if (isNaN(formData.value)) {
        errors.value = 'Giá trị phải là một số.';
      } else if (parseFloat(formData.value) < 0) {
        errors.value = 'Giá trị không thể là số âm.';
      }
      if (!formData.valueType?.trim()) {
        errors.valueType = 'Vui lòng nhập đơn vị cho giá trị (vd: VNĐ, %, suất...).';
      }
    }
    if (!formData.year || isNaN(formData.year) || parseInt(formData.year) < 2020 || parseInt(formData.year) > currentYear + 2) {
      errors.year = `Năm phải nằm trong khoảng từ 2020 đến ${currentYear + 2}.`;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleOpenNewDialog = () => {
    setEditingScholarship(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }
    setLoading(true);
    try {
      const scholarshipData = {
        name: formData.name,
        description: formData.description,
        value: formData.value ? parseFloat(formData.value) : null,
        valueType: formData.valueType,
        criteria: formData.criteria,
        year: formData.year ? parseInt(formData.year) : new Date().getFullYear(),
      };

      if (editingScholarship) {
        await universityViewService.updateMyScholarship(editingScholarship.id, {
          ...scholarshipData,
          id: editingScholarship.id
        });
        toast.success('Cập nhật học bổng thành công!');

      } else {
        await universityViewService.createMyScholarship(scholarshipData);
        toast.success('Thêm học bổng thành công!');
      }
      setIsDialogOpen(false);
      await fetchData();
    } catch (error) {
      toast.error(`Lỗi: ${error?.response?.data?.title || error.message || 'Không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      name: scholarship.name || '',
      description: scholarship.description || '',
      value: scholarship.value?.toString() || '',
      valueType: scholarship.valueType || '',
      criteria: scholarship.criteria || '',
      year: scholarship.year?.toString() || new Date().getFullYear().toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await universityViewService.deleteMyScholarship(id);
      toast.success('Xóa học bổng thành công!');
      await fetchData();
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi xóa học bổng');
      }
    }
  };

  const formatValue = (value, valueType) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    const formattedNumber = Number(value).toLocaleString('vi-VN');
    return valueType ? `${formattedNumber} ${valueType}` : formattedNumber;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quản lý học bổng</h3>
          <p className="text-sm text-muted-foreground">Thêm, sửa, xóa các chương trình học bổng.</p>
        </div>
        <Button onClick={handleOpenNewDialog} disabled={loading}><Plus className="h-4 w-4 mr-1" /> Thêm học bổng</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingScholarship ? 'Chỉnh sửa học bổng' : 'Thêm học bổng mới'}</DialogTitle>
            <DialogDescription>
              {editingScholarship ? 'Cập nhật thông tin học bổng' : 'Thêm học bổng mới'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name" className="mb-2">Tên học bổng *</Label>
                <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <Label htmlFor="value" className="mb-2">Giá trị</Label>
                <Input id="value" type="number" value={formData.value} onChange={e => handleInputChange('value', e.target.value)} />
                {formErrors.value && <p className="text-red-500 text-sm mt-1">{formErrors.value}</p>}
              </div>
              <div>
                <Label htmlFor="valueType" className="mb-2">Đơn vị của giá trị</Label>
                <Input id="valueType" value={formData.valueType} onChange={e => handleInputChange('valueType', e.target.value)} placeholder="VNĐ/năm, %, Toàn phần..." />
                {formErrors.valueType && <p className="text-red-500 text-sm mt-1">{formErrors.valueType}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="year" className="mb-2">Năm</Label>
                <Input id="year" type="number" value={formData.year} onChange={e => handleInputChange('year', e.target.value)} />
                {formErrors.year && <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="mb-2">Mô tả</Label>
              <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="criteria" className="mb-2">Điều kiện</Label>
              <Textarea id="criteria" value={formData.criteria} onChange={e => handleInputChange('criteria', e.target.value)} rows={4} />
            </div>
            <div className="flex justify-end space-x-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button><Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button></div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          {loading ? (
            <div className='animate-pulse'>
              <Skeleton className="h-6 w-1/4" />
            </div>
          ) : (
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" /> Danh sách học bổng ({scholarships.length})
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton columns={[{ width: "5%" }, { width: "40%" }, { width: "20%" }, { width: "15%" }, { width: "20%" }]} rows={5} />
          ) : scholarships.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Chưa có học bổng nào.</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]">ID</TableHead>
                    <TableHead>Tên học bổng</TableHead>
                    <TableHead>Giá trị</TableHead>
                    <TableHead>Năm</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scholarships.map(scholarship => (
                    <TableRow key={scholarship.id}>
                      <TableCell className="font-medium">{scholarship.id}</TableCell>
                      <TableCell className="font-medium" title={scholarship.name}>{scholarship.name}</TableCell>
                      <TableCell title={formatValue(scholarship.value, scholarship.valueType)}>{formatValue(scholarship.value, scholarship.valueType)}</TableCell>
                      <TableCell>{scholarship.year}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(scholarship)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Xác nhận xóa</AlertDialogTitle><AlertDialogDescription>Bạn có chắc muốn xóa học bổng <strong>"{scholarship.name}"</strong>?</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(scholarship.id)} className="bg-red-600">Xóa</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversityScholarshipsTab; 