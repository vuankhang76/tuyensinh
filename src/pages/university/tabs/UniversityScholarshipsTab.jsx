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
import { Plus, Edit, Trash2, Award, Search, DollarSign, Filter } from 'lucide-react';
import { universityViewService } from '@/services';

const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  value: '',
  valueType: 'VNĐ',
  criteria: '',
  year: new Date().getFullYear().toString(),
};

const VALUE_TYPES = [
  { value: 'VNĐ', label: 'VNĐ' },
  { value: '%', label: '% học phí' },
  { value: 'Suất', label: 'Suất học bổng' },
];

const UniversityScholarshipsTab = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [valueTypeFilter, setValueTypeFilter] = useState('');
  const [filteredScholarships, setFilteredScholarships] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await universityViewService.getMyScholarships();
      setScholarships(data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu học bổng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filtered = [...scholarships];

    if (searchQuery) {
      filtered = filtered.filter(scholarship =>
        scholarship.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.criteria?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (yearFilter) {
      filtered = filtered.filter(scholarship => scholarship.year?.toString() === yearFilter);
    }

    if (valueTypeFilter) {
      filtered = filtered.filter(scholarship => scholarship.valueType === valueTypeFilter);
    }

    // Sort by year descending, then by name
    filtered.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return a.name.localeCompare(b.name);
    });

    setFilteredScholarships(filtered);
  }, [scholarships, searchQuery, yearFilter, valueTypeFilter]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Tên học bổng là bắt buộc';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Mô tả là bắt buộc';
    }

    if (!formData.value?.trim()) {
      errors.value = 'Giá trị học bổng là bắt buộc';
    }

    if (formData.value && isNaN(formData.value)) {
      errors.value = 'Giá trị học bổng phải là số';
    }

    if (formData.value && parseFloat(formData.value) < 0) {
      errors.value = 'Giá trị học bổng phải lớn hơn 0';
    }

    if (formData.valueType === '%' && parseFloat(formData.value) > 100) {
      errors.value = 'Phần trăm không được vượt quá 100%';
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
        name: formData.name.trim(),
        description: formData.description.trim(),
        value: parseFloat(formData.value),
        valueType: formData.valueType,
        criteria: formData.criteria.trim(),
        year: parseInt(formData.year)
      };

      if (editingScholarship) {
        await universityViewService.updateMyScholarship(editingScholarship.id, {
          ...submitData,
          id: editingScholarship.id
        });
        toast.success('Cập nhật học bổng thành công!');
      } else {
        await universityViewService.createMyScholarship(submitData);
        toast.success('Thêm học bổng thành công!');
      }

      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Lỗi khi lưu học bổng:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi lưu học bổng');
      }
    }
  };

  const handleEdit = (scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      name: scholarship.name || '',
      description: scholarship.description || '',
      value: scholarship.value?.toString() || '',
      valueType: scholarship.valueType || 'VNĐ',
      criteria: scholarship.criteria || '',
      year: scholarship.year?.toString() || new Date().getFullYear().toString(),
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await universityViewService.deleteMyScholarship(id);
      toast.success('Xóa học bổng thành công!');
      await fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa học bổng:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi xóa học bổng');
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingScholarship(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  };

  const formatValue = (value, valueType) => {
    if (!value) return 'Chưa có thông tin';
    
    const formattedValue = new Intl.NumberFormat('vi-VN').format(value);
    
    switch (valueType) {
      case '%':
        return `${formattedValue}% học phí`;
      case 'Suất':
        return `${formattedValue} suất`;
      case 'VNĐ':
      default:
        return `${formattedValue} VNĐ`;
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setYearFilter('');
    setValueTypeFilter('');
  };

  const uniqueYears = [...new Set(scholarships.map(scholarship => scholarship.year))].sort((a, b) => b - a);
  const uniqueValueTypes = [...new Set(scholarships.map(scholarship => scholarship.valueType))];

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
            <Award className="h-5 w-5" />
            <span>Quản lý học bổng</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm học bổng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingScholarship ? 'Chỉnh sửa học bổng' : 'Thêm học bổng mới'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Tên học bổng *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={formErrors.name ? "border-red-500" : ""}
                    placeholder="VD: Học bổng khuyến học"
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="value">Giá trị học bổng *</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => handleInputChange('value', e.target.value)}
                      className={formErrors.value ? "border-red-500" : ""}
                      placeholder="VD: 5000000"
                      min="0"
                      step={formData.valueType === '%' ? '0.1' : '1000'}
                    />
                    {formErrors.value && <p className="text-red-500 text-sm mt-1">{formErrors.value}</p>}
                  </div>
                  <div>
                    <Label htmlFor="valueType">Đơn vị</Label>
                    <select
                      id="valueType"
                      value={formData.valueType}
                      onChange={(e) => handleInputChange('valueType', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                    >
                      {VALUE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
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
                
                <div>
                  <Label htmlFor="description">Mô tả *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={formErrors.description ? "border-red-500" : ""}
                    placeholder="Mô tả về học bổng..."
                    rows={3}
                  />
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>
                
                <div>
                  <Label htmlFor="criteria">Tiêu chí nhận học bổng</Label>
                  <Textarea
                    id="criteria"
                    value={formData.criteria}
                    onChange={(e) => handleInputChange('criteria', e.target.value)}
                    placeholder="Các tiêu chí để nhận học bổng..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Hủy
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingScholarship ? 'Cập nhật' : 'Thêm'}
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
              placeholder="Tìm kiếm học bổng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white min-w-24"
            >
              <option value="">Tất cả năm</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              value={valueTypeFilter}
              onChange={(e) => setValueTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white min-w-32"
            >
              <option value="">Tất cả loại</option>
              {uniqueValueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {(yearFilter || valueTypeFilter || searchQuery) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
          <Badge variant="secondary" className="ml-auto">
            Hiển thị: {filteredScholarships.length} / {scholarships.length}
          </Badge>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên học bổng</TableHead>
                <TableHead>Năm</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Tiêu chí</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScholarships.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchQuery || yearFilter || valueTypeFilter ? 'Không tìm thấy học bổng nào' : 'Chưa có học bổng nào'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredScholarships.map((scholarship) => (
                  <TableRow key={scholarship.id}>
                    <TableCell className="font-medium">{scholarship.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{scholarship.year}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          {formatValue(scholarship.value, scholarship.valueType)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={scholarship.description}>
                        {scholarship.description}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={scholarship.criteria}>
                        {scholarship.criteria || 'Chưa có'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(scholarship)}
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
                                Bạn có chắc chắn muốn xóa học bổng "{scholarship.name}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(scholarship.id)}
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
      </CardContent>
    </Card>
  );
};

export default UniversityScholarshipsTab; 