import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react'
import academicProgramService from '@/services/academicProgramService'

const ProgramsManagementTab = ({ universityId }) => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tuition: '',
    tuitionUnit: '',
    year: ''
  })

  useEffect(() => {
    if (universityId) {
      fetchPrograms()
    }
  }, [universityId])

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const data = await academicProgramService.getProgramsByUniversity(universityId)
      setPrograms(data)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách chương trình')
      setPrograms([])
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
        year: formData.year ? parseInt(formData.year) : new Date().getFullYear(),
        universityId: parseInt(universityId)
      }

      if (editingProgram) {
        await academicProgramService.updateProgram(editingProgram.id, programData)
        toast.success('Cập nhật chương trình thành công!')
      } else {
        await academicProgramService.createProgram(programData)
        toast.success('Thêm chương trình thành công!')
      }

      setIsDialogOpen(false)
      resetForm()
      fetchPrograms()
    } catch (error) {
      toast.error(editingProgram ? 'Lỗi khi cập nhật' : 'Lỗi khi thêm mới')
    } finally {
      setLoading(false)
    }
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

  const handleDelete = async (programId) => {
    try {
      setLoading(true)
      await academicProgramService.deleteProgram(programId)
      toast.success('Xóa chương trình thành công!')
      fetchPrograms()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa chương trình')
    } finally {
      setLoading(false)
    }
  }

  const filteredPrograms = programs.filter(program =>
    program.name?.toLowerCase()
  )

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Tên chương trình là bắt buộc';
    }
    if (!formData.year || isNaN(formData.year) || parseInt(formData.year) < 1900) {
      errors.year = 'Năm áp dụng phải là số hợp lệ';
    }
    if (formData.tuition) {
      if (isNaN(formData.tuition) || parseFloat(formData.tuition) < 0) {
        errors.tuition = 'Học phí phải là số không âm';
      }
      if (!formData.tuitionUnit.trim()) {
        errors.tuitionUnit = 'Vui lòng nhập đơn vị học phí';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

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
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Danh sách chương trình ({filteredPrograms.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Không tìm thấy chương trình nào.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Tên chương trình</TableHead>
                  <TableHead className="text-center">Năm</TableHead>
                  <TableHead>Học phí</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div className="font-medium">{program.name}</div>
                      <p className="text-sm text-muted-foreground truncate">{program.description}</p>
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
                                Bạn có chắc chắn muốn xóa chương trình "{program.name}" (Năm {program.year})? Hành động này không thể hoàn tác.
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

export default ProgramsManagementTab