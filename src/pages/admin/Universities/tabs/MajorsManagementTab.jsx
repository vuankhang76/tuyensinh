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
import { majorService, admissionScoreService } from '@/services';
import { TableSkeleton } from '@/components/common/Loading/LoadingSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

const INITIAL_FORM_DATA = {
  name: '',
  code: '',
  description: '',
  scoreId: null,
  year: new Date().getFullYear().toString(),
  subjectCombination: '',
};

const MajorsManagementTab = ({ universityId }) => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({})

  const fetchAndCombineData = useCallback(async () => {
    if (!universityId) return;
    setLoading(true);
    try {
      const [majorsData, scoresData] = await Promise.all([
        majorService.getMajorsByUniversity(universityId),
        admissionScoreService.getScoresByUniversity(universityId)
      ]);

      const scoresMap = new Map(scoresData.map(score => [score.majorId, score]));

      const combinedData = majorsData.map(major => {
        const scoreInfo = scoresMap.get(major.id) || {};
        return {
          ...major,
          scoreId: scoreInfo.id,
          score: scoreInfo.score,
          year: scoreInfo.year,
          subjectCombination: scoreInfo.subjectCombination,
        };
      });
      setMajors(combinedData);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu ngành học');
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    fetchAndCombineData();
  }, [fetchAndCombineData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenNewDialog = () => {
    setEditingMajor(null);
    setFormData(INITIAL_FORM_DATA);
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
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }

    setLoading(true);
    try {
      const majorPayload = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        universityId: parseInt(universityId),
      };

      if (editingMajor) {
        await majorService.updateMajor(editingMajor.id, majorPayload);

        const hasScoreInfo = formData.score || formData.subjectCombination;
        if (hasScoreInfo) {
          const scorePayload = {
            score: parseFloat(formData.score) || 0,
            year: parseInt(formData.year),
            subjectCombination: formData.subjectCombination,
            majorId: editingMajor.id,
          };

          if (formData.scoreId) {
            await admissionScoreService.updateAdmissionScore(formData.scoreId, scorePayload);
          } else {
            await admissionScoreService.createAdmissionScore(scorePayload);
          }
        }
        toast.success('Cập nhật ngành học thành công!');

      } else {
        const newMajor = await majorService.createMajor(majorPayload);

        if (formData.score || formData.subjectCombination) {
          const scorePayload = {
            score: parseFloat(formData.score) || 0,
            year: parseInt(formData.year),
            subjectCombination: formData.subjectCombination,
            majorId: newMajor.id,
          };
          await admissionScoreService.createAdmissionScore(scorePayload);
        }
        toast.success('Thêm ngành học thành công!');
      }
      setIsDialogOpen(false);
      fetchAndCombineData();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.errors) {
          const messages = Object.values(data.errors).flat();
          messages.forEach(msg => toast.error(msg));
        } else if (data.title) {
          toast.error(data.title);
        } else {
          toast.error('Có lỗi xảy ra khi lưu thông tin');
        }
      } else {
        toast.error(`Lỗi: ${error.message || 'Không xác định'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (majorId) => {
    setLoading(true);
    try {
      await majorService.deleteMajor(majorId);
      toast.success('Xóa ngành học thành công!');
      fetchAndCombineData();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa ngành học');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.name?.trim()) {
        errors.name = 'Tên ngành học là bắt buộc.';
    }

    if (!formData.code?.trim()) {
        errors.code = 'Mã ngành học là bắt buộc.';
    } else if (/\s/.test(formData.code)) {
        errors.code = 'Mã ngành không được chứa khoảng trắng.';
    }

    if (!formData.year) {
        errors.year = 'Năm áp dụng là bắt buộc.';
    } else if (isNaN(formData.year) || !Number.isInteger(Number(formData.year))) {
        errors.year = 'Năm phải là một số nguyên.';
    } else if (parseInt(formData.year) < 2010 || parseInt(formData.year) > currentYear + 3) {
        errors.year = `Năm phải nằm trong khoảng từ 2010 đến ${currentYear + 3}.`;
    }

    if (formData.score) {
        if (isNaN(formData.score)) {
            errors.score = 'Điểm chuẩn phải là một số.';
        } else if (parseFloat(formData.score) < 0 || parseFloat(formData.score) > 30) {
            errors.score = 'Điểm chuẩn phải nằm trong khoảng từ 0 đến 30.';
        }
    }
    
    if (!formData.subjectCombination?.trim()) {
        errors.subjectCombination = 'Tổ hợp môn là bắt buộc.';
    } else {
        const pattern = /^[A-Z0-9]{3}(\s*,\s*[A-Z0-9]{3})*$/i;
        if (!pattern.test(formData.subjectCombination.trim())) {
            errors.subjectCombination = 'Định dạng không hợp lệ. Ví dụ đúng: A00, D01, B00';
        }
    }
    
    if (formData.description?.length > 2000) {
        errors.description = 'Mô tả không được vượt quá 2000 ký tự.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
            <Button onClick={handleOpenNewDialog} disabled={loading}><Plus className="h-4 w-4 mr-2" />Thêm ngành học</Button>
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
                  <Label htmlFor="name" className="mb-2">Tên ngành học *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="code" className="mb-2">Mã ngành *</Label>
                  <Input id="code" value={formData.code} onChange={(e) => handleInputChange('code', e.target.value)} required />
                  {formErrors.code && <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="mb-2">Mô tả ngành học</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={3} />
                {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="score" className="mb-2">Điểm chuẩn</Label>
                  <Input id="score" type="number" step="0.01" value={formData.score} onChange={(e) => handleInputChange('score', e.target.value)} placeholder="25.5" />
                  {formErrors.score && <p className="text-red-500 text-sm mt-1">{formErrors.score}</p>}
                </div>
                <div>
                  <Label htmlFor="year" className="mb-2">Năm</Label>
                  <Input id="year" type="number" value={formData.year} onChange={(e) => handleInputChange('year', e.target.value)} placeholder="2025" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="subjectCombination" className="mb-2">Tổ hợp môn (cách nhau bởi dấu phẩy)</Label>
                  <Input id="subjectCombination" value={formData.subjectCombination} onChange={(e) => handleInputChange('subjectCombination', e.target.value)} placeholder="A00, A01, D07" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : (editingMajor ? 'Cập nhật' : 'Thêm mới')}</Button>
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
                  <TableHead>Tên ngành</TableHead>
                  <TableHead>Mã ngành</TableHead>
                  <TableHead className="text-center">Điểm chuẩn</TableHead>
                  <TableHead>Năm</TableHead>
                  <TableHead>Tổ hợp môn</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {majors.map((major) => (
                  <TableRow key={major.id}>
                    <TableCell className="font-medium">{major.name}</TableCell>
                    <TableCell><Badge variant="outline">{major.code}</Badge></TableCell>
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
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(major)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa ngành "{major.name}"? Hành động này sẽ xóa cả các điểm chuẩn liên quan và không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(major.id)} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
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

export default MajorsManagementTab;