import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Search,
  MoreHorizontal
} from 'lucide-react'
import majorService from '@/services/majorService'
import academicProgramService from '@/services/academicProgramService'

const MajorsManagementTab = ({ universityId }) => {
  const [majors, setMajors] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMajor, setEditingMajor] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    duration: '',
    degree: '',
    programId: '',
    tuitionFee: '',
    admissionQuota: '',
    credits: ''
  })

  useEffect(() => {
    fetchMajors()
    fetchPrograms()
  }, [universityId])

  const fetchMajors = async () => {
    try {
      setLoading(true)
      const data = await majorService.getMajorsByUniversity(universityId)
      setMajors(data)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách ngành học')
    } finally {
      setLoading(false)
    }
  }

  const fetchPrograms = async () => {
    try {
      const data = await academicProgramService.getProgramsByUniversity(universityId)
      setPrograms(data)
    } catch (error) {
      console.error('Error fetching programs:', error)
      setPrograms([])
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.code) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    try {
      setLoading(true)
      const majorData = {
        ...formData,
        universityId: parseInt(universityId),
        programId: formData.programId ? parseInt(formData.programId) : null,
        tuitionFee: formData.tuitionFee ? parseFloat(formData.tuitionFee) : null,
        admissionQuota: formData.admissionQuota ? parseInt(formData.admissionQuota) : null,
        credits: formData.credits ? parseInt(formData.credits) : null
      }

      if (editingMajor) {
        await majorService.updateMajor(editingMajor.id, majorData)
        toast.success('Cập nhật ngành học thành công!')
      } else {
        await majorService.createMajor(majorData)
        toast.success('Thêm ngành học thành công!')
      }

      setIsDialogOpen(false)
      setEditingMajor(null)
      setFormData({
        name: '',
        code: '',
        description: '',
        duration: '',
        degree: '',
        programId: '',
        tuitionFee: '',
        admissionQuota: '',
        credits: ''
      })
      fetchMajors()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (major) => {
    setEditingMajor(major)
    setFormData({
      name: major.name || '',
      code: major.code || '',
      description: major.description || '',
      duration: major.duration || '',
      degree: major.degree || '',
      programId: major.programId?.toString() || '',
      tuitionFee: major.tuitionFee?.toString() || '',
      admissionQuota: major.admissionQuota?.toString() || '',
      credits: major.credits?.toString() || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (majorId) => {
    try {
      setLoading(true)
      await majorService.deleteMajor(majorId)
      toast.success('Xóa ngành học thành công!')
      fetchMajors()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa ngành học')
    } finally {
      setLoading(false)
    }
  }

  const getProgramName = (programId) => {
    const program = programs.find(p => p.id === programId)
    return program ? program.name : 'Chưa phân loại'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quản lý ngành học</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các ngành học của trường đại học
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingMajor(null)
              setFormData({
                name: '',
                code: '',
                description: '',
                duration: '',
                degree: '',
                programId: '',
                tuitionFee: '',
                admissionQuota: '',
                credits: ''
              })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm ngành học
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMajor ? 'Chỉnh sửa ngành học' : 'Thêm ngành học mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tên ngành học *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Công nghệ thông tin"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Mã ngành *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="CNTT"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="degree"></Label>
                  <Select value={formData.degree} onValueChange={(value) => handleInputChange('degree', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bậc đào tạo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cử nhân">Cử nhân</SelectItem>
                      <SelectItem value="Thạc sĩ">Thạc sĩ</SelectItem>
                      <SelectItem value="Tiến sĩ">Tiến sĩ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Thời gian đào tạo</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="4 năm"
                  />
                </div>
                <div>
                  <Label htmlFor="programId">Chương trình đào tạo</Label>
                  <Select value={formData.programId} onValueChange={(value) => handleInputChange('programId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chương trình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Chưa phân loại</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id.toString()}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="credits">Số tín chỉ</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) => handleInputChange('credits', e.target.value)}
                    placeholder="120"
                  />
                </div>
                <div>
                  <Label htmlFor="tuitionFee">Học phí (VNĐ)</Label>
                  <Input
                    id="tuitionFee"
                    type="number"
                    value={formData.tuitionFee}
                    onChange={(e) => handleInputChange('tuitionFee', e.target.value)}
                    placeholder="15000000"
                  />
                </div>
                <div>
                  <Label htmlFor="admissionQuota">Chỉ tiêu tuyển sinh</Label>
                  <Input
                    id="admissionQuota"
                    type="number"
                    value={formData.admissionQuota}
                    onChange={(e) => handleInputChange('admissionQuota', e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Mô tả ngành học</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả về ngành học..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : (editingMajor ? 'Cập nhật' : 'Thêm mới')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Danh sách ngành học ({majors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : majors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có ngành học nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã ngành</TableHead>
                  <TableHead>Tên ngành</TableHead>
                  <TableHead>Điểm chuẩn</TableHead>
                  <TableHead>Chương trình</TableHead>
                  <TableHead>Chỉ tiêu</TableHead>
                  <TableHead>Tổ hợp môn</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {majors.map((major) => (
                  <TableRow key={major.id}>
                    <TableCell className="font-medium">{major.code}</TableCell>
                    <TableCell>{major.name}</TableCell>
                    <TableCell>
                      {major.degree && (
                        <Badge variant="secondary">{major.degree}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getProgramName(major.programId)}</TableCell>
                    <TableCell>{major.admissionQuota || '-'}</TableCell>
                    <TableCell>
                      {major.tuitionFee ? `${major.tuitionFee.toLocaleString()} VNĐ` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(major)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa ngành học "{major.name}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(major.id)}
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MajorsManagementTab 