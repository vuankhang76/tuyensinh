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
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { MethodCardSkeleton } from '@/components/common/Loading/LoadingSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { admissionMethodService } from '@/services';
const INITIAL_FORM_DATA = {
    name: '',
    description: '',
    criteria: '',
    year: new Date().getFullYear().toString(),
};

const AdmissionManagementTab = ({ universityId }) => {
    const [admissionMethods, setAdmissionMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [formErrors, setFormErrors] = useState({});

    const fetchMethods = useCallback(async () => {
        setLoading(true);
        try {
            const data = await admissionMethodService.getAdmissionMethodsByUniversity(universityId);
            const sortedData = data.sort((a, b) => a.id - b.id);
            setAdmissionMethods(sortedData);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tải danh sách phương thức');
        } finally {
            setLoading(false);
        }
    }, [universityId]);

    useEffect(() => {
        fetchMethods();
    }, [fetchMethods]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const errors = {};
        const currentYear = new Date().getFullYear();
        if (!formData.name?.trim()) errors.name = 'Tên phương thức là bắt buộc.';
        if (!formData.description?.trim()) errors.description = 'Mô tả là bắt buộc.';
        if (!formData.year) {
            errors.year = 'Năm là bắt buộc.';
        } else if (isNaN(formData.year) || parseInt(formData.year) < 2015 || parseInt(formData.year) > currentYear + 2) {
            errors.year = `Năm phải nằm trong khoảng từ 2015 đến ${currentYear + 2}.`;
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleOpenNewDialog = () => {
        setEditingMethod(null);
        setFormErrors({});
        setFormData(INITIAL_FORM_DATA);
        setIsDialogOpen(true);
    };

    const handleEdit = (method) => {
        setEditingMethod(method);
        setFormErrors({});
        setFormData({
            name: method.name || '',
            description: method.description || '',
            criteria: method.criteria || '',
            year: method.year?.toString() || '',
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
        const methodData = {
            name: formData.name,
            description: formData.description,
            criteria: formData.criteria,
            universityId: parseInt(universityId),
            year: parseInt(formData.year),
        };
        try {
            if (editingMethod) {
                await admissionMethodService.updateAdmissionMethod(editingMethod.id, methodData);
                toast.success('Cập nhật phương thức thành công!');
            } else {
                await admissionMethodService.createAdmissionMethod(methodData);
                toast.success('Thêm phương thức thành công!');
            }
            setIsDialogOpen(false);
            fetchMethods();
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Có lỗi xảy ra khi lưu phương thức');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (methodId) => {
        setLoading(true);
        try {
            await admissionMethodService.deleteAdmissionMethod(methodId);
            toast.success('Xóa phương thức thành công!');
            fetchMethods();
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Có lỗi xảy ra khi xóa phương thức');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Quản lý phương thức tuyển sinh</h3>
                    <p className="text-sm text-muted-foreground">Thêm, sửa, xóa các phương thức tuyển sinh của trường.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleOpenNewDialog} disabled={loading}><Plus className="h-4 w-4 mr-1" />Thêm phương thức</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingMethod ? 'Chỉnh sửa phương thức' : 'Thêm phương thức mới'}</DialogTitle>
                            <DialogDescription>Điền thông tin chi tiết cho phương thức tuyển sinh.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label htmlFor="name" className="mb-2">Tên phương thức *</Label>
                                    <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                                    {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="year" className="mb-2">Năm áp dụng *</Label>
                                    <Input id="year" type="number" value={formData.year} onChange={e => handleInputChange('year', e.target.value)} />
                                    {formErrors.year && <p className="text-sm text-red-500 mt-1">{formErrors.year}</p>}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="description" className="mb-2">Mô tả *</Label>
                                <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={3} />
                                {formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}
                            </div>
                            <div>
                                <Label htmlFor="criteria" className="mb-2">Tiêu chí</Label>
                                <Textarea id="criteria" value={formData.criteria} onChange={e => handleInputChange('criteria', e.target.value)} rows={3} />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                                <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button>
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
                            <Users className="h-5 w-5 mr-2" />
                            Danh sách phương thức ({admissionMethods.length})
                        </CardTitle>
                    )}
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <MethodCardSkeleton />
                            <MethodCardSkeleton />
                            <MethodCardSkeleton />
                        </div>
                    ) : admissionMethods.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">Chưa có phương thức nào.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[5%]">ID</TableHead>
                                    <TableHead>Tên phương thức</TableHead>
                                    <TableHead>Mô tả</TableHead>
                                    <TableHead className="text-center">Năm</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admissionMethods.map(method => (
                                    <TableRow key={method.id}>
                                        <TableCell className="font-medium">{method.id}</TableCell>
                                        <TableCell className="font-medium truncate max-w-60" title={method.name}>{method.name}</TableCell>
                                        <TableCell>
                                            <p className="text-sm text-muted-foreground line-clamp-2 truncate w-110" title={method.description}>{method.description}</p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">{method.year}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(method)}><Edit className="h-4 w-4" /></Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                                            <AlertDialogDescription>Bạn có chắc chắn muốn xóa phương thức <strong>"{method.name}"</strong>?</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(method.id)} className="bg-red-600">Xóa</AlertDialogAction>
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

export default AdmissionManagementTab;