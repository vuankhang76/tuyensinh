import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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


const UniversityManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await universityService.getAllUniversities();
      setAllUniversities(data);
      setTotalResults(data.length);
      setCurrentPage(1);
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
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
        const updatedData = allUniversities.filter(u => u.id !== id);
        setAllUniversities(updatedData);
        setTotalResults(updatedData.length);
        setCurrentPage(1);
        toast.success("Đã xóa trường đại học");
      } catch (error) {
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
        const updatedUniversity = await universityService.updateUniversity(editingRecord.id, {
          name: values.name,
          shortName: values.shortName,
          introduction: values.introduction,
          officialWebsite: values.website,
          admissionWebsite: values.admissionWebsite,
          ranking: values.ranking,
          rankingCriteria: values.rankingCriteria,
          locations: values.locations,
          type: values.type
        });
        const updatedData = allUniversities.map(u =>
          u.id === editingRecord.id ? updatedUniversity : u
        );
        setAllUniversities(updatedData);
        toast.success("Đã cập nhật thông tin trường đại học");
      } else {

        const newUniversity = await universityService.createUniversity({
          name: values.name,
          shortName: values.code,
          introduction: values.introduction,
          officialWebsite: values.website,
          admissionWebsite: values.admissionWebsite,
          ranking: values.ranking,
          rankingCriteria: values.rankingCriteria,
          locations: values.locations,
          type: values.type
        });

        const updatedData = [...allUniversities, newUniversity];
        setAllUniversities(updatedData);
        setTotalResults(updatedData.length);
        toast.success("Đã thêm trường đại học mới");
      }

      setIsModalVisible(false);
      setEditingRecord(null);
    } catch (error) {
      toast.error(editingRecord ? "Có lỗi xảy ra khi cập nhật" : "Có lỗi xảy ra khi thêm trường đại học");
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.ceil(totalResults / pageSize)
  const startResult = (currentPage - 1) * pageSize + 1
  const endResult = Math.min(currentPage * pageSize, totalResults)  
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize
    setUniversities(allUniversities.slice(startIndex, startIndex + pageSize))
  }, [allUniversities, currentPage, pageSize])

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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 font-bold">Id</TableHead>
              <TableHead className="w-60 font-bold">Tên trường</TableHead>
              <TableHead className="w-24 font-bold">Mã trường</TableHead>
              <TableHead className="w-40 font-bold">Địa chỉ</TableHead>
              <TableHead className="w-24 font-bold">Loại hình</TableHead>
              <TableHead className="w-20 font-bold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="animate-pulse h-4 w-8 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="animate-pulse h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                      <div>
                        <div className="animate-pulse h-4 w-32 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                        <div className="animate-pulse h-3 w-24 bg-slate-300 dark:bg-slate-600 rounded"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse h-4 w-16 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse h-4 w-20 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse h-4 w-16 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded"></div>
                      <div className="animate-pulse h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded"></div>
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
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/universities/${university.id}`)}
                >
                  <TableCell>{university.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
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
                      <div>
                        <div className="font-medium">{university.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{university.shortName}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {university.locations}
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
        {totalResults > 0 && (
        <div className="flex flex-col items-center gap-4">
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