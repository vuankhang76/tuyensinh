import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Plus,
  Edit,
  Building2,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import UniversityModal from './UniversityModal';
import universityService from '../../../services/universityService';
import LoadingSkeleton from '../../../components/common/Loading/LoadingSkeleton';

const UniversityManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState(null);

  // Fetch universities from API
  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await universityService.getAllUniversities();
      setUniversities(data);
    } catch (err) {
      console.error('Error fetching universities:', err);
      setError('Không thể tải danh sách trường đại học');
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    navigate(`/admin/universities/${record.id}`);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trường đại học này?')) {
      try {
        setSubmitting(true);
        await universityService.deleteUniversity(id);
        setUniversities(universities.filter(u => u.id !== id));
        toast.success("Đã xóa trường đại học");
      } catch (error) {
        console.error('Error deleting university:', error);
        toast.error("Có lỗi xảy ra khi xóa trường đại học");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      if (editingRecord) {
        // Update existing university
        const updatedUniversity = await universityService.updateUniversity(editingRecord.id, {
          name: values.name,
          shortName: values.shortName || values.code,
          introduction: values.description || values.introduction,
          officialWebsite: values.website,
          admissionWebsite: values.admissionWebsite || values.website,
          ranking: values.ranking || null,
          rankingCriteria: values.rankingCriteria || 'Không có',
          locations: values.address || values.locations,
          type: values.type
        });
        
        // Update local state
        setUniversities(universities.map(u => 
          u.id === editingRecord.id ? updatedUniversity : u
        ));
        toast.success("Đã cập nhật thông tin trường đại học");
      } else {
        // Add new university
        const newUniversity = await universityService.createUniversity({
          name: values.name,
          shortName: values.shortName || values.code,
          introduction: values.description || values.introduction || '',
          officialWebsite: values.website,
          admissionWebsite: values.admissionWebsite || values.website,
          ranking: values.ranking || null,
          rankingCriteria: values.rankingCriteria || 'Không có',
          locations: values.address || values.locations || '',
          type: values.type
        });
        
        setUniversities([...universities, newUniversity]);
        toast.success("Đã thêm trường đại học mới");
      }
      
      setIsModalVisible(false);
      setEditingRecord(null);
    } catch (error) {
      console.error('Error saving university:', error);
      toast.error(editingRecord ? "Có lỗi xảy ra khi cập nhật" : "Có lỗi xảy ra khi thêm trường đại học");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Trường Đại học</h2>
          {error && (
            <p className="text-red-600 text-sm mt-1">{error}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchUniversities}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm trường mới
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 font-bold">Id</TableHead>
              <TableHead className="w-50 font-bold">Tên trường</TableHead>
              <TableHead className="w-24 font-bold">Mã trường</TableHead>
              <TableHead className="w-24 font-bold">Địa chỉ</TableHead>
              <TableHead className="w-24 font-bold">Loại hình</TableHead>
              <TableHead className="w-20 font-bold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><LoadingSkeleton className="h-4 w-8" /></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <LoadingSkeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <LoadingSkeleton className="h-4 w-32 mb-1" />
                        <LoadingSkeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><LoadingSkeleton className="h-4 w-16" /></TableCell>
                  <TableCell><LoadingSkeleton className="h-4 w-20" /></TableCell>
                  <TableCell><LoadingSkeleton className="h-4 w-16" /></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <LoadingSkeleton className="h-8 w-8" />
                      <LoadingSkeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : universities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-gray-500">
                    {error ? 'Có lỗi xảy ra khi tải dữ liệu' : 'Chưa có trường đại học nào'}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              universities.map((university) => (
                <TableRow 
                  key={university.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>{university.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={university.logo} alt={university.name} />
                        <AvatarFallback>
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{university.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {university.introduction || university.description || 'Chưa có mô tả'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{university.shortName || university.code}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {university.locations || university.address || 'Chưa cập nhật'}
                  </TableCell>
                  <TableCell>
                    <span>{university.type}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(university);
                        }}
                        title="Chỉnh sửa"
                        disabled={submitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer hover:bg-red-100 transition-colors text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(university.id);
                        }}
                        title="Xóa"
                        disabled={submitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {loading ? 'Đang tải...' : `Hiển thị 1-${universities.length} của ${universities.length} trường`}
        </div>
      </div>

      <UniversityModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        editingRecord={editingRecord}
        loading={submitting}
      />
    </div>
  );
};

export default UniversityManagement; 