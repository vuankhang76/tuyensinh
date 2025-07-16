import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Newspaper, Calendar } from 'lucide-react'
import admissionNewsService from '@/services/admissionNewsService'

const AdmissionNewsTab = ({ universityId }) => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    publishDate: '',
    year: ''
  })

  useEffect(() => {
    if (universityId) {
      fetchNews()
    }
  }, [universityId])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const data = await admissionNewsService.getAdmissionNewsByUniversity(universityId)
      setNews(data)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách tin tức')
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditingNews(null)
    setFormData({
      title: '',
      content: '',
      publishDate: '',
      year: ''
    })
  }

  const handleInputChange = (field, value) => {
        setFormData(prev => {
          if (field === 'publishDate') {
            const year = value ? value.split('-')[0] : '';
            return {
              ...prev,
              publishDate: value,
              year: year
            };
          }
          return {
            ...prev,
            [field]: value
          };
        });
      }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }
    setLoading(true)
    try {
      const newsData = {
        title: formData.title,
        content: formData.content,
        publishDate: formData.publishDate
          ? `${formData.publishDate}T00:00:00.000Z`
          : new Date().toISOString(),
        year: formData.year ? parseInt(formData.year) : new Date().getFullYear(),
        universityId: parseInt(universityId)
      }

      if (editingNews) {
        await admissionNewsService.updateAdmissionNews(editingNews.id, newsData)
        toast.success('Cập nhật tin tức thành công!')
      } else {
        await admissionNewsService.createAdmissionNews(newsData)
        toast.success('Thêm tin tức thành công!')
      }

      setIsDialogOpen(false)
      resetForm()
      fetchNews()
    } catch (error) {
      toast.error(editingNews ? 'Lỗi khi cập nhật tin tức' : 'Lỗi khi tạo tin tức')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Tiêu đề là bắt buộc';
    }
    if (!formData.year || isNaN(formData.year) || parseInt(formData.year) < 1900) {
      errors.year = 'Năm áp dụng phải là số hợp lệ';
    }
    if (!formData.content.trim()) {
      errors.content = 'Nội dung là bắt buộc';
    }
    if (formData.publishDate) {
      const date = new Date(formData.publishDate);
      const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(formData.publishDate);
      if (!isValidFormat || isNaN(date.getTime())) {
        errors.publishDate = 'Ngày xuất bản không hợp lệ (định dạng yyyy-mm-dd)';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem)
    let formattedPublishDate = '';
    if (newsItem.publishDate) {
      const date = new Date(newsItem.publishDate);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        formattedPublishDate = `${year}-${month}-${day}`;
      }
    }

    setFormData({
      title: newsItem.title || '',
      content: newsItem.content || '',
      publishDate: formattedPublishDate,
      year: newsItem.year?.toString() || ''
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

  const filteredNews = news.filter(newsItem =>
    newsItem.title?.toLowerCase()
  )

  const formatDate = (date) => {
    if (!date) return '-'
    try {
      return new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quản lý tin tức tuyển sinh</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các tin tức và thông báo của trường đại học.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} disabled={loading}>
              <Plus className="h-4 w-4 mr-1" />
              Thêm tin tức
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}
              </DialogTitle>
              <DialogDescription>
                {editingNews
                  ? "Cập nhật thông tin tin tức tuyển sinh cho trường."
                  : "Nhập thông tin để thêm tin tức tuyển sinh mới cho trường."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="mb-2">Tiêu đề *</Label>
                  <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="Nhập tiêu đề tin tức..." required />
                  {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                </div>
                <div>
                  <Label htmlFor="content" className="mb-2">Nội dung *</Label>
                  <Textarea id="content" value={formData.content} onChange={(e) => handleInputChange('content', e.target.value)} placeholder="Nhập nội dung chi tiết..." rows={8} required />
                  {formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Label htmlFor="publishDate" className="mb-2">Ngày xuất bản</Label>
                    <DatePicker
                      id="publishDate"
                      value={formData.publishDate}
                      onChange={val => handleInputChange('publishDate', val)}
                      placeholder="Chọn ngày xuất bản"
                    />
                    {formErrors.publishDate && <p className="text-red-500 text-sm mt-1">{formErrors.publishDate}</p>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : (editingNews ? 'Cập nhật' : 'Thêm mới')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="h-5 w-5 mr-2" />
            Danh sách tin tức ({filteredNews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Chưa có tin tức nào.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80%]">Tiêu đề</TableHead>
                  <TableHead className="text-center">Năm</TableHead>
                  <TableHead className="text-center">Ngày xuất bản</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((newsItem) => (
                  <TableRow key={newsItem.id}>
                    <TableCell>
                      <div className="font-medium">{newsItem.title}</div>
                      <p className="text-sm text-muted-foreground line-clamp-2 truncate w-170">{newsItem.content}</p>
                    </TableCell>
                    <TableCell className="text-center">{newsItem.year}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatDate(newsItem.publishDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(newsItem)}>
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
                                Bạn có chắc chắn muốn xóa tin tức "{newsItem.title}"? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(newsItem.id)} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
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