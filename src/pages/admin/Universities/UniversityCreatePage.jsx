import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import universityService from '../../../services/universityService';
import fileService from '../../../services/fileService';
import { toast } from 'sonner';
import { Upload, X, Image } from 'lucide-react';

const UniversityCreatePage = () => {
    const navigate = useNavigate();
    const form = useForm();
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Chỉ chấp nhận file ảnh (.jpg, .png, .gif, .webp)');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('File không được vượt quá 5MB');
                return;
            }

            setLogoFile(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
        const fileInput = document.getElementById('logo-upload');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (values) => {
        if (values.OfficialWebsite && !values.OfficialWebsite.startsWith('http')) {
            values.OfficialWebsite = 'https://' + values.OfficialWebsite;
        }
        if (values.AdmissionWebsite && !values.AdmissionWebsite.startsWith('http')) {
            values.AdmissionWebsite = 'https://' + values.AdmissionWebsite;
        }
        try {
            let logoUrl = values.Logo || null;
            if (logoFile) {
                setUploading(true);
                try {
                    const uploadResult = await fileService.uploadLogo(logoFile);
                    logoUrl = uploadResult.url;
                    toast.success('Upload logo thành công');
                } catch (error) {
                    toast.error('Lỗi khi upload logo: ' + (error.response?.data?.message || error.message));
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }

            await universityService.createUniversity({
                Name: values.Name,
                ShortName: values.ShortName,
                Introduction: values.Introduction,
                OfficialWebsite: values.OfficialWebsite,
                AdmissionWebsite: values.AdmissionWebsite,
                Ranking: values.Ranking,
                RankingCriteria: values.RankingCriteria,
                Locations: values.Location,
                Type: values.Type,
                Logo: logoUrl
            });
            
            toast.success('Đã thêm trường đại học mới');
            navigate('/admin/universities');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm trường đại học');
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Thêm trường đại học mới</h2>
                <Button variant="outline" onClick={() => navigate('/admin/universities')}>Quay lại</Button>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="Name"
                        rules={{ required: 'Vui lòng nhập tên trường' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên trường</FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: Đại học Bách khoa Hà Nội" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="ShortName"
                            rules={{ required: 'Vui lòng nhập mã trường' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã trường</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: HUST" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="Type"
                            rules={{ required: 'Vui lòng chọn loại hình' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loại hình</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại hình" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Công lập">Công lập</SelectItem>
                                            <SelectItem value="Tư thục">Tư thục</SelectItem>
                                            <SelectItem value="Dân lập">Dân lập</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="Location"
                        rules={{ required: 'Vui lòng nhập địa điểm' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Địa điểm</FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: Hà Nội" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="Introduction"
                        rules={{ required: 'Vui lòng nhập giới thiệu' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giới thiệu</FormLabel>
                                <FormControl>
                                    <Textarea rows={3} placeholder="Nhập giới thiệu về trường..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="OfficialWebsite"
                        rules={{
                            required: 'Vui lòng nhập website chính thức',
                            pattern: {
                                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/,
                                message: 'Website chính thức phải là URL hợp lệ'
                            }
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website chính thức</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://www.hust.edu.vn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="AdmissionWebsite"
                        rules={{
                            required: 'Vui lòng nhập website tuyển sinh',
                            pattern: {
                                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/,
                                message: 'Website chính thức phải là URL hợp lệ'
                              }
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website tuyển sinh</FormLabel>
                                <FormControl>
                                    <Input placeholder="tuyensinh.hust.edu.vn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="Ranking"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Xếp hạng</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="VD: 1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="RankingCriteria"
                        rules={{ required: 'Vui lòng nhập tiêu chí xếp hạng' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tiêu chí xếp hạng</FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: QS World University Rankings" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Logo Upload Section */}
                    <div className="space-y-4">
                        <FormLabel>Logo trường (không bắt buộc)</FormLabel>
                        
                        {/* Option 1: Upload File */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="text-center">
                                {logoPreview ? (
                                    <div className="relative inline-block">
                                        <img 
                                            src={logoPreview} 
                                            alt="Logo preview" 
                                            className="max-w-32 max-h-32 object-contain mx-auto"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                                            onClick={removeLogo}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="py-4">
                                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="mt-2">
                                            <label htmlFor="logo-upload" className="cursor-pointer">
                                                <Button type="button" variant="outline" asChild>
                                                    <span>
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Chọn ảnh
                                                    </span>
                                                </Button>
                                            </label>
                                            <input
                                                id="logo-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            PNG, JPG, GIF up to 5MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Option 2: URL Input */}
                        <div className="text-center text-sm text-gray-500">hoặc</div>
                        <FormField
                            control={form.control}
                            name="Logo"
                            rules={{
                                pattern: {
                                    value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/,
                                    message: 'Logo phải là URL hợp lệ'
                                }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hoặc nhập URL logo</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="https://example.com/logo.png" 
                                            {...field}
                                            disabled={!!logoFile}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/universities')}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={uploading}>
                            {uploading ? 'Đang upload...' : 'Thêm mới'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default UniversityCreatePage; 