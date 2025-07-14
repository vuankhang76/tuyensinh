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
  Newspaper,
  Search,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react'
import admissionNewsService from '@/services/admissionNewsService'

const AdmissionNewsTab = ({ universityId }) => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: '',
    status: 'Draft',
    publishDate: '',
    expiryDate: '',
    tags: '',
    featuredImage: '',
    isImportant: false
  })

  useEffect(() => {
    fetchNews()
  }, [universityId])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const data = await admissionNewsService.getAdmissionNewsByUniversity(universityId)
      setNews(data)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách tin tức')
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
    if (!formData.title || !formData.content) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    try {
      setLoading(true)
      const newsData = {
        ...formData,
        universityId: parseInt(universityId),
        publishDate: formData.publishDate ? new Date(formData.publishDate).toISOString() : null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      }

      if (editingNews) {
        await admissionNewsService.updateAdmissionNews(editingNews.id, newsData)
        toast.success('Cập nhật tin tức thành công!')
      } else {
        await admissionNewsService.createAdmissionNews(newsData)
        toast.success('Thêm tin tức thành công!')
      }

      setIsDialogOpen(false)
      setEditingNews(null)
      setFormData({
        title: '',
        content: '',
        summary: '',
        category: '',
        status: 'Draft',
        publishDate: '',
        expiryDate: '',
        tags: '',
        featuredImage: '',
        isImportant: false
      })
      fetchNews()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem)
    setFormData({
      title: newsItem.title || '',
      content: newsItem.content || '',
      summary: newsItem.summary || '',
      category: newsItem.category || '',
      status: newsItem.status || 'Draft',
      publishDate: newsItem.publishDate ? new Date(newsItem.publishDate).toISOString().split('T')[0] : '',
      expiryDate: newsItem.expiryDate ? new Date(newsItem.expiryDate).toISOString().split('T')[0] : '',
      tags: Array.isArray(newsItem.tags) ? newsItem.tags.join(', ') : newsItem.tags || '',
      featuredImage: newsItem.featuredImage || '',
      isImportant: newsItem.isImportant || false
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (newsId) => {
    try {
      setLoading(true)
      await admissionNewsService.deleteAdmissionNews(newsId)
      toast.success('Xóa tin tức thành công!')
      fetchNews()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa tin tức')
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (newsItem) => {
    try {
      const newStatus = newsItem.status === 'Published' ? 'Draft' : 'Published'
      await admissionNewsService.updateAdmissionNews(newsItem.id, {
        ...newsItem,
        status: newStatus
      })
      toast.success(`${newStatus === 'Published' ? 'Xuất bản' : 'Ẩn'} tin tức thành công!`)
      fetchNews()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }

  const filteredNews = news.filter(newsItem =>
    newsItem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsItem.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800'
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'Archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Thông báo chung':
        return 'bg-blue-100 text-blue-800'
      case 'Tuyển sinh':
        return 'bg-emerald-100 text-emerald-800'
      case 'Học bổng':
        return 'bg-purple-100 text-purple-800'
      case 'Sự kiện':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
          <h3 className="text-lg font-semibold">Quản lý tin tức tuyển sinh</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các tin tức và thông báo tuyển sinh của trường đại học
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingNews(null)
              setFormData({
                title: '',
                content: '',
                summary: '',
                category: '',
                status: 'Draft',
                publishDate: '',
                expiryDate: '',
                tags: '',
                featuredImage: '',
                isImportant: false
              })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm tin tức
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Tiêu đề tin tức..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Danh mục</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Thông báo chung">Thông báo chung</SelectItem>
                      <SelectItem value="Tuyển sinh">Tuyển sinh</SelectItem>
                      <SelectItem value="Học bổng">Học bổng</SelectItem>
                      <SelectItem value="Sự kiện">Sự kiện</SelectItem>
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
                      <SelectItem value="Draft">Bản nháp</SelectItem>
                      <SelectItem value="Published">Đã xuất bản</SelectItem>
                      <SelectItem value="Archived">Lưu trữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="publishDate">Ngày xuất bản</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="featuredImage">Ảnh đại diện (URL)</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="tuyển sinh, thông báo, học bổng"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Tóm tắt</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Tóm tắt nội dung tin tức..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Nội dung *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Nội dung chi tiết tin tức..."
                  rows={8}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={formData.isImportant}
                  onChange={(e) => handleInputChange('isImportant', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isImportant">Tin tức quan trọng</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : (editingNews ? 'Cập nhật' : 'Thêm mới')}
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
            placeholder="Tìm kiếm tin tức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* News List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="h-5 w-5 mr-2" />
            Danh sách tin tức ({filteredNews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có tin tức nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày xuất bản</TableHead>
                  <TableHead>Quan trọng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((newsItem) => (
                  <TableRow key={newsItem.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{newsItem.title}</div>
                        {newsItem.summary && (
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {newsItem.summary}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {newsItem.category && (
                        <Badge variant="secondary" className={getCategoryColor(newsItem.category)}>
                          {newsItem.category}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(newsItem.status)}>
                        {newsItem.status === 'Published' ? 'Đã xuất bản' : 
                         newsItem.status === 'Draft' ? 'Bản nháp' : 'Lưu trữ'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formatDate(newsItem.publishDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {newsItem.isImportant && (
                        <Badge variant="destructive" className="text-xs">
                          Quan trọng
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleStatus(newsItem)}
                          title={newsItem.status === 'Published' ? 'Ẩn tin tức' : 'Xuất bản tin tức'}
                        >
                          {newsItem.status === 'Published' ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(newsItem)}
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
                                Bạn có chắc chắn muốn xóa tin tức "{newsItem.title}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(newsItem.id)}
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

export default AdmissionNewsTab 