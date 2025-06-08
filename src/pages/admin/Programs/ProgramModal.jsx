import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, InputNumber, Button } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const ProgramModal = ({ visible, onCancel, onSubmit, editingRecord, universities }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingRecord) {
        form.setFieldsValue(editingRecord);
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingRecord, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  const currentYear = new Date().getFullYear();

  return (
    <Modal
      title={editingRecord ? "Sửa chương trình đào tạo" : "Thêm chương trình mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          Year: currentYear,
          TuitionUnit: 'học kỳ'
        }}
      >
        <Form.Item 
          name="Name" 
          label="Tên chương trình" 
          rules={[
            { required: true, message: 'Vui lòng nhập tên chương trình' },
            { min: 5, message: 'Tên chương trình phải có ít nhất 5 ký tự' },
            { max: 100, message: 'Tên chương trình không được quá 100 ký tự' }
          ]}
        >
          <Input placeholder="VD: Cử nhân Công nghệ Thông tin" />
        </Form.Item>

        <Form.Item 
          name="UniversityId" 
          label="Trường đại học" 
          rules={[{ required: true, message: 'Vui lòng chọn trường đại học' }]}
        >
          <Select placeholder="Chọn trường đại học">
            {universities.map(uni => (
              <Option key={uni.Id} value={uni.Id}>
                {uni.Name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="Description" 
          label="Mô tả chương trình"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả chương trình' },
            { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự' },
            { max: 1000, message: 'Mô tả không được quá 1000 ký tự' }
          ]}
        >
          <TextArea 
            rows={4} 
            placeholder="Nhập mô tả chi tiết về chương trình đào tạo..."
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="Tuition" 
              label="Học phí (VNĐ)"
              rules={[
                { required: true, message: 'Vui lòng nhập học phí' },
                { type: 'number', min: 0, message: 'Học phí phải lớn hơn 0' }
              ]}
            >
              <InputNumber 
                placeholder="VD: 12000000"
                style={{ width: '100%' }}
                min={0}
                step={1000000}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="TuitionUnit" 
              label="Đơn vị tính học phí"
              rules={[{ required: true, message: 'Vui lòng chọn đơn vị tính' }]}
            >
              <Select placeholder="Chọn đơn vị tính">
                <Option value="học kỳ">Học kỳ</Option>
                <Option value="năm học">Năm học</Option>
                <Option value="khóa học">Khóa học</Option>
                <Option value="tín chỉ">Tín chỉ</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item 
          name="Year" 
          label="Năm áp dụng"
          rules={[
            { required: true, message: 'Vui lòng chọn năm' },
            { type: 'number', min: 2020, max: currentYear + 5, message: `Năm phải từ 2020-${currentYear + 5}` }
          ]}
        >
          <Select placeholder="Chọn năm áp dụng">
            {Array.from({ length: 10 }, (_, i) => currentYear - 2 + i).map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </Form.Item>

        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">💡 Gợi ý mô tả:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Thời gian đào tạo (số năm/học kỳ)</li>
            <li>• Hình thức đào tạo (chính quy, liên thông, từ xa...)</li>
            <li>• Bằng cấp cấp (Cử nhân, Thạc sĩ, Tiến sĩ...)</li>
            <li>• Đối tượng tuyển sinh và điều kiện</li>
            <li>• Cơ hội việc làm sau tốt nghiệp</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button onClick={onCancel}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            {editingRecord ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProgramModal; 