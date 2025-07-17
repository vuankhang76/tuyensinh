import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Award } from 'lucide-react';
import { scholarshipService } from '@/services';
import { TableSkeleton } from '@/components/common/Loading/LoadingSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
const INITIAL_FORM_DATA = {
    name: '',
    description: '',
    value: '',
    valueType: 'amount',
    criteria: '',
    year: new Date().getFullYear().toString(),
};
const ScholarshipsTab = ({ universityId }) => {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [formErrors, setFormErrors] = useState({});
    const fetchScholarships = useCallback(async () => {
        if (!universityId) return;
        setLoading(true);
        try {
            const data = await scholarshipService.getScholarshipsByUniversity(universityId);
            setScholarships(data || []);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tải danh sách học bổng');
        } finally {
            setLoading(false);
        }
    }, [universityId]);
    useEffect(() => {
        fetchScholarships();
    }, [fetchScholarships]);
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
    };
    const handleOpenNewDialog = () => {
        setEditingScholarship(null);
        setFormData(INITIAL_FORM_DATA);
        setFormErrors({});
        setIsDialogOpen(true);
    };
    const handleEdit = (scholarship) => {
        setEditingScholarship(scholarship);
        setFormData({
            name: scholarship.name || '',
            description: scholarship.description || '',
            value: scholarship.value?.toString() || '',
            valueType: scholarship.valueType || 'amount',
            criteria: scholarship.criteria || '',
            year: scholarship.year?.toString() || new Date().getFullYear().toString(),
        });
        setIsDialogOpen(true);
    };
    const validateForm = () => {
        const errors = {};
        const currentYear = new Date().getFullYear();
        if (!formData.name?.trim()) {
            errors.name = 'Tên học bổng là bắt buộc.';
        } else if (formData.name.trim().length > 255) {
            errors.name = 'Tên học bổng không được vượt quá 255 ký tự.';
        }
        if (formData.value) {
            if (isNaN(formData.value)) {
                errors.value = 'Giá trị phải là một số.';
            } else {
                const numericValue = parseFloat(formData.value);
                if (numericValue < 0) {
                    errors.value = 'Giá trị không thể là số âm.';
                }

                if (formData.valueType === 'Percentage' && numericValue > 100) {
                    errors.value = 'Giá trị phần trăm không thể lớn hơn 100.';
                } else if (formData.valueType === 'amount' && numericValue > 1000000000) {
                    errors.value = 'Giá trị tiền có vẻ quá cao, vui lòng kiểm tra lại.';
                }
            }
        }
        if (formData.value && !formData.valueType) {
            errors.valueType = 'Vui lòng chọn loại giá trị (Số tiền hoặc Phần trăm).';
        }
        if (!formData.year) {
            errors.year = 'Năm học bổng là bắt buộc.';
        } else if (isNaN(formData.year) || !Number.isInteger(Number(formData.year))) {
            errors.year = 'Năm phải là một số nguyên.';
        } else if (parseInt(formData.year) < 2020 || parseInt(formData.year) > currentYear + 2) {
            errors.year = `Năm phải nằm trong khoảng từ 2020 đến ${currentYear + 2}.`;
        }
        if (formData.description?.length > 5000) {
            errors.description = 'Mô tả không được vượt quá 5000 ký tự.';
        }
        if (formData.criteria?.length > 5000) {
            errors.criteria = 'Tiêu chí không được vượt quá 5000 ký tự.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) {
            toast.error('Vui lòng sửa các lỗi trong form');
            return;
        }
        setLoading(true);
        const scholarshipData = {
            name: formData.name,
            description: formData.description,
            value: formData.value ? parseFloat(formData.value) : null,
            valueType: formData.valueType,
            criteria: formData.criteria,
            year: formData.year ? parseInt(formData.year) : new Date().getFullYear(),
            universityId: parseInt(universityId),
        };

        try {
            if (editingScholarship) {
                await scholarshipService.updateScholarship(editingScholarship.id, scholarshipData);
                toast.success('Cập nhật học bổng thành công!');
            } else {
                await scholarshipService.createScholarship(scholarshipData);
                toast.success('Thêm học bổng thành công!');
            }
            setIsDialogOpen(false);
            fetchScholarships();
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
    const handleDelete = async (scholarshipId) => {
        setLoading(true);
        try {
            await scholarshipService.deleteScholarship(scholarshipId);
            toast.success('Xóa học bổng thành công!');
            fetchScholarships();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa học bổng.');
        } finally {
            setLoading(false);
        }
    };
    const formatValue = (value, valueType) => {
        if (valueType === 'Percentage') {
            return `${value}%`
        } else if (valueType === 'Fixed') {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(value)
        }
        return value
    }
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Quản lý học bổng</h3>
                    <p className="text-sm text-muted-foreground">Thêm, sửa, xóa các chương trình học bổng.</p>
                </div>
                <Button onClick={handleOpenNewDialog} disabled={loading}><Plus className="h-4 w-4 mr-1" /> Thêm học bổng</Button>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingScholarship ? 'Chỉnh sửa học bổng' : 'Thêm học bổng mới'}</DialogTitle>
                        <DialogDescription>
                            {editingScholarship ? 'Cập nhật thông tin học bổng' : 'Thêm học bổng mới'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="name" className="mb-2">Tên học bổng *</Label>
                                <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} required />
                                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="valueType" className="mb-2">Loại giá trị</Label>
                                <Select value={formData.valueType} onValueChange={(value) => handleInputChange('valueType', value)}>
                                    <SelectTrigger><SelectValue placeholder="Chọn loại giá trị" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="amount">Số tiền</SelectItem>
                                        <SelectItem value="Percentage">Phần trăm</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formErrors.valueType && <p className="text-red-500 text-sm mt-1">{formErrors.valueType}</p>}
                            </div>
                            <div>
                                <Label htmlFor="value" className="mb-2">Giá trị</Label>
                                <Input id="value" type="number" value={formData.value} onChange={e => handleInputChange('value', e.target.value)} />
                                {formErrors.value && <p className="text-red-500 text-sm mt-1">{formErrors.value}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="year" className="mb-2">Năm</Label>
                                <Input id="year" type="number" value={formData.year} onChange={e => handleInputChange('year', e.target.value)} />
                                {formErrors.year && <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description" className="mb-2">Mô tả</Label>
                            <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="Mô tả ngắn gọn về học bổng..." />
                            {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                        </div>
                        <div>
                            <Label htmlFor="criteria" className="mb-2">Điều kiện</Label>
                            <Textarea id="criteria" value={formData.criteria} onChange={e => handleInputChange('criteria', e.target.value)} placeholder="Mô tả chi tiết về tiêu chí và quyền lợi..." rows={4} />
                            {formErrors.criteria && <p className="text-red-500 text-sm mt-1">{formErrors.criteria}</p>}
                        </div>
                        <div className="flex justify-end space-x-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button><Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button></div>
                    </form>
                </DialogContent>
            </Dialog>
            <Card>
                <CardHeader>
                    {loading ? (
                        <div className='animate-pulse'>
                            <Skeleton className="h-6 w-1/4" />
                        </div>
                    ) : (
                        <CardTitle className="flex items-center">
                            <Award className="h-5 w-5 mr-2" /> Danh sách học bổng ({scholarships.length})
                        </CardTitle>
                    )}
                </CardHeader>
                <CardContent>
                    {loading ? <TableSkeleton
                        columns={[
                            { width: "40%" },
                            { width: "10%" },
                            { width: "10%" },
                        ]}
                        rows={5}
                    /> : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên học bổng</TableHead>
                                        <TableHead>Giá trị</TableHead>
                                        <TableHead>Năm</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scholarships.length > 0 ? scholarships.map(scholarship => (
                                        <TableRow key={scholarship.id}>
                                            <TableCell className="font-medium">{scholarship.name}</TableCell>
                                            <TableCell>{formatValue(scholarship.value, scholarship.valueType)}</TableCell>
                                            <TableCell>{scholarship.year}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(scholarship)}><Edit className="h-4 w-4" /></Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Xác nhận xóa</AlertDialogTitle><AlertDialogDescription>Bạn có chắc muốn xóa học bổng "{scholarship.name}"?</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(scholarship.id)} className="bg-red-600">Xóa</AlertDialogAction></AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={4} className="h-24 text-center">Không có học bổng nào.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ScholarshipsTab;