import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Edit,
  Building2,
  MapPin,
  Users,
  BookOpen,
  Award,
  GraduationCap,
  Newspaper
} from 'lucide-react';

// Import tab components
import MajorsManagementTab from './tabs/MajorsManagementTab';
import ProgramsManagementTab from './tabs/ProgramsManagementTab';
import AdmissionNewsTab from './tabs/AdmissionNewsTab';
import ScholarshipsTab from './tabs/ScholarshipsTab';
import universityService from '@/services/universityService';

const UniversityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [university, setUniversity] = useState({
    id: 1,
    name: 'Đại học Bách Khoa Hà Nội',
    code: 'HUST',
    address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    phone: '024-3868-3008',
    email: 'info@hust.edu.vn',
    website: 'https://hust.edu.vn',
    status: 'active',
    logo: 'https://example.com/logo1.png',
    description: 'Trường đại học hàng đầu về kỹ thuật và công nghệ tại Việt Nam',
    established: '1956',
    type: 'Công lập',
    studentCount: 35000,
    facultyCount: 15,
    programCount: 120,
    tuitionFee: '15000000-25000000',
    admissionScore: '22-28',
    facilities: 'Thư viện hiện đại, phòng thí nghiệm tối tân, ký túc xá, sân thể thao',
    achievements: 'Top 3 trường kỹ thuật hàng đầu Việt Nam, Chứng nhận chất lượng quốc tế'
  });

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (id) {
      fetchUniversityData();
    }
  }, [id]);

  useEffect(() => {
    setFormData(university);
  }, [university]);

  const fetchUniversityData = async () => {
    try {
      setLoading(true);
      const data = await universityService.getUniversityById(id);
      setUniversity(data);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải thông tin trường đại học');
      navigate('/admin/universities');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = await universityService.updateUniversity(id, formData);
      setUniversity(updatedData);
      setEditing(false);
      toast.success("Đã cập nhật thông tin trường đại học thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(university);
    setEditing(false);
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTypeColor = (type) => {
    return type === 'Công lập' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/universities')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{formData.name}</h1>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="contact">Liên hệ</TabsTrigger>
          <TabsTrigger value="academic">Học thuật</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
          <TabsTrigger value="majors">Ngành học</TabsTrigger>
          <TabsTrigger value="programs">Chương trình</TabsTrigger>
          <TabsTrigger value="news">Tin tức</TabsTrigger>
          <TabsTrigger value="scholarships">Học bổng</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tên trường</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="code">Mã trường</Label>
                  <Input
                    id="code"
                    value={formData.code || ''}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Loại hình</Label>
                  <Select 
                    value={formData.type || ''} 
                    onValueChange={(value) => handleInputChange('type', value)}
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Công lập">Công lập</SelectItem>
                      <SelectItem value="Tư thục">Tư thục</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="established">Năm thành lập</Label>
                  <Input
                    id="established"
                    value={formData.established || ''}
                    onChange={(e) => handleInputChange('established', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select 
                    value={formData.status || ''} 
                    onValueChange={(value) => handleInputChange('status', value)}
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Tạm dừng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!editing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!editing}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!editing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Information Tab */}
        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Thông tin học thuật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tuitionFee" >Học phí (VNĐ)</Label>
                  <Input
                    id="tuitionFee"
                    value={formData.tuitionFee || ''}
                    onChange={(e) => handleInputChange('tuitionFee', e.target.value)}
                    disabled={!editing}
                    placeholder="15000000-25000000"
                  />
                </div>
                <div>
                  <Label htmlFor="admissionScore">Điểm chuẩn</Label>
                  <Input
                    id="admissionScore"
                    value={formData.admissionScore || ''}
                    onChange={(e) => handleInputChange('admissionScore', e.target.value)}
                    disabled={!editing}
                    placeholder="22-28"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="facilities">Cơ sở vật chất</Label>
                <Textarea
                  id="facilities"
                  value={formData.facilities || ''}
                  onChange={(e) => handleInputChange('facilities', e.target.value)}
                  disabled={!editing}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="achievements">Thành tích & Chứng nhận</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements || ''}
                  onChange={(e) => handleInputChange('achievements', e.target.value)}
                  disabled={!editing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Users className="h-5 w-5 mr-2" />
                  Sinh viên
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formData.studentCount?.toLocaleString() || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">Tổng số sinh viên</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Building2 className="h-5 w-5 mr-2" />
                  Khoa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formData.facultyCount || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">Số khoa/viện</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Award className="h-5 w-5 mr-2" />
                  Chương trình
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formData.programCount || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">Chương trình đào tạo</p>
              </CardContent>
            </Card>
          </div>
          
          {editing && (
            <Card>
              <CardHeader>
                <CardTitle>Cập nhật thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="studentCount">Số sinh viên</Label>
                    <Input
                      id="studentCount"
                      type="number"
                      value={formData.studentCount || ''}
                      onChange={(e) => handleInputChange('studentCount', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="facultyCount">Số khoa/viện</Label>
                    <Input
                      id="facultyCount"
                      type="number"
                      value={formData.facultyCount || ''}
                      onChange={(e) => handleInputChange('facultyCount', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="programCount">Số chương trình</Label>
                    <Input
                      id="programCount"
                      type="number"
                      value={formData.programCount || ''}
                      onChange={(e) => handleInputChange('programCount', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Majors Management Tab */}
        <TabsContent value="majors">
          <MajorsManagementTab universityId={id} />
        </TabsContent>

        {/* Programs Management Tab */}
        <TabsContent value="programs">
          <ProgramsManagementTab universityId={id} />
        </TabsContent>

        {/* Admission News Tab */}
        <TabsContent value="news">
          <AdmissionNewsTab universityId={id} />
        </TabsContent>

        {/* Scholarships Tab */}
        <TabsContent value="scholarships">
          <ScholarshipsTab universityId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversityDetailPage; 