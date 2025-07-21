import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { universityViewService } from '@/services';
import { TableSkeleton } from '@/components/common/Loading/LoadingSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

const INITIAL_FORM_DATA = {
  name: '',
  code: '',
  description: '',
  scoreId: null,
  score: '',
  year: new Date().getFullYear().toString(),
  subjectCombination: '',
};

const UniversityMajorsTab = () => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({})

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [majorsData, programsData] = await Promise.all([
        universityViewService.getMyMajors(),
        universityViewService.getMyAdmissionScores()
      ]);

      const combinedData = majorsData.map(major => {
        const scoreInfo = programsData.find(score => score.majorId === major.id);
        return {
          ...major,
          scoreId: scoreInfo?.id || null,  
          score: scoreInfo?.score || null,
          year: scoreInfo?.year || null,
          subjectCombination: scoreInfo?.subjectCombination || null,
        };
      });
      const sortedData = combinedData.sort((a, b) => a.id - b.id);
      setMajors(sortedData);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Tên ngành học là bắt buộc.';
    }

    if (!formData.code?.trim()) {
      errors.code = 'Mã ngành học là bắt buộc.';
    } else if (/\s/.test(formData.code)) {
      errors.code = 'Mã ngành không được chứa khoảng trắng.';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Mô tả ngành học là bắt buộc.';
    } else if (formData.description.length > 2000) {
      errors.description = 'Mô tả không được vượt quá 2000 ký tự.';
    }

    if (formData.score && formData.score.toString().trim() !== '') {
      if (isNaN(formData.score)) {
        errors.score = 'Điểm chuẩn phải là một số.';
      } else if (parseFloat(formData.score) < 0 || parseFloat(formData.score) > 30) {
        errors.score = 'Điểm chuẩn phải nằm trong khoảng từ 0 đến 30.';
      }
    }

    if (formData.year && formData.year.toString().trim() !== '') {
      const currentYear = new Date().getFullYear();
      if (isNaN(formData.year) || !Number.isInteger(Number(formData.year))) {
        errors.year = 'Năm phải là một số nguyên.';
      } else if (parseInt(formData.year) < 2010 || parseInt(formData.year) > currentYear + 3) {
        errors.year = `Năm phải nằm trong khoảng từ 2010 đến ${currentYear + 3}.`;
      }
    }

    if (formData.subjectCombination?.trim()) {
      const pattern = /^[A-Z0-9]{3}(\s*,\s*[A-Z0-9]{3})*$/i;
      if (!pattern.test(formData.subjectCombination.trim())) {
        errors.subjectCombination = 'Định dạng không hợp lệ. Ví dụ đúng: A00, D01, B00';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenNewDialog = () => {
    setEditingMajor(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleEdit = (major) => {
    setEditingMajor(major);
    setFormData({
      name: major.name || '',
      code: major.code || '',
      description: major.description || '',
      scoreId: major.scoreId || null,
      score: major.score || '',
      year: major.year?.toString() || new Date().getFullYear().toString(),
      subjectCombination: major.subjectCombination || '',
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }

    setSubmitting(true);
    try {
      if (editingMajor) {
        const majorPayload = {
          Id: editingMajor.id,
          Name: formData.name.trim(),
          Code: formData.code.trim().toUpperCase(),
          Description: formData.description.trim(),
        };

        await universityViewService.updateMyMajor(editingMajor.id, majorPayload);
        
        const hasScoreInfo = formData.score || formData.subjectCombination;
        if (hasScoreInfo) {
          const scorePayload = {
            MajorId: editingMajor.id,
            Year: parseInt(formData.year) || new Date().getFullYear(),
            Score: parseFloat(formData.score) || 0,
            SubjectCombination: formData.subjectCombination?.trim() || ""
          };

          if (formData.scoreId) {
            const updateScorePayload = {
              ...scorePayload,
              Id: formData.scoreId
            };
            await universityViewService.updateMyAdmissionScore(formData.scoreId, updateScorePayload);
          } else {
            await universityViewService.createMyAdmissionScore(scorePayload);
          }
        }
        toast.success('Cập nhật ngành học thành công!');

      } else {
        const majorPayload = {
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          description: formData.description.trim(),
        };
        const newMajor = await universityViewService.createMyMajor(majorPayload);
        if (formData.score && parseFloat(formData.score) > 0) {
          const currentYear = new Date().getFullYear();
          const targetYear = parseInt(formData.year) || (currentYear - 1);
          const scorePayload = {
            MajorId: newMajor.id,
            Year: targetYear,
            Score: parseFloat(formData.score)
          };

          if (formData.subjectCombination && formData.subjectCombination.trim()) {
            scorePayload.SubjectCombination = formData.subjectCombination.trim();
          }
          
          try {
            await universityViewService.createMyAdmissionScore(scorePayload);
          } catch (error) {            
            try {
              const methods = await universityViewService.getMyAdmissionMethods();
              if (methods && methods.length > 0) {
                const methodPayload = {
                  ...scorePayload,
                  admissionMethodId: methods[0].id
                };
                await universityViewService.createMyAdmissionScore(methodPayload);
              } else {
                throw new Error('No admission methods available');
              }
            } catch (retryError) {              
              try {
                const minimalPayload = {
                  majorId: newMajor.id,
                  year: 2023,
                  score: parseFloat(formData.score)
                };
                await universityViewService.createMyAdmissionScore(minimalPayload);
              } catch (finalError) {
                if (error.response?.data?.message) {
                  toast.warning(`Ngành học đã tạo thành công! Lưu ý: ${error.response.data.message}`);
                }
              }
            }
          }
        }

        toast.success('Thêm ngành học thành công!');
      }
      
      await fetchData();
      handleCloseDialog();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          toast.error('Bạn cần đăng nhập để thực hiện thao tác này');
        } else if (status === 403) {
          toast.error('Chỉ trường đại học mới có quyền thêm ngành học');
        } else if (status === 400) {
          if (data.errors) {
            Object.entries(data.errors).forEach(([field, messages]) => {
              messages.forEach(msg => toast.error(`${field}: ${msg}`));
            });
          } else {
            toast.error(data.message || data.title || 'Dữ liệu không hợp lệ');
          }
        } else if (status === 500) {
          toast.error(`Lỗi server: ${data.error || data.message || 'Không xác định'}`);
        } else {
          toast.error(data.message || data.title || 'Có lỗi xảy ra khi lưu thông tin');
        }
      } else {
        toast.error(`Lỗi kết nối: ${error.message || 'Không xác định'}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await universityViewService.deleteMyMajor(id);
      toast.success('Xóa ngành học thành công!');
      await fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa ngành học:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('Bạn cần đăng nhập để thực hiện thao tác này');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền thực hiện thao tác này');
      } else {
        toast.error('Có lỗi xảy ra khi xóa ngành học');
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMajor(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quản lý ngành học</h3>
          <p className="text-sm text-muted-foreground">Thêm, sửa, xóa các ngành học và điểm chuẩn của trường.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNewDialog} disabled={loading || submitting}>
              <Plus className="h-4 w-4 mr-2" />Thêm ngành học
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMajor ? 'Chỉnh sửa ngành học' : 'Thêm ngành học mới'}</DialogTitle>
              <DialogDescription>
                {editingMajor ? 'Cập nhật thông tin ngành học và điểm chuẩn' : 'Thêm ngành học mới và thông tin điểm chuẩn tương ứng'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="mb-2">
                    Tên ngành học <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                    placeholder="VD: Công nghệ Thông tin"
                    required 
                    disabled={submitting}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="code" className="mb-2">
                    Mã ngành <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="code" 
                    value={formData.code} 
                    onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())} 
                    placeholder="VD: CNTT, KTPM"
                    required 
                    disabled={submitting}
                  />
                  {formErrors.code && <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="mb-2">
                  Mô tả ngành học <span className="text-red-500">*</span>
                </Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => handleInputChange('description', e.target.value)} 
                  placeholder="VD: Ngành đào tạo cử nhân công nghệ thông tin với kiến thức về lập trình, cơ sở dữ liệu, mạng máy tính..."
                  rows={3}
                  required
                  disabled={submitting}
                />
                {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Thông tin điểm chuẩn (không bắt buộc)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="score" className="mb-2">Điểm chuẩn</Label>
                    <Input 
                      id="score" 
                      type="number" 
                      step="0.01" 
                      value={formData.score} 
                      onChange={(e) => handleInputChange('score', e.target.value)} 
                      placeholder="VD: 25.5" 
                      disabled={submitting}
                    />
                    {formErrors.score && <p className="text-red-500 text-sm mt-1">{formErrors.score}</p>}
                  </div>
                  <div>
                    <Label htmlFor="year" className="mb-2">Năm áp dụng</Label>
                    <Input 
                      id="year" 
                      type="number" 
                      value={formData.year} 
                      onChange={(e) => handleInputChange('year', e.target.value)} 
                      placeholder="VD: 2025" 
                      disabled={submitting}
                    />
                    {formErrors.year && <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="subjectCombination" className="mb-2">
                      Tổ hợp môn (cách nhau bởi dấu phẩy)
                    </Label>
                    <Input 
                      id="subjectCombination" 
                      value={formData.subjectCombination} 
                      onChange={(e) => handleInputChange('subjectCombination', e.target.value)} 
                      placeholder="VD: A00, A01, D07" 
                      disabled={submitting}
                    />
                    {formErrors.subjectCombination && <p className="text-red-500 text-sm mt-1">{formErrors.subjectCombination}</p>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
                  Hủy
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Đang lưu...' : (editingMajor ? 'Cập nhật' : 'Thêm mới')}
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
              <BookOpen className="h-5 w-5 mr-2" />Danh sách ngành học ({majors.length})
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton 
            columns={[
              { width: "25%" },
              { width: "15%" },
              { width: "15%" },
              { width: "15%" },
              { width: "20%" },
              { width: "10%" },
            ]}
            rows={5}
          />
          ) : majors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Chưa có ngành học nào.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5%]">ID</TableHead>
                  <TableHead>Tên ngành</TableHead>
                  <TableHead className="text-center">Mã ngành</TableHead>
                  <TableHead className="text-center">Điểm chuẩn</TableHead>
                  <TableHead>Năm</TableHead>
                  <TableHead>Tổ hợp môn</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {majors.map((major) => (
                  <TableRow key={major.id} className={deleting === major.id ? "opacity-50" : ""}>
                    <TableCell className="font-medium">{major.id}</TableCell>
                    <TableCell className="font-medium">{major.name}</TableCell>
                    <TableCell className="text-center"><Badge variant="outline">{major.code}</Badge></TableCell>
                    <TableCell className="font-semibold text-blue-600 text-center">{major.score || 'N/A'}</TableCell>
                    <TableCell>{major.year || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {major.subjectCombination && major.subjectCombination.split(',').map((combo, i) => (
                          <Badge key={i} variant="secondary">{combo.trim()}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(major)}
                          disabled={submitting || deleting === major.id}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              disabled={submitting || deleting === major.id}
                            >
                              {deleting === major.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa ngành <strong>"{major.name}"</strong>? Hành động này sẽ xóa cả các điểm chuẩn liên quan và không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={deleting === major.id}>Hủy</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(major.id)} 
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleting === major.id}
                              >
                                {deleting === major.id ? 'Đang xóa...' : 'Xóa'}
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
  );
};

export default UniversityMajorsTab; 