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
  const [university, setUniversity] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (id) {
      fetchUniversityData();
    }
  }, [id]);

  useEffect(() => {
    if (university) {
      setFormData(university);
    }
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

  // Component for displaying read-only value with label
  const ReadOnlyField = ({ label, value, className = "" }) => (
    <div className={`space-y-1 ${className}`}>
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="text-sm p-3 rounded-md border bg-muted/50">
        {value || "Chưa có thông tin"}
      </div>
    </div>
  );

  if (loading && !university) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không tìm thấy thông tin trường đại học</p>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">{formData.name || university.name}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className={getTypeColor(formData.type || university.type)}>
                {formData.type || university.type}
              </Badge>
              <Badge variant="outline">
                {formData.shortName || university.shortName}
              </Badge>
            </div>
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Thông tin cơ bản</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Liên hệ</span>
          </TabsTrigger>
          <TabsTrigger value="majors" className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span>Ngành học</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Chương trình</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center space-x-2">
            <Newspaper className="h-4 w-4" />
            <span>Tin tức</span>
          </TabsTrigger>
          <TabsTrigger value="scholarships" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Học bổng</span>
          </TabsTrigger>
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
                {editing ? (
                  <>
                    <div>
                      <Label htmlFor="name">Tên trường</Label>
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Nhập tên trường đại học"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shortName">Tên viết tắt</Label>
                      <Input
                        id="shortName"
                        value={formData.shortName || ''}
                        onChange={(e) => handleInputChange('shortName', e.target.value)}
                        placeholder="Nhập tên viết tắt"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Loại hình</Label>
                      <Select 
                        value={formData.type || ''} 
                        onValueChange={(value) => handleInputChange('type', value)}
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
                      <Label htmlFor="ranking">Thứ hạng</Label>
                      <Input
                        id="ranking"
                        type="number"
                        value={formData.ranking || ''}
                        onChange={(e) => handleInputChange('ranking', e.target.value)}
                        placeholder="Nhập thứ hạng"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <ReadOnlyField label="Tên trường" value={formData.name} />
                    <ReadOnlyField label="Tên viết tắt" value={formData.shortName} />
                    <ReadOnlyField label="Loại hình" value={formData.type} />
                    <ReadOnlyField label="Thứ hạng" value={formData.ranking} />
                  </>
                )}
              </div>
              
              {editing ? (
                <div>
                  <Label htmlFor="introduction">Giới thiệu</Label>
                  <Textarea
                    id="introduction"
                    value={formData.introduction || ''}
                    onChange={(e) => handleInputChange('introduction', e.target.value)}
                    rows={4}
                    placeholder="Nhập giới thiệu về trường đại học"
                  />
                </div>
              ) : (
                <ReadOnlyField 
                  label="Giới thiệu" 
                  value={formData.introduction} 
                  className="col-span-full"
                />
              )}
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
              {editing ? (
                <>
                  <div>
                    <Label htmlFor="locations">Địa điểm</Label>
                    <Textarea
                      id="locations"
                      value={formData.locations || ''}
                      onChange={(e) => handleInputChange('locations', e.target.value)}
                      rows={3}
                      placeholder="Nhập địa điểm các cơ sở"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="officialWebsite">Website chính thức</Label>
                      <Input
                        id="officialWebsite"
                        value={formData.officialWebsite || ''}
                        onChange={(e) => handleInputChange('officialWebsite', e.target.value)}
                        placeholder="https://university.edu.vn"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admissionWebsite">Website tuyển sinh</Label>
                      <Input
                        id="admissionWebsite"
                        value={formData.admissionWebsite || ''}
                        onChange={(e) => handleInputChange('admissionWebsite', e.target.value)}
                        placeholder="https://admission.university.edu.vn"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <ReadOnlyField label="Địa điểm" value={formData.locations} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField 
                      label="Website chính thức" 
                      value={formData.officialWebsite ? (
                        <a href={formData.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {formData.officialWebsite}
                        </a>
                      ) : "Chưa có thông tin"} 
                    />
                    <ReadOnlyField 
                      label="Website tuyển sinh" 
                      value={formData.admissionWebsite ? (
                        <a href={formData.admissionWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {formData.admissionWebsite}
                        </a>
                      ) : "Chưa có thông tin"} 
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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