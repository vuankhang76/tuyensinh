import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react'
import { universityViewService } from '@/services'
import { TableSkeleton } from '@/components/common/Loading/LoadingSkeleton'
import { Skeleton } from '@/components/ui/skeleton';

const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  tuition: '',
  tuitionUnit: '',
  year: ''
};

const UniversityProgramsTab = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await universityViewService.getMyPrograms();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setPrograms(sortedData);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách chương trình')
      setPrograms([])
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.name?.trim()) {
      errors.name = 'Tên chương trình là bắt buộc.';
    } else if (formData.name.trim().length > 255) {
      errors.name = 'Tên chương trình không được vượt quá 255 ký tự.';
    }

    if (!formData.year) {
      errors.year = 'Năm bắt đầu là bắt buộc.';
    } else if (isNaN(formData.year) || !Number.isInteger(Number(formData.year))) {
      errors.year = 'Năm phải là một số nguyên.';
    } else if (parseInt(formData.year) < 2010 || parseInt(formData.year) > currentYear + 3) {
      errors.year = `Năm phải nằm trong khoảng từ 2010 đến ${currentYear + 3}.`;
    }

    if (formData.tuition) {
      if (isNaN(formData.tuition)) {
        errors.tuition = 'Học phí phải là một số.';
      } else if (parseFloat(formData.tuition) < 0) {
        errors.tuition = 'Học phí không thể là số âm.';
      } else if (parseFloat(formData.tuition) > 1000000000) {
        errors.tuition = 'Học phí có vẻ quá cao, vui lòng kiểm tra lại.';
      }

      if (!formData.tuitionUnit?.trim()) {
        errors.tuitionUnit = 'Vui lòng nhập đơn vị học phí (ví dụ: VNĐ/năm).';
      }
    }

    if (formData.duration?.length > 100) {
      errors.duration = 'Thời gian đào tạo không được vượt quá 100 ký tự.';
    }

    if (formData.description?.length > 5000) {
      errors.description = 'Mô tả không được vượt quá 5000 ký tự.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }

    setLoading(true)
    try {
      const programData = {
        name: formData.name,
        description: formData.description,
        tuition: formData.tuition ? parseFloat(formData.tuition) : 0,
        tuitionUnit: formData.tuitionUnit,
        year: formData.year ? parseInt(formData.year) : new Date().getFullYear()
      }

      if (editingProgram) {
        programData.id = editingProgram.id;
        await universityViewService.updateMyProgram(editingProgram.id, programData)
        toast.success('Cập nhật chương trình thành công!')
      } else {
        await universityViewService.createMyProgram(programData)
        toast.success('Thêm chương trình thành công!')
      }

      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.errors) {
          const messages = Object.values(data.errors).flat();
          messages.forEach(msg => toast.error(msg));
        } else if (data.message) {
          toast.error(data.message);
        } else if (data.title) {
          toast.error(data.title);
        } else {
          toast.error('Có lỗi xảy ra khi lưu chương trình');
        }
      } else {
        toast.error('Có lỗi xảy ra khi lưu chương trình');
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditingProgram(null)
    setFormData({
      name: '',
      description: '',
      tuition: '',
      tuitionUnit: '',
      year: ''
    })
  }

  const handleEdit = (program) => {
    setEditingProgram(program)
    setFormData({
      name: program.name || '',
      description: program.description || '',
      tuition: program.tuition?.toString() || '',
      tuitionUnit: program.tuitionUnit || '',
      year: program.year?.toString() || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      await universityViewService.deleteMyProgram(id);
      toast.success('Xóa chương trình thành công!');
      await fetchData();
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi xóa chương trình');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quản lý chương trình đào tạo</h3>
          <p className="text-sm text-muted-foreground">
            Thêm, sửa, xóa thông tin chương trình đào tạo của trường.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} disabled={loading}>
              <Plus className="h-4 w-4 mr-1" />
              Thêm chương trình
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Chỉnh sửa chương trình' : 'Thêm chương trình mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name" className="mb-2">Tên chương trình *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="VD: Chương trình Tiên tiến Khoa học Máy tính" required />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}                </div>
                <div>
                  <Label htmlFor="tuition" className="mb-2">Học phí</Label>
                  <Input id="tuition" type="number" value={formData.tuition} onChange={(e) => handleInputChange('tuition', e.target.value)} placeholder="VD: 80000000" />
                  {formErrors.tuition && <p className="text-red-500 text-sm mt-1">{formErrors.tuition}</p>}                </div>
                <div>
                  <Label htmlFor="tuitionUnit" className="mb-2">Đơn vị học phí</Label>
                  <Input id="tuitionUnit" value={formData.tuitionUnit} onChange={(e) => handleInputChange('tuitionUnit', e.target.value)} placeholder="VD: VNĐ/năm" />
                  {formErrors.tuitionUnit && <p className="text-red-500 text-sm mt-1">{formErrors.tuitionUnit}</p>}                </div>
                <div>
                  <Label htmlFor="year" className="mb-2">Năm áp dụng *</Label>
                  <Input id="year" type="number" value={formData.year} onChange={(e) => handleInputChange('year', e.target.value)} placeholder={`VD: ${new Date().getFullYear()}`} required />
                  {formErrors.year && <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>}                </div>
              </div>
              <div>
                <Label htmlFor="description" className="mb-2">Mô tả chương trình</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Mô tả các điểm nổi bật của chương trình..." rows={4} />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : (editingProgram ? 'Cập nhật' : 'Thêm mới')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          {loading ? (
            <div className='animate-pulse'>
              <Skeleton className="h-6 w-1/4" />
            </div>
          ) : (
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Danh sách chương trình ({programs.length})
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton
              columns={[
                { width: "40%" },
                { width: "10%" },
                { width: "10%" },
              ]}
              rows={5}
            />
          ) : programs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Chưa có chương trình nào.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5%]">ID</TableHead>
                  <TableHead className="w-[40%]">Tên chương trình</TableHead>
                  <TableHead className="text-center">Năm</TableHead>
                  <TableHead>Học phí</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.id}</TableCell>
                    <TableCell>
                      <div className="font-medium" title={program.name}>{program.name}</div>
                      <p className="text-sm text-muted-foreground truncate w-140" title={program.description}>{program.description}</p>
                    </TableCell>
                    <TableCell className="text-center">{program.year}</TableCell>
                    <TableCell>
                      {program.tuition ? `${program.tuition.toLocaleString('vi-VN')} ${program.tuitionUnit || ''}` : 'Chưa cập nhật'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(program)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa chương trình <strong>"{program.name}"</strong> (Năm {program.year})? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(program.id)} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default UniversityProgramsTab; 