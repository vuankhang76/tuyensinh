import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const ProgramModal = ({ visible, onCancel, onSubmit, editingRecord, universities }) => {
  const form = useForm({
    defaultValues: {
      Year: new Date().getFullYear(),
      TuitionUnit: 'học kỳ'
    }
  });

  useEffect(() => {
    if (visible) {
      if (editingRecord) {
        form.reset(editingRecord);
      } else {
        form.reset({ 
          Year: new Date().getFullYear(),
          TuitionUnit: 'học kỳ'
        });
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
            {editingRecord ? "Sửa chương trình đào tạo" : "Thêm chương trình mới"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="Name"
              rules={{
                required: 'Vui lòng nhập tên chương trình',
                minLength: { value: 5, message: 'Tên chương trình phải có ít nhất 5 ký tự' },
                maxLength: { value: 100, message: 'Tên chương trình không được quá 100 ký tự' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chương trình</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Cử nhân Công nghệ Thông tin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                required: 'Vui lòng nhập mô tả chương trình',
                minLength: { value: 20, message: 'Mô tả phải có ít nhất 20 ký tự' },
                maxLength: { value: 1000, message: 'Mô tả không được quá 1000 ký tự' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chương trình</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4} 
                      placeholder="Nhập mô tả chi tiết về chương trình đào tạo..."
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
                name="Tuition"
                rules={{
                  required: 'Vui lòng nhập học phí',
                  min: { value: 0, message: 'Học phí phải lớn hơn 0' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Học phí (VNĐ)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="VD: 12000000"
                        min="0"
                        step="1000000"
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
                name="TuitionUnit"
                rules={{ required: 'Vui lòng chọn đơn vị tính' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn vị tính học phí</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đơn vị tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="học kỳ">Học kỳ</SelectItem>
                        <SelectItem value="năm học">Năm học</SelectItem>
                        <SelectItem value="khóa học">Khóa học</SelectItem>
                        <SelectItem value="tín chỉ">Tín chỉ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="Year"
              rules={{ required: 'Vui lòng chọn năm' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Năm áp dụng</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn năm áp dụng" />
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

export default ProgramModal; 