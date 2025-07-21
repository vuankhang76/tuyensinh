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
import { universityViewService } from '@/services';
import {
  NewsTableSkeleton,
} from '@/components/common/Loading/LoadingSkeleton'
import { Skeleton } from '@/components/ui/skeleton';

const INITIAL_FORM_DATA = {
  title: '',
  content: '',
  publishDate: '',
  year: new Date().getFullYear()
};

const UniversityNewsTab = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await universityViewService.getMyNews();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setNews(sortedData)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách tin tức')
      setNews([])
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.title?.trim()) errors.title = 'Tiêu đề là bắt buộc.';
    if (!formData.content?.trim()) errors.content = 'Nội dung là bắt buộc.';

    if (!formData.year) {
      errors.year = 'Năm là bắt buộc.';
    } else if (isNaN(formData.year) || !Number.isInteger(Number(formData.year))) {
      errors.year = 'Năm phải là một số nguyên.';
    } else if (parseInt(formData.year) < 2015 || parseInt(formData.year) > currentYear + 1) {
      errors.year = `Năm phải nằm trong khoảng từ 2015 đến ${currentYear + 1}.`;
    }

    // Cải thiện validation cho publishDate
    if (formData.publishDate && formData.publishDate.trim() !== '') {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(formData.publishDate)) {
        errors.publishDate = 'Định dạng ngày phải là YYYY-MM-DD (ví dụ: 2024-12-25).';
      } else {
        const dateObj = new Date(formData.publishDate);
        
        if (isNaN(dateObj.getTime())) {
          errors.publishDate = 'Ngày không hợp lệ.';
        } else {
          const yearFromDate = dateObj.getFullYear();
          const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
          const day = dateObj.getDate().toString().padStart(2, '0');
          const reconstructedDate = `${yearFromDate}-${month}-${day}`;
          
          if (reconstructedDate !== formData.publishDate) {
            errors.publishDate = 'Ngày không tồn tại trên lịch.';
          } else {
            if (yearFromDate < 2000 || yearFromDate > currentYear + 1) {
              errors.publishDate = `Năm trong ngày phải từ 2000 đến ${currentYear + 1}.`;
            }
          }
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const resetForm = () => {
    setEditingNews(null)
    setFormData({
      title: '',
      content: '',
      publishDate: '',
      year: new Date().getFullYear()
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Đảm bảo validation được gọi và ngăn submit nếu có lỗi
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }

    setLoading(true)
    try {
      // Cải thiện xử lý publishDate
      let processedPublishDate;
      if (formData.publishDate && formData.publishDate.trim() !== '') {
        const dateObj = new Date(formData.publishDate);
        if (isNaN(dateObj.getTime())) {
          toast.error('Ngày xuất bản không hợp lệ');
          setLoading(false);
          return;
        }
        processedPublishDate = dateObj.toISOString();
      } else {
        processedPublishDate = new Date().toISOString();
      }

      const newsData = {
        title: formData.title,
        content: formData.content,
        publishDate: processedPublishDate,
        year: formData.year ? parseInt(formData.year) : new Date().getFullYear()
      }

      if (editingNews) {
        // Thêm Id vào newsData khi update để khớp với backend requirement
        newsData.Id = editingNews.id;
        await universityViewService.updateMyAdmissionNews(editingNews.id, newsData)
        toast.success('Cập nhật tin tức thành công!');
      } else {
        await universityViewService.createMyAdmissionNews(newsData);
        toast.success('Thêm tin tức thành công!');
      }

      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error details:', error.response?.data); // Debug log
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
          toast.error(editingNews ? 'Lỗi khi cập nhật tin tức' : 'Lỗi khi tạo tin tức');
        }
      } else {
        toast.error(editingNews ? 'Lỗi khi cập nhật tin tức' : 'Lỗi khi tạo tin tức');
      }
    } finally {
      setLoading(false)
    }
  };

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
      await universityViewService.deleteMyAdmissionNews(newsId)
      toast.success('Xóa tin tức thành công!')
      fetchData() // Sửa từ fetchNews() thành fetchData()
    } catch (error) {
      console.error('Delete error:', error.response?.data); // Debug log
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi xóa tin tức');
      }
    } finally {
      setLoading(false)
    }
  }

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
                  <div>
                    <Label htmlFor="year" className="mb-2">Năm *</Label>
                    <Input id="year" type="number" value={formData.year} onChange={(e) => handleInputChange('year', e.target.value)} />
                    {formErrors.year && <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>}
                  </div>
                  <div>
                    <Label htmlFor="publishDate" className="mb-2">Ngày xuất bản (Tùy chọn)</Label>
                    <DatePicker id="publishDate" value={formData.publishDate} onChange={val => handleInputChange('publishDate', val)} />
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
          {loading ? (
            <div className='animate-pulse'>
              <Skeleton className="h-6 w-1/4" />
            </div>
          ) : (
            <CardTitle className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2" />
              Danh sách tin tức ({news.length})
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <NewsTableSkeleton rows={5} />
          ) : news.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Chưa có tin tức nào.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5%]">ID</TableHead>
                  <TableHead className="w-[60%]">Tiêu đề</TableHead>
                  <TableHead className="text-center">Năm</TableHead>
                  <TableHead className="text-center">Ngày xuất bản</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((newsItem) => (
                  <TableRow key={newsItem.id}>
                    <TableCell className="font-medium">{newsItem.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{newsItem.title}</div>
                      <p className="text-sm text-muted-foreground line-clamp-2 truncate w-145" title={newsItem.content}>{newsItem.content}</p>
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

export default UniversityNewsTab; 