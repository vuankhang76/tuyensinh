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
  Award,
  Search,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react'
import scholarshipService from '@/services/scholarshipService'

const ScholarshipsTab = ({ universityId }) => {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    value: '',
    valueType: '',
    eligibilityCriteria: '',
    applicationDeadline: '',
    duration: '',
    numberOfRecipients: '',
    applicationProcess: '',
    requiredDocuments: '',
    contactInfo: '',
    status: 'Active'
  })

  useEffect(() => {
    fetchScholarships()
  }, [universityId])

  const fetchScholarships = async () => {
    try {
      setLoading(true)
      const data = await scholarshipService.getScholarshipsByUniversity(universityId)
      setScholarships(data)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách học bổng')
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
    if (!formData.name || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    try {
      setLoading(true)
      const scholarshipData = {
        ...formData,
        universityId: parseInt(universityId),
        value: formData.value ? parseFloat(formData.value) : null,
        numberOfRecipients: formData.numberOfRecipients ? parseInt(formData.numberOfRecipients) : null,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null
      }

      if (editingScholarship) {
        await scholarshipService.updateScholarship(editingScholarship.id, scholarshipData)
        toast.success('Cập nhật học bổng thành công!')
      } else {
        await scholarshipService.createScholarship(scholarshipData)
        toast.success('Thêm học bổng thành công!')
      }

      setIsDialogOpen(false)
      setEditingScholarship(null)
      setFormData({
        name: '',
        description: '',
        type: '',
        value: '',
        valueType: '',
        eligibilityCriteria: '',
        applicationDeadline: '',
        duration: '',
        numberOfRecipients: '',
        applicationProcess: '',
        requiredDocuments: '',
        contactInfo: '',
        status: 'Active'
      })
      fetchScholarships()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (scholarship) => {
    setEditingScholarship(scholarship)
    setFormData({
      name: scholarship.name || '',
      description: scholarship.description || '',
      type: scholarship.type || '',
      value: scholarship.value?.toString() || '',
      valueType: scholarship.valueType || '',
      eligibilityCriteria: scholarship.eligibilityCriteria || '',
      applicationDeadline: scholarship.applicationDeadline ? 
        new Date(scholarship.applicationDeadline).toISOString().split('T')[0] : '',
      duration: scholarship.duration || '',
      numberOfRecipients: scholarship.numberOfRecipients?.toString() || '',
      applicationProcess: scholarship.applicationProcess || '',
      requiredDocuments: scholarship.requiredDocuments || '',
      contactInfo: scholarship.contactInfo || '',
      status: scholarship.status || 'Active'
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (scholarshipId) => {
    try {
      setLoading(true)
      await scholarshipService.deleteScholarship(scholarshipId)
      toast.success('Xóa học bổng thành công!')
      fetchScholarships()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa học bổng')
    } finally {
      setLoading(false)
    }
  }

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-red-100 text-red-800'
      case 'Expired':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Học bổng học tập':
        return 'bg-blue-100 text-blue-800'
      case 'Học bổng tài năng':
        return 'bg-purple-100 text-purple-800'
      case 'Học bổng xã hội':
        return 'bg-emerald-100 text-emerald-800'
      case 'Học bổng doanh nghiệp':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatValue = (value, valueType) => {
    if (!value) return '-'
    if (valueType === 'percentage') {
      return `${value}%`
    } else if (valueType === 'amount') {
      return `${value.toLocaleString()} VNĐ`
    }
    return value
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('vi-VN')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quản lý học bổng</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các chương trình học bổng của trường đại học
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingScholarship(null)
              setFormData({
                name: '',
                description: '',
                type: '',
                value: '',
                valueType: '',
                eligibilityCriteria: '',
                applicationDeadline: '',
                duration: '',
                numberOfRecipients: '',
                applicationProcess: '',
                requiredDocuments: '',
                contactInfo: '',
                status: 'Active'
              })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm học bổng
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingScholarship ? 'Chỉnh sửa học bổng' : 'Thêm học bổng mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Tên học bổng *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Học bổng khuyến khích học tập..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Loại học bổng</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại học bổng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Học bổng học tập">Học bổng học tập</SelectItem>
                      <SelectItem value="Học bổng tài năng">Học bổng tài năng</SelectItem>
                      <SelectItem value="Học bổng xã hội">Học bổng xã hội</SelectItem>
                      <SelectItem value="Học bổng doanh nghiệp">Học bổng doanh nghiệp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Đang mở</SelectItem>
                      <SelectItem value="Inactive">Tạm dừng</SelectItem>
                      <SelectItem value="Expired">Hết hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="valueType">Loại giá trị</Label>
                  <Select value={formData.valueType} onValueChange={(value) => handleInputChange('valueType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại giá trị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amount">Số tiền cố định</SelectItem>
                      <SelectItem value="percentage">Phần trăm học phí</SelectItem>
                      <SelectItem value="full">Toàn phần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Giá trị học bổng</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                    placeholder={formData.valueType === 'percentage' ? '50' : '15000000'}
                  />
                </div>
                <div>
                  <Label htmlFor="numberOfRecipients">Số lượng nhận học bổng</Label>
                  <Input
                    id="numberOfRecipients"
                    type="number"
                    value={formData.numberOfRecipients}
                    onChange={(e) => handleInputChange('numberOfRecipients', e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Thời gian hiệu lực</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="1 năm học"
                  />
                </div>
                <div>
                  <Label htmlFor="applicationDeadline">Hạn nộp hồ sơ</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Mô tả học bổng *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả về chương trình học bổng..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="eligibilityCriteria">Điều kiện nhận học bổng</Label>
                <Textarea
                  id="eligibilityCriteria"
                  value={formData.eligibilityCriteria}
                  onChange={(e) => handleInputChange('eligibilityCriteria', e.target.value)}
                  placeholder="Các tiêu chí để nhận học bổng..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="applicationProcess">Quy trình nộp hồ sơ</Label>
                <Textarea
                  id="applicationProcess"
                  value={formData.applicationProcess}
                  onChange={(e) => handleInputChange('applicationProcess', e.target.value)}
                  placeholder="Các bước để nộp hồ sơ xin học bổng..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="requiredDocuments">Hồ sơ yêu cầu</Label>
                <Textarea
                  id="requiredDocuments"
                  value={formData.requiredDocuments}
                  onChange={(e) => handleInputChange('requiredDocuments', e.target.value)}
                  placeholder="Các giấy tờ cần thiết..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="contactInfo">Thông tin liên hệ</Label>
                <Textarea
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                  placeholder="Email, số điện thoại liên hệ..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : (editingScholarship ? 'Cập nhật' : 'Thêm mới')}
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
            placeholder="Tìm kiếm học bổng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Scholarships List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Danh sách học bổng ({filteredScholarships.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có học bổng nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên học bổng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Hạn nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScholarships.map((scholarship) => (
                  <TableRow key={scholarship.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{scholarship.name}</div>
                        {scholarship.duration && (
                          <div className="text-sm text-muted-foreground">
                            Thời hạn: {scholarship.duration}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {scholarship.type && (
                        <Badge variant="secondary" className={getTypeColor(scholarship.type)}>
                          {scholarship.type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formatValue(scholarship.value, scholarship.valueType)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        {scholarship.numberOfRecipients || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formatDate(scholarship.applicationDeadline)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(scholarship.status)}>
                        {scholarship.status === 'Active' ? 'Đang mở' : 
                         scholarship.status === 'Inactive' ? 'Tạm dừng' : 'Hết hạn'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(scholarship)}
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
                                Bạn có chắc chắn muốn xóa học bổng "{scholarship.name}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(scholarship.id)}
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

export default ScholarshipsTab 