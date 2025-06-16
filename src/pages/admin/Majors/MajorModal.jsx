import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const MajorModal = ({ visible, onCancel, onSubmit, editingRecord, universities }) => {
  const form = useForm({
    defaultValues: {
      Year: new Date().getFullYear()
    }
  });

  useEffect(() => {
    if (visible) {
      if (editingRecord) {
        form.reset(editingRecord);
      } else {
        form.reset({ Year: new Date().getFullYear() });
      }
    }
  }, [visible, editingRecord, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
    form.reset();
  };

  const currentYear = new Date().getFullYear();

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingRecord ? "Sửa thông tin ngành" : "Thêm ngành mới"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="Name"
                rules={{
                  required: 'Vui lòng nhập tên ngành',
                  minLength: { value: 3, message: 'Tên ngành phải có ít nhất 3 ký tự' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên ngành</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Công nghệ Thông tin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="Code"
                rules={{
                  required: 'Vui lòng nhập mã ngành',
                  pattern: { value: /^[A-Z0-9]+$/, message: 'Mã ngành chỉ chứa chữ hoa và số' },
                  minLength: { value: 2, message: 'Mã ngành từ 2-10 ký tự' },
                  maxLength: { value: 10, message: 'Mã ngành từ 2-10 ký tự' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã ngành</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="VD: CNTT, KTPM" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="UniversityId"
              rules={{ required: 'Vui lòng chọn trường đại học' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trường đại học</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trường đại học" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {universities.map(uni => (
                        <SelectItem key={uni.Id} value={uni.Id.toString()}>
                          {uni.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Description"
              rules={{
                required: 'Vui lòng nhập mô tả ngành',
                minLength: { value: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
                maxLength: { value: 500, message: 'Mô tả không được quá 500 ký tự' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả ngành</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4} 
                      placeholder="Nhập mô tả chi tiết về ngành học..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="AdmissionScore"
                rules={{
                  min: { value: 0, message: 'Điểm chuẩn từ 0-30' },
                  max: { value: 30, message: 'Điểm chuẩn từ 0-30' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điểm chuẩn</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="VD: 24.5"
                        step="0.1"
                        min="0"
                        max="30"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="Year"
                rules={{
                  required: 'Vui lòng chọn năm'
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Năm</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => currentYear - 2 + i).map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit">
                {editingRecord ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MajorModal; 