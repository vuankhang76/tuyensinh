import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';
import {
  Plus,
  Building2,
  Trash2,
  RefreshCw,
  Search,
} from 'lucide-react';
import universityService from '../../../services/universityService';
import { useDebounce } from '@/hooks/useDebounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

const UniversityManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [allUniversities, setAllUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [paginatedUniversities, setPaginatedUniversities] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchLoading, setSearchLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await universityService.getAllUniversities();
      setAllUniversities(data);
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
      setError('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setSearchLoading(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
    setSearchLoading(true);
    let filtered = allUniversities;
    if (debouncedSearchTerm) {
      filtered = filtered.filter(uni =>
        uni.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        uni.shortName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    if (typeFilter !== 'all') {
      filtered = filtered.filter(uni => uni.type === typeFilter);
    }
    const sorted = [...filtered].sort((a, b) => a.id - b.id);
    setFilteredUniversities(sorted);
    setCurrentPage(1);
    setSearchLoading(false);
  }, [allUniversities, debouncedSearchTerm, typeFilter]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set('q', debouncedSearchTerm);
    if (typeFilter !== 'all') params.set('type', typeFilter);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, typeFilter, currentPage, setSearchParams]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const newUniversity = await universityService.createUniversity({
        name: values.Name,
        shortName: values.ShortName,
        introduction: values.Introduction,
        officialWebsite: values.OfficialWebsite,
        admissionWebsite: values.AdmissionWebsite,
        ranking: values.Ranking,
        rankingCriteria: values.RankingCriteria,
        locations: values.Locations,
        type: values.Type
      });

      const updatedData = [...allUniversities, newUniversity];
      setAllUniversities(updatedData);
      setTotalResults(updatedData.length);
      toast.success("Đã thêm trường đại học mới");

      setIsModalVisible(false);
      setEditingRecord(null);
    } catch (error) {
      toast.error(editingRecord ? "Có lỗi xảy ra khi cập nhật" : "Có lỗi xảy ra khi thêm trường đại học");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
      try {
        setSubmitting(true);
        await universityService.deleteUniversity(id);
        const updatedData = allUniversities.filter(u => u.id !== id);
        setAllUniversities(updatedData);
        toast.success("Đã xóa trường đại học");
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa trường đại học");
      } finally {
        setSubmitting(false);
      }
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setCurrentPage(1);
    fetchUniversities();
  };

  const handleAdd = () => {
    navigate('/admin/universities/create');
  };

  const totalResults = filteredUniversities.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    setPaginatedUniversities(filteredUniversities.slice(startIndex, startIndex + pageSize));
  }, [filteredUniversities, currentPage, pageSize]);

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
            onClick={handleRefresh}
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

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          {searchLoading && (
            <RefreshCw className="absolute right-3 top-3 h-4 w-4 text-gray-400 animate-spin" />
          )}
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã trường..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 ${searchLoading ? 'pr-10' : ''}`}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo loại hình" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại hình</SelectItem>
            <SelectItem value="Công lập">Công lập</SelectItem>
            <SelectItem value="Tư thục">Tư thục</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] font-bold pl-4">ID</TableHead>
              <TableHead className="font-bold">Tên trường</TableHead>
              <TableHead className="w-[120px] font-bold">Mã trường</TableHead>
              <TableHead className="w-[300px] font-bold">Địa chỉ</TableHead>
              <TableHead className="w-[120px] font-bold">Loại hình</TableHead>
              <TableHead className="w-[100px] font-bold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading || searchLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><div className="animate-pulse h-4 w-8 bg-slate-300 dark:bg-slate-600 rounded"></div></TableCell>
                  <TableCell><div className="flex items-center space-x-3"><div className="animate-pulse h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div><div><div className="animate-pulse h-4 w-32 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div><div className="animate-pulse h-3 w-24 bg-slate-300 dark:bg-slate-600 rounded"></div></div></div></TableCell>
                  <TableCell><div className="animate-pulse h-4 w-16 bg-slate-300 dark:bg-slate-600 rounded"></div></TableCell>
                  <TableCell><div className="animate-pulse h-4 w-20 bg-slate-300 dark:bg-slate-600 rounded"></div></TableCell>
                  <TableCell><div className="animate-pulse h-4 w-16 bg-slate-300 dark:bg-slate-600 rounded"></div></TableCell>
                  <TableCell><div className="flex items-center space-x-2"><div className="animate-pulse h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded"></div><div className="animate-pulse h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded"></div></div></TableCell>
                </TableRow>
              ))
            ) : paginatedUniversities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-gray-500">
                    {debouncedSearchTerm || typeFilter !== 'all' ? 'Không tìm thấy trường đại học nào' : 'Chưa có trường đại học nào'}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUniversities.map((university) => (
                <TableRow
                  key={university.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium max-w-15 pl-4">
                    <div className="truncate" title={university.id}>
                      {university.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3 cursor-pointer"
                         onClick={() => navigate(`/admin/universities/${university.id}`)}
                    >
                      <div className="h-10 w-10 flex-shrink-0 rounded-md flex items-center justify-center border-none">
                        {university.logo ? (
                          <img
                            src={university.logo}
                            alt={`Logo ${university.name}`}
                            className="h-full w-full object-contain mix-blend-multiply"
                            loading="lazy"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="w-full">
                        <div className="w-[300px] font-medium truncate" title={university.name}>
                          {university.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{university.shortName}</Badge>
                  </TableCell>
                  <TableCell className="max-w-40 truncate" title={university.locations}>
                    {university.locations}
                  </TableCell>
                  <TableCell title={university.type}>
                    <span>{university.type}</span>
                  </TableCell>
                  <TableCell className="flex justify-center w-17">
                    <AlertDialog open={!!deleteId && deleteId === university.id} onOpenChange={open => { if (!open) setDeleteId(null); }}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer hover:bg-red-100 transition-colors text-red-600 "
                          onClick={e => {
                            e.stopPropagation();
                            setDeleteId(university.id);
                          }}
                          title="Xóa"
                          disabled={submitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>Bạn có chắc chắn muốn xóa trường đại học này? Hành động này không thể hoàn tác.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteId(null)}>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              await handleDelete(deleteId);
                              setDeleteId(null);
                            }}
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalResults > 0 && (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-600">
              Hiển thị {startResult}-{endResult} của {totalResults} kết quả
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hiển thị:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">mục/trang</span>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversityManagement;