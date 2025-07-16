import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import universityService from '../../../services/universityService';
import { toast } from 'sonner';

const UniversityCreatePage = () => {
    const navigate = useNavigate();
    const form = useForm();

    const handleSubmit = async (values) => {
        if (values.OfficialWebsite && !values.OfficialWebsite.startsWith('http')) {
            values.OfficialWebsite = 'https://' + values.OfficialWebsite;
        }
        if (values.AdmissionWebsite && !values.AdmissionWebsite.startsWith('http')) {
            values.AdmissionWebsite = 'https://' + values.AdmissionWebsite;
        }
        try {
            await universityService.createUniversity({
                name: values.Name,
                shortName: values.ShortName,
                introduction: values.Introduction,
                officialWebsite: values.OfficialWebsite,
                admissionWebsite: values.AdmissionWebsite,
                ranking: values.Ranking,
                rankingCriteria: values.RankingCriteria,
                locations: values.Location,
                type: values.Type
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
                        name="OfficialWebsite   "
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

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/universities')}>
                            Hủy
                        </Button>
                        <Button type="submit">
                            Thêm mới
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default UniversityCreatePage; 