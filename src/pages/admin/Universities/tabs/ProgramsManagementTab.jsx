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
  GraduationCap,
  Search,
  BookOpen
} from 'lucide-react'
import academicProgramService from '@/services/academicProgramService'

const ProgramsManagementTab = ({ universityId }) => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: '',
    level: '',
    duration: '',
    language: '',
    accreditation: '',
    requirements: '',
    objectives: ''
  })

  useEffect(() => {
    fetchPrograms()
  }, [universityId])

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const data = await academicProgramService.getProgramsByUniversity(universityId)
      setPrograms(data)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách chương trình')
    } finally {
      setLoading(false)
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
      const programData = {
        ...formData,
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
      setEditingProgram(null)
      setFormData({
        name: '',
        code: '',
        description: '',
        type: '',
        level: '',
        duration: '',
        language: '',
        accreditation: '',
        requirements: '',
        objectives: ''
      })
      fetchPrograms()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (program) => {
    setEditingProgram(program)
    setFormData({
      name: program.name || '',
      code: program.code || '',
      description: program.description || '',
      type: program.type || '',
      level: program.level || '',
      duration: program.duration || '',
      language: program.language || '',
      accreditation: program.accreditation || '',
      requirements: program.requirements || '',
      objectives: program.objectives || ''
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
    program.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getLevelColor = (level) => {
    switch (level) {
      case 'Cử nhân':
        return 'bg-blue-100 text-blue-800'
      case 'Thạc sĩ':
        return 'bg-green-100 text-green-800'
      case 'Tiến sĩ':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Chính quy':
        return 'bg-emerald-100 text-emerald-800'
      case 'Liên kết đào tạo':
        return 'bg-orange-100 text-orange-800'
      case 'Từ xa':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quản lý chương trình đào tạo</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các chương trình đào tạo của trường đại học
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProgram(null)
              setFormData({
                name: '',
                code: '',
                description: '',
                type: '',
                level: '',
                duration: '',
                language: '',
                accreditation: '',
                requirements: '',
                objectives: ''
              })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm chương trình
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Chỉnh sửa chương trình' : 'Thêm chương trình mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tên chương trình *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Chương trình Cử nhân Khoa học Máy tính"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Mã chương trình *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="CS_B"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Hình thức đào tạo</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hình thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chính quy">Chính quy</SelectItem>
                      <SelectItem value="Liên kết đào tạo">Liên kết đào tạo</SelectItem>
                      <SelectItem value="Từ xa">Từ xa</SelectItem>
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
                  <Label htmlFor="language">Ngôn ngữ giảng dạy</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tiếng Việt">Tiếng Việt</SelectItem>
                      <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                      <SelectItem value="Song ngữ">Song ngữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="accreditation">Chứng nhận chất lượng</Label>
                  <Input
                    id="accreditation"
                    value={formData.accreditation}
                    onChange={(e) => handleInputChange('accreditation', e.target.value)}
                    placeholder="ABET, AUN-QA, FIBAA..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Mô tả chương trình</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả về chương trình đào tạo..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="objectives">Mục tiêu đào tạo</Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => handleInputChange('objectives', e.target.value)}
                  placeholder="Các mục tiêu đào tạo của chương trình..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Điều kiện tuyển sinh</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Các điều kiện tuyển sinh..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : (editingProgram ? 'Cập nhật' : 'Thêm mới')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm chương trình..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Programs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Danh sách chương trình đào tạo ({filteredPrograms.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có chương trình đào tạo nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã chương trình</TableHead>
                  <TableHead>Tên chương trình</TableHead>
                  <TableHead>Hình thức</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Ngôn ngữ</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.code}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{program.name}</div>
                        {program.accreditation && (
                          <div className="text-sm text-muted-foreground">
                            Chứng nhận: {program.accreditation}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {program.type && (
                        <Badge variant="secondary" className={getTypeColor(program.type)}>
                          {program.type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{program.duration || '-'}</TableCell>
                    <TableCell>{program.language || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(program)}
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