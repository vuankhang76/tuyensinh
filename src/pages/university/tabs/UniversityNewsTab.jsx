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
import { Plus, Edit, Trash2, Newspaper, Search, Calendar, Eye } from 'lucide-react';
import { universityViewService } from '@/services';

const INITIAL_FORM_DATA = {
  title: '',
  content: '',
  publishDate: new Date().toISOString().split('T')[0],
  year: new Date().getFullYear().toString(),
};

const UniversityNewsTab = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [viewingNews, setViewingNews] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await universityViewService.getMyNews();
      setNews(data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      toast.error('Có lỗi xảy ra khi tải tin tức');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filtered = [...news];

    if (searchQuery) {
      filtered = filtered.filter(newsItem =>
        newsItem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsItem.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (yearFilter) {
      filtered = filtered.filter(newsItem => newsItem.year?.toString() === yearFilter);
    }

    // Sort by publish date descending
    filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

    setFilteredNews(filtered);
  }, [news, searchQuery, yearFilter]);

  const validateForm = () => {
    const errors = {};

    if (!formData.title?.trim()) {
      errors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.content?.trim()) {
      errors.content = 'Nội dung là bắt buộc';
    }

    if (!formData.publishDate) {
      errors.publishDate = 'Ngày đăng là bắt buộc';
    }

    if (!formData.year?.trim()) {
      errors.year = 'Năm là bắt buộc';
    }

    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.year);
    if (isNaN(year) || year < 2000 || year > currentYear + 5) {
      errors.year = `Năm phải từ 2000 đến ${currentYear + 5}`;
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
        title: formData.title.trim(),
        content: formData.content.trim(),
        publishDate: formData.publishDate,
        year: parseInt(formData.year)
      };

      if (editingNews) {
        await universityViewService.updateMyAdmissionNews(editingNews.id, {
          ...submitData,
          id: editingNews.id
        });
        toast.success('Cập nhật tin tức thành công!');
      } else {
        await universityViewService.createMyAdmissionNews(submitData);
        toast.success('Thêm tin tức thành công!');
      }

      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Lỗi khi lưu tin tức:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi lưu tin tức');
      }
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title || '',
      content: newsItem.content || '',
      publishDate: newsItem.publishDate ? newsItem.publishDate.split('T')[0] : new Date().toISOString().split('T')[0],
      year: newsItem.year?.toString() || new Date().getFullYear().toString(),
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleView = (newsItem) => {
    setViewingNews(newsItem);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await universityViewService.deleteMyAdmissionNews(id);
      toast.success('Xóa tin tức thành công!');
      await fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa tin tức:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi xóa tin tức');
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNews(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setYearFilter('');
  };

  const uniqueYears = [...new Set(news.map(newsItem => newsItem.year))].sort((a, b) => b - a);

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
            <Newspaper className="h-5 w-5" />
            <span>Quản lý tin tức tuyển sinh</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={formErrors.title ? "border-red-500" : ""}
                    placeholder="Nhập tiêu đề tin tức..."
                  />
                  {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="publishDate">Ngày đăng *</Label>
                    <Input
                      id="publishDate"
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => handleInputChange('publishDate', e.target.value)}
                      className={formErrors.publishDate ? "border-red-500" : ""}
                    />
                    {formErrors.publishDate && <p className="text-red-500 text-sm mt-1">{formErrors.publishDate}</p>}
                  </div>
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
                </div>
                
                <div>
                  <Label htmlFor="content">Nội dung *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className={formErrors.content ? "border-red-500" : ""}
                    placeholder="Nhập nội dung tin tức..."
                    rows={8}
                  />
                  {formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Hủy
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingNews ? 'Cập nhật' : 'Thêm'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tin tức..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white min-w-32"
            >
              <option value="">Tất cả năm</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {(yearFilter || searchQuery) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
          <Badge variant="secondary" className="ml-auto">
            Hiển thị: {filteredNews.length} / {news.length}
          </Badge>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Ngày đăng</TableHead>
                <TableHead>Năm</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchQuery || yearFilter ? 'Không tìm thấy tin tức nào' : 'Chưa có tin tức nào'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredNews.map((newsItem) => (
                  <TableRow key={newsItem.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={newsItem.title}>
                        {newsItem.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{formatDate(newsItem.publishDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{newsItem.year}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="text-sm text-gray-600" title={newsItem.content}>
                        {truncateContent(newsItem.content)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(newsItem)}
                        >
                          <Eye className="h-4 w-4" />
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* View News Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Xem chi tiết tin tức</DialogTitle>
            </DialogHeader>
            {viewingNews && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{viewingNews.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Ngày đăng: {formatDate(viewingNews.publishDate)}</span>
                    </div>
                    <Badge variant="outline">Năm {viewingNews.year}</Badge>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700">
                      {viewingNews.content}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setIsViewDialogOpen(false)}>
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UniversityNewsTab; 