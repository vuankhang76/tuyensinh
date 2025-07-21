import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Edit,
  Building2,
  BookOpen,
  Award,
  GraduationCap,
  Newspaper,
  Users
} from 'lucide-react';

import MajorsManagementTab from './tabs/MajorsManagementTab';
import ProgramsManagementTab from './tabs/ProgramsManagementTab';
import AdmissionNewsTab from './tabs/AdmissionNewsManagementTab';
import ScholarshipsManagementTab from './tabs/ScholarshipsManagementTab';
import universityService from '@/services/universityService';
import AdmissionManagementTab from './tabs/AdmissionManagementTab';
import { Dialog } from '@radix-ui/react-dialog';

const UniversityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [university, setUniversity] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [currentTab, setCurrentTab] = useState('basic');

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    const validTabs = ['basic', 'majors', 'programs', 'news', 'scholarships', 'admission'];
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      setCurrentTab(tabFromUrl);
    } else {
      setCurrentTab('basic');
    }
  }, [searchParams]);

  useEffect(() => {
    if (id) {
      fetchUniversityData();
    }
  }, [id]);

  useEffect(() => {
    if (university) {
      setFormData(university);
      setFormErrors({});
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

  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Tên trường là bắt buộc';
    }

    if (!formData.shortName?.trim()) {
      errors.shortName = 'Tên viết tắt là bắt buộc';
    }

    if (!formData.type?.trim()) {
      errors.type = 'Loại hình là bắt buộc';
    }

    if (!formData.locations?.trim()) {
      errors.locations = 'Địa điểm là bắt buộc';
    }

    if (!formData.introduction?.trim()) {
      errors.introduction = 'Giới thiệu là bắt buộc';
    }

    if (!formData.officialWebsite?.trim()) {
      errors.officialWebsite = 'Website chính thức là bắt buộc';
    }

    if (!formData.admissionWebsite?.trim()) {
      errors.admissionWebsite = 'Website tuyển sinh là bắt buộc';
    }

    if (!formData.rankingCriteria?.trim()) {
      errors.rankingCriteria = 'Tiêu chí xếp hạng là bắt buộc';
    }

    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;

    if (formData.officialWebsite && !urlPattern.test(formData.officialWebsite)) {
      errors.officialWebsite = 'Website chính thức phải là URL hợp lệ';
    }

    if (formData.admissionWebsite && !urlPattern.test(formData.admissionWebsite)) {
      errors.admissionWebsite = 'Website tuyển sinh phải là URL hợp lệ';
    }

    if (formData.ranking && (isNaN(formData.ranking) || formData.ranking < 1)) {
      errors.ranking = 'Thứ hạng phải là số dương';
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

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        name: formData.name?.trim(),
        shortName: formData.shortName?.trim(),
        introduction: formData.introduction?.trim(),
        officialWebsite: formData.officialWebsite?.trim(),
        admissionWebsite: formData.admissionWebsite?.trim(),
        ranking: formData.ranking ? parseInt(formData.ranking) : null,
        rankingCriteria: formData.rankingCriteria?.trim(),
        locations: formData.locations?.trim(),
        type: formData.type?.trim()
      };

      await universityService.updateUniversity(id, updateData);

      await fetchUniversityData();

      setEditing(false);
      toast.success("Đã cập nhật thông tin trường đại học thành công!");
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const backendErrors = {};
        const errorData = error.response.data.errors;

        const fieldMapping = {
          'Name': 'name',
          'ShortName': 'shortName',
          'Introduction': 'introduction',
          'OfficialWebsite': 'officialWebsite',
          'AdmissionWebsite': 'admissionWebsite',
          'RankingCriteria': 'rankingCriteria',
          'Locations': 'locations',
          'Type': 'type'
        };

        Object.entries(errorData).forEach(([backendField, messages]) => {
          const frontendField = fieldMapping[backendField] || backendField.toLowerCase();
          if (Array.isArray(messages) && messages.length > 0) {
            backendErrors[frontendField] = messages[0];
          }
        });

        setFormErrors(backendErrors);
        toast.error('Có lỗi validation từ server');
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(university);
    setFormErrors({});
    setEditing(false);
  };

  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
    const params = new URLSearchParams(searchParams);
    if (newTab === 'basic') {
      params.delete('tab');
    } else {
      params.set('tab', newTab);
    }
    setSearchParams(params, { replace: true });
  };

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
    <div className="max-w-6xl mx-auto">
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
            <h1 className="text-3xl font-bold">{university.name} ({university.shortName})</h1>
          </div>
        </div>

        <div className="flex space-x-2">
          {(currentTab == 'basic' || currentTab == 'contact') && (
            editing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            )
          )}
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} defaultValue="basic" className="space-y-6">
        <TabsList className="w-full flex items-center justify-start md:justify-center">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Thông tin cơ bản</span>
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
          <TabsTrigger value="admission" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Phương thức tuyển sinh</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="mb-2">Tên trường *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    readOnly={!editing}
                    className={!editing ? "bg-muted cursor-default focus-visible:ring-0 focus-visible:ring-offset-0" :
                      formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="shortName" className="mb-2">Tên viết tắt *</Label>
                  <Input
                    id="shortName"
                    value={formData.shortName || ''}
                    onChange={(e) => handleInputChange('shortName', e.target.value)}
                    readOnly={!editing}
                    className={!editing ? "bg-muted cursor-default focus-visible:ring-0 focus-visible:ring-offset-0" :
                      formErrors.shortName ? "border-red-500" : ""}
                  />
                  {formErrors.shortName && <p className="text-red-500 text-sm mt-1">{formErrors.shortName}</p>}
                </div>
                <div>
                  <Label htmlFor="type" className="mb-2">Loại hình *</Label>
                  <Select
                    value={formData.type || ''}
                    onValueChange={(value) => handleInputChange('type', value)}
                    disabled={!editing}
                  >
                    <SelectTrigger className={formErrors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Công lập">Công lập</SelectItem>
                      <SelectItem value="Tư thục">Tư thục</SelectItem>
                      <SelectItem value="Dân lập">Dân lập</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.type && <p className="text-red-500 text-sm mt-1">{formErrors.type}</p>}
                </div>
                <div>
                  <Label htmlFor="ranking" className="mb-2">Thứ hạng</Label>
                  <Input
                    id="ranking"
                    type="number"
                    value={formData.ranking || ''}
                    onChange={(e) => handleInputChange('ranking', e.target.value)}
                    readOnly={!editing}
                    className={!editing ? "bg-muted cursor-default focus-visible:ring-0 focus-visible:ring-offset-0" :
                      formErrors.ranking ? "border-red-500" : ""}
                  />
                  {formErrors.ranking && <p className="text-red-500 text-sm mt-1">{formErrors.ranking}</p>}
                </div>
                <div>
                  <Label htmlFor="officialWebsite" className="mb-2">Website chính thức *</Label>
                  <Input
                    id="officialWebsite"
                    value={formData.officialWebsite || ''}
                    onChange={(e) => handleInputChange('officialWebsite', e.target.value)}
                    readOnly={!editing}
                    placeholder="https://www.hust.edu.vn"
                    className={!editing ? "bg-muted cursor-default focus-visible:ring-0 focus-visible:ring-offset-0" :
                      formErrors.officialWebsite ? "border-red-500" : ""}
                  />
                  {formErrors.officialWebsite && <p className="text-red-500 text-sm mt-1">{formErrors.officialWebsite}</p>}
                </div>
                <div>
                  <Label htmlFor="admissionWebsite" className="mb-2">Website tuyển sinh *</Label>
                  <Input
                    id="admissionWebsite"
                    value={formData.admissionWebsite || ''}
                    onChange={(e) => handleInputChange('admissionWebsite', e.target.value)}
                    readOnly={!editing}
                    placeholder="https://tuyensinh.hust.edu.vn"
                    className={!editing ? "bg-muted cursor-default focus-visible:ring-0 focus-visible:ring-offset-0" :
                      formErrors.admissionWebsite ? "border-red-500" : ""}
                  />
                  {formErrors.admissionWebsite && <p className="text-red-500 text-sm mt-1">{formErrors.admissionWebsite}</p>}
                </div>
                <div className="col-span-2">
                  <Label htmlFor="locations" className="mb-2">Địa điểm *</Label>
                  <Input
                    id="locations"
                    value={formData.locations || ''}
                    onChange={(e) => handleInputChange('locations', e.target.value)}
                    rows={3}
                    readOnly={!editing}
                    className={!editing ? "bg-muted cursor-default focus-visible:ring-0 focus-visible:ring-offset-0" :
                      formErrors.locations ? "border-red-500" : ""}
                  />
                  {formErrors.locations && <p className="text-red-500 text-sm mt-1">{formErrors.locations}</p>}
                </div>
                <div className="col-span-2">
                  <Label htmlFor="rankingCriteria" className="mb-2">Tiêu chí xếp hạng *</Label>
                  <Textarea
                    id="rankingCriteria"
                    value={formData.rankingCriteria || ''}
                    onChange={(e) => handleInputChange('rankingCriteria', e.target.value)}
                    readOnly={!editing}
                    placeholder="VD: QS World University Rankings"
                    className={!editing ? "bg-muted cursor-default focus-visible:ring-0 focus-visible:ring-offset-0" :
                      formErrors.rankingCriteria ? "border-red-500" : ""}
                  />
                  {formErrors.rankingCriteria && <p className="text-red-500 text-sm mt-1">{formErrors.rankingCriteria}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="introduction" className="mb-2">Giới thiệu *</Label>
                <Textarea
                  id="introduction"
                  value={formData.introduction || ''}
                  onChange={(e) => handleInputChange('introduction', e.target.value)}
                  rows={4}
                  readOnly={!editing}
                  className={!editing ? "bg-muted cursor-default focus-visible:ring-0 focus-visible:ring-offset-0" :
                    formErrors.introduction ? "border-red-500" : ""}
                />
                {formErrors.introduction && <p className="text-red-500 text-sm mt-1">{formErrors.introduction}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="majors">
          <MajorsManagementTab universityId={id} />
        </TabsContent>

        <TabsContent value="programs">
          <ProgramsManagementTab universityId={id} />
        </TabsContent>

        <TabsContent value="news">
          <AdmissionNewsTab universityId={id} />
        </TabsContent>

        <TabsContent value="scholarships">
          <ScholarshipsManagementTab universityId={id} />
        </TabsContent>

        <TabsContent value="admission">
          <AdmissionManagementTab universityId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversityDetailPage;