import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Bell
} from 'lucide-react';
import AdmissionNewsModal from './AdmissionNewsModal';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const AdmissionNewsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [universityFilter, setUniversityFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  // Sample data based on schema - in real app, this would come from API
  const [admissionNews, setAdmissionNews] = useState([
    {
      Id: 1,
      Title: 'Thông báo tuyển sinh năm 2024 - Đại học Bách Khoa Hà Nội',
      Content: 'Trường Đại học Bách Khoa Hà Nội thông báo kế hoạch tuyển sinh năm 2024...',
      PublishDate: '2024-01-15T08:00:00',
      Year: 2024,
      UniversityId: 1,
      UniversityName: 'Đại học Bách Khoa Hà Nội',
      Status: 'published'
    },
    {
      Id: 2,
      Title: 'Điểm chuẩn dự kiến các ngành năm 2024',
      Content: 'Dự kiến điểm chuẩn các ngành tuyển sinh năm 2024...',
      PublishDate: '2024-01-20T10:30:00',
      Year: 2024,
      UniversityId: 1,
      UniversityName: 'Đại học Bách Khoa Hà Nội',
      Status: 'draft'
    },
    {
      Id: 3,
      Title: 'Hướng dẫn đăng ký xét tuyển trực tuyến',
      Content: 'Thí sinh tham khảo hướng dẫn đăng ký xét tuyển trực tuyến...',
      PublishDate: '2024-01-18T14:00:00',
      Year: 2024,
      UniversityId: 2,
      UniversityName: 'Đại học Quốc gia Hà Nội',
      Status: 'published'
    },
    {
      Id: 4,
      Title: 'Thông tin học bổng cho sinh viên năm nhất',
      Content: 'Các chương trình học bổng dành cho sinh viên năm nhất...',
      PublishDate: '2024-01-25T09:15:00',
      Year: 2024,
      UniversityId: 3,
      UniversityName: 'Đại học FPT',
      Status: 'published'
    }
  ]);

  // Mock universities for filter
  const universities = [
    { Id: 1, Name: 'Đại học Bách Khoa Hà Nội' },
    { Id: 2, Name: 'Đại học Quốc gia Hà Nội' },
    { Id: 3, Name: 'Đại học FPT' }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      published: 'secondary',
      draft: 'outline',
      archived: 'destructive'
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      published: 'Đã xuất bản',
      draft: 'Bản nháp',
      archived: 'Lưu trữ'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const handleView = (record) => {
    toast({
      title: "Thông tin",
      description: "Chức năng xem chi tiết tin tức",
    });
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (news) => {
    setNewsToDelete(news);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (newsToDelete) {
      setAdmissionNews(admissionNews.filter(n => n.Id !== newsToDelete.Id));
      toast({
        title: "Thành công",
        description: "Đã xóa tin tức thành công",
      });
    }
    setDeleteDialogOpen(false);
    setNewsToDelete(null);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    if (editingRecord) {
      // Update existing news
      setAdmissionNews(admissionNews.map(n => 
        n.Id === editingRecord.Id ? { 
          ...n, 
          ...values,
          UniversityName: universities.find(u => u.Id === values.UniversityId)?.Name || '',
          PublishDate: values.PublishDate?.toISOString() || values.PublishDate
        } : n
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật tin tức thành công",
      });
    } else {
      // Add new news
      const newNews = { 
        ...values, 
        Id: Date.now(),
        UniversityName: universities.find(u => u.Id === values.UniversityId)?.Name || '',
        PublishDate: values.PublishDate?.toISOString() || new Date().toISOString(),
        Status: values.Status || 'draft'
      };
      setAdmissionNews([...admissionNews, newNews]);
      toast({
        title: "Thành công",
        description: "Đã thêm tin tức mới",
      });
    }
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  // Filter news
  let filteredNews = admissionNews;
  if (universityFilter !== 'all') {
    filteredNews = filteredNews.filter(n => n.UniversityId === parseInt(universityFilter));
  }
  if (yearFilter !== 'all') {
    filteredNews = filteredNews.filter(n => n.Year === parseInt(yearFilter));
  }

  // Sort by publish date (newest first)
  const sortedNews = [...filteredNews].sort((a, b) => 
    new Date(b.PublishDate) - new Date(a.PublishDate)
  );

  // Statistics
  const stats = {
    total: admissionNews.length,
    published: admissionNews.filter(n => n.Status === 'published').length,
    draft: admissionNews.filter(n => n.Status === 'draft').length,
    thisMonth: admissionNews.filter(n => {
      const newsDate = new Date(n.PublishDate);
      const now = new Date();
      return newsDate.getMonth() === now.getMonth() && 
             newsDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Tin tức Tuyển sinh</h2>
          <div className="flex space-x-4 mt-2 text-sm text-gray-600">
            <span>Tổng: {stats.total}</span>
            <span>Đã xuất bản: {stats.published}</span>
            <span>Bản nháp: {stats.draft}</span>
            <span>Tháng này: {stats.thisMonth}</span>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm tin tức mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <Select value={universityFilter} onValueChange={setUniversityFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo trường" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trường</SelectItem>
            {universities.map(uni => (
              <SelectItem key={uni.Id} value={uni.Id.toString()}>
                {uni.Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Lọc theo năm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả năm</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-gray-600">Tổng tin tức</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <div className="text-gray-600">Đã xuất bản</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
            <div className="text-gray-600">Bản nháp</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.thisMonth}</div>
            <div className="text-gray-600">Tháng này</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-80">Tiêu đề</TableHead>
              <TableHead className="w-48">Trường</TableHead>
              <TableHead className="w-36">Ngày xuất bản</TableHead>
              <TableHead className="w-20">Năm</TableHead>
              <TableHead className="w-32">Trạng thái</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead className="w-36">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedNews.map((news) => (
              <TableRow key={news.Id}>
                <TableCell className="font-medium">
                  <div className="max-w-xs truncate" title={news.Title}>
                    {news.Title}
                  </div>
                </TableCell>
                <TableCell className="text-blue-600">{news.UniversityName}</TableCell>
                <TableCell>{formatDate(news.PublishDate)}</TableCell>
                <TableCell>{news.Year}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(news.Status)}>
                    {getStatusLabel(news.Status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-md text-gray-600 truncate" title={news.Content}>
                    {news.Content.length > 50 ? `${news.Content.substring(0, 50)}...` : news.Content}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(news)}
                      title="Xem"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(news)}
                      title="Sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(news)}
                      className="text-red-600 hover:text-red-700"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị 1-{filteredNews.length} của {filteredNews.length} tin tức
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tin tức</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tin tức "{newsToDelete?.Title}"? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdmissionNewsModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        editingRecord={editingRecord}
        universities={universities}
      />
    </div>
  );
};

export default AdmissionNewsManagement; 