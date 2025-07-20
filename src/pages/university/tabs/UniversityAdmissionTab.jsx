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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Users, Search, Settings } from 'lucide-react';
import { universityViewService } from '@/services';

const INITIAL_METHOD_DATA = {
  name: '',
  description: '',
  criteria: '',
  year: new Date().getFullYear().toString(),
};

const INITIAL_CRITERIA_DATA = {
  name: '',
  description: '',
  minimumScore: '',
  admissionMethodId: null,
};

const UniversityAdmissionTab = () => {
  const [methods, setMethods] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('methods');
  
  // Methods state
  const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [methodFormData, setMethodFormData] = useState(INITIAL_METHOD_DATA);
  const [methodFormErrors, setMethodFormErrors] = useState({});
  const [methodSearchQuery, setMethodSearchQuery] = useState('');
  
  // Criteria state
  const [isCriteriaDialogOpen, setIsCriteriaDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [criteriaFormData, setCriteriaFormData] = useState(INITIAL_CRITERIA_DATA);
  const [criteriaFormErrors, setCriteriaFormErrors] = useState({});
  const [criteriaSearchQuery, setCriteriaSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [methodsData, criteriaData] = await Promise.all([
        universityViewService.getMyAdmissionMethods(),
        universityViewService.getMyAdmissionCriteria()
      ]);

      setMethods(methodsData);
      setCriteria(criteriaData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Methods functions
  const validateMethodForm = () => {
    const errors = {};

    if (!methodFormData.name?.trim()) {
      errors.name = 'Tên phương thức là bắt buộc';
    }

    if (!methodFormData.description?.trim()) {
      errors.description = 'Mô tả là bắt buộc';
    }

    if (!methodFormData.year?.trim()) {
      errors.year = 'Năm là bắt buộc';
    }

    const currentYear = new Date().getFullYear();
    const year = parseInt(methodFormData.year);
    if (isNaN(year) || year < 2000 || year > currentYear + 5) {
      errors.year = `Năm phải từ 2000 đến ${currentYear + 5}`;
    }

    setMethodFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMethodSubmit = async () => {
    if (!validateMethodForm()) {
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }

    try {
      const submitData = {
        name: methodFormData.name.trim(),
        description: methodFormData.description.trim(),
        criteria: methodFormData.criteria.trim(),
        year: parseInt(methodFormData.year)
      };

      if (editingMethod) {
        await universityViewService.updateMyAdmissionMethod(editingMethod.id, {
          ...submitData,
          id: editingMethod.id
        });
        toast.success('Cập nhật phương thức tuyển sinh thành công!');
      } else {
        await universityViewService.createMyAdmissionMethod(submitData);
        toast.success('Thêm phương thức tuyển sinh thành công!');
      }

      await fetchData();
      handleCloseMethodDialog();
    } catch (error) {
      console.error('Lỗi khi lưu phương thức:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi lưu phương thức');
      }
    }
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    setMethodFormData({
      name: method.name || '',
      description: method.description || '',
      criteria: method.criteria || '',
      year: method.year?.toString() || new Date().getFullYear().toString(),
    });
    setMethodFormErrors({});
    setIsMethodDialogOpen(true);
  };

  const handleDeleteMethod = async (id) => {
    try {
      await universityViewService.deleteMyAdmissionMethod(id);
      toast.success('Xóa phương thức thành công!');
      await fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa phương thức:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi xóa phương thức');
      }
    }
  };

  const handleCloseMethodDialog = () => {
    setIsMethodDialogOpen(false);
    setEditingMethod(null);
    setMethodFormData(INITIAL_METHOD_DATA);
    setMethodFormErrors({});
  };

  // Criteria functions
  const validateCriteriaForm = () => {
    const errors = {};

    if (!criteriaFormData.name?.trim()) {
      errors.name = 'Tên tiêu chí là bắt buộc';
    }

    if (!criteriaFormData.description?.trim()) {
      errors.description = 'Mô tả là bắt buộc';
    }

    if (!criteriaFormData.admissionMethodId) {
      errors.admissionMethodId = 'Phương thức tuyển sinh là bắt buộc';
    }

    if (criteriaFormData.minimumScore && (isNaN(criteriaFormData.minimumScore) || criteriaFormData.minimumScore < 0 || criteriaFormData.minimumScore > 30)) {
      errors.minimumScore = 'Điểm tối thiểu phải từ 0 đến 30';
    }

    setCriteriaFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCriteriaSubmit = async () => {
    if (!validateCriteriaForm()) {
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }

    try {
      const submitData = {
        name: criteriaFormData.name.trim(),
        description: criteriaFormData.description.trim(),
        minimumScore: criteriaFormData.minimumScore ? parseFloat(criteriaFormData.minimumScore) : null,
        admissionMethodId: criteriaFormData.admissionMethodId
      };

      if (editingCriteria) {
        await universityViewService.updateMyAdmissionCriteria(editingCriteria.id, {
          ...submitData,
          id: editingCriteria.id
        });
        toast.success('Cập nhật tiêu chí thành công!');
      } else {
        await universityViewService.createMyAdmissionCriteria(submitData);
        toast.success('Thêm tiêu chí thành công!');
      }

      await fetchData();
      handleCloseCriteriaDialog();
    } catch (error) {
      console.error('Lỗi khi lưu tiêu chí:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi lưu tiêu chí');
      }
    }
  };

  const handleEditCriteria = (criteriaItem) => {
    setEditingCriteria(criteriaItem);
    setCriteriaFormData({
      name: criteriaItem.name || '',
      description: criteriaItem.description || '',
      minimumScore: criteriaItem.minimumScore?.toString() || '',
      admissionMethodId: criteriaItem.admissionMethodId || null,
    });
    setCriteriaFormErrors({});
    setIsCriteriaDialogOpen(true);
  };

  const handleDeleteCriteria = async (id) => {
    try {
      await universityViewService.deleteMyAdmissionCriteria(id);
      toast.success('Xóa tiêu chí thành công!');
      await fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa tiêu chí:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi xóa tiêu chí');
      }
    }
  };

  const handleCloseCriteriaDialog = () => {
    setIsCriteriaDialogOpen(false);
    setEditingCriteria(null);
    setCriteriaFormData(INITIAL_CRITERIA_DATA);
    setCriteriaFormErrors({});
  };

  const getMethodName = (methodId) => {
    const method = methods.find(m => m.id === methodId);
    return method ? method.name : 'Không xác định';
  };

  const filteredMethods = methods.filter(method =>
    method.name.toLowerCase().includes(methodSearchQuery.toLowerCase()) ||
    method.description?.toLowerCase().includes(methodSearchQuery.toLowerCase())
  );

  const filteredCriteria = criteria.filter(criteriaItem =>
    criteriaItem.name.toLowerCase().includes(criteriaSearchQuery.toLowerCase()) ||
    criteriaItem.description?.toLowerCase().includes(criteriaSearchQuery.toLowerCase())
  );

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
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Quản lý tuyển sinh</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="methods">Phương thức tuyển sinh</TabsTrigger>
            <TabsTrigger value="criteria">Tiêu chí tuyển sinh</TabsTrigger>
          </TabsList>

          <TabsContent value="methods">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm phương thức..."
                      value={methodSearchQuery}
                      onChange={(e) => setMethodSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Badge variant="secondary">
                    Tổng: {methods.length} phương thức
                  </Badge>
                </div>
                
                <Dialog open={isMethodDialogOpen} onOpenChange={setIsMethodDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsMethodDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm phương thức
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMethod ? 'Chỉnh sửa phương thức' : 'Thêm phương thức mới'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="methodName">Tên phương thức *</Label>
                          <Input
                            id="methodName"
                            value={methodFormData.name}
                            onChange={(e) => setMethodFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={methodFormErrors.name ? "border-red-500" : ""}
                            placeholder="VD: Xét tuyển theo học bạ"
                          />
                          {methodFormErrors.name && <p className="text-red-500 text-sm mt-1">{methodFormErrors.name}</p>}
                        </div>
                        <div>
                          <Label htmlFor="methodYear">Năm *</Label>
                          <Input
                            id="methodYear"
                            type="number"
                            value={methodFormData.year}
                            onChange={(e) => setMethodFormData(prev => ({ ...prev, year: e.target.value }))}
                            className={methodFormErrors.year ? "border-red-500" : ""}
                            min="2000"
                            max={new Date().getFullYear() + 5}
                          />
                          {methodFormErrors.year && <p className="text-red-500 text-sm mt-1">{methodFormErrors.year}</p>}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="methodDescription">Mô tả *</Label>
                        <Textarea
                          id="methodDescription"
                          value={methodFormData.description}
                          onChange={(e) => setMethodFormData(prev => ({ ...prev, description: e.target.value }))}
                          className={methodFormErrors.description ? "border-red-500" : ""}
                          placeholder="Mô tả chi tiết về phương thức tuyển sinh..."
                          rows={3}
                        />
                        {methodFormErrors.description && <p className="text-red-500 text-sm mt-1">{methodFormErrors.description}</p>}
                      </div>
                      <div>
                        <Label htmlFor="methodCriteria">Tiêu chí</Label>
                        <Textarea
                          id="methodCriteria"
                          value={methodFormData.criteria}
                          onChange={(e) => setMethodFormData(prev => ({ ...prev, criteria: e.target.value }))}
                          placeholder="Các tiêu chí cụ thể..."
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={handleCloseMethodDialog}>
                          Hủy
                        </Button>
                        <Button onClick={handleMethodSubmit}>
                          {editingMethod ? 'Cập nhật' : 'Thêm'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên phương thức</TableHead>
                      <TableHead>Năm</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Tiêu chí</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMethods.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {methodSearchQuery ? 'Không tìm thấy phương thức nào' : 'Chưa có phương thức nào'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMethods.map((method) => (
                        <TableRow key={method.id}>
                          <TableCell className="font-medium">{method.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{method.year}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={method.description}>
                              {method.description}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={method.criteria}>
                              {method.criteria || 'Chưa có'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditMethod(method)}
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
                                      Bạn có chắc chắn muốn xóa phương thức "{method.name}"? 
                                      Hành động này không thể hoàn tác.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteMethod(method.id)}
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
            </div>
          </TabsContent>

          <TabsContent value="criteria">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm tiêu chí..."
                      value={criteriaSearchQuery}
                      onChange={(e) => setCriteriaSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Badge variant="secondary">
                    Tổng: {criteria.length} tiêu chí
                  </Badge>
                </div>
                
                <Dialog open={isCriteriaDialogOpen} onOpenChange={setIsCriteriaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setIsCriteriaDialogOpen(true)}
                      disabled={methods.length === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm tiêu chí
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCriteria ? 'Chỉnh sửa tiêu chí' : 'Thêm tiêu chí mới'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="criteriaMethod">Phương thức tuyển sinh *</Label>
                        <select
                          id="criteriaMethod"
                          value={criteriaFormData.admissionMethodId || ''}
                          onChange={(e) => setCriteriaFormData(prev => ({ ...prev, admissionMethodId: parseInt(e.target.value) || null }))}
                          className={`w-full border rounded-md px-3 py-2 ${criteriaFormErrors.admissionMethodId ? "border-red-500" : "border-gray-300"}`}
                        >
                          <option value="">Chọn phương thức</option>
                          {methods.map(method => (
                            <option key={method.id} value={method.id}>{method.name}</option>
                          ))}
                        </select>
                        {criteriaFormErrors.admissionMethodId && <p className="text-red-500 text-sm mt-1">{criteriaFormErrors.admissionMethodId}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="criteriaName">Tên tiêu chí *</Label>
                          <Input
                            id="criteriaName"
                            value={criteriaFormData.name}
                            onChange={(e) => setCriteriaFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={criteriaFormErrors.name ? "border-red-500" : ""}
                            placeholder="VD: Điểm trung bình học tập"
                          />
                          {criteriaFormErrors.name && <p className="text-red-500 text-sm mt-1">{criteriaFormErrors.name}</p>}
                        </div>
                        <div>
                          <Label htmlFor="criteriaMinScore">Điểm tối thiểu</Label>
                          <Input
                            id="criteriaMinScore"
                            type="number"
                            step="0.1"
                            value={criteriaFormData.minimumScore}
                            onChange={(e) => setCriteriaFormData(prev => ({ ...prev, minimumScore: e.target.value }))}
                            className={criteriaFormErrors.minimumScore ? "border-red-500" : ""}
                            placeholder="VD: 7.0"
                            min="0"
                            max="30"
                          />
                          {criteriaFormErrors.minimumScore && <p className="text-red-500 text-sm mt-1">{criteriaFormErrors.minimumScore}</p>}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="criteriaDescription">Mô tả *</Label>
                        <Textarea
                          id="criteriaDescription"
                          value={criteriaFormData.description}
                          onChange={(e) => setCriteriaFormData(prev => ({ ...prev, description: e.target.value }))}
                          className={criteriaFormErrors.description ? "border-red-500" : ""}
                          placeholder="Mô tả chi tiết về tiêu chí..."
                          rows={3}
                        />
                        {criteriaFormErrors.description && <p className="text-red-500 text-sm mt-1">{criteriaFormErrors.description}</p>}
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={handleCloseCriteriaDialog}>
                          Hủy
                        </Button>
                        <Button onClick={handleCriteriaSubmit}>
                          {editingCriteria ? 'Cập nhật' : 'Thêm'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {methods.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Vui lòng tạo phương thức tuyển sinh trước khi thêm tiêu chí</p>
                </div>
              )}

              {methods.length > 0 && (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên tiêu chí</TableHead>
                        <TableHead>Phương thức</TableHead>
                        <TableHead>Điểm tối thiểu</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCriteria.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            {criteriaSearchQuery ? 'Không tìm thấy tiêu chí nào' : 'Chưa có tiêu chí nào'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCriteria.map((criteriaItem) => (
                          <TableRow key={criteriaItem.id}>
                            <TableCell className="font-medium">{criteriaItem.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{getMethodName(criteriaItem.admissionMethodId)}</Badge>
                            </TableCell>
                            <TableCell>
                              {criteriaItem.minimumScore ? (
                                <Badge variant="secondary">{criteriaItem.minimumScore}</Badge>
                              ) : (
                                <span className="text-muted-foreground">Chưa có</span>
                              )}
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={criteriaItem.description}>
                                {criteriaItem.description}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditCriteria(criteriaItem)}
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
                                        Bạn có chắc chắn muốn xóa tiêu chí "{criteriaItem.name}"? 
                                        Hành động này không thể hoàn tác.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteCriteria(criteriaItem.id)}
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UniversityAdmissionTab; 