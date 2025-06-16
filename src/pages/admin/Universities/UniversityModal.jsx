import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const UniversityModal = ({ visible, onCancel, onSubmit, editingRecord }) => {
  const form = useForm();

  useEffect(() => {
    if (visible) {
      if (editingRecord) {
        form.reset(editingRecord);
      } else {
        form.reset();
      }
    }
  }, [visible, editingRecord, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingRecord ? "Sửa thông tin trường" : "Thêm trường mới"}
          </DialogTitle>
        </DialogHeader>
        
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
                name="Code"
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
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4} 
                      placeholder="Nhập mô tả về trường..."
                      {...field}
                    />
                  </FormControl>
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

export default UniversityModal; 