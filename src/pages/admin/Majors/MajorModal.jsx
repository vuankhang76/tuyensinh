import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, InputNumber, Button } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const MajorModal = ({ visible, onCancel, onSubmit, editingRecord, universities }) => {
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
      title={editingRecord ? "Sửa thông tin ngành" : "Thêm ngành mới"}
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
          Year: currentYear
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="Name" 
              label="Tên ngành" 
              rules={[
                { required: true, message: 'Vui lòng nhập tên ngành' },
                { min: 3, message: 'Tên ngành phải có ít nhất 3 ký tự' }
              ]}
            >
              <Input placeholder="VD: Công nghệ Thông tin" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="Code" 
              label="Mã ngành" 
              rules={[
                { required: true, message: 'Vui lòng nhập mã ngành' },
                { pattern: /^[A-Z0-9]+$/, message: 'Mã ngành chỉ chứa chữ hoa và số' },
                { min: 2, max: 10, message: 'Mã ngành từ 2-10 ký tự' }
              ]}
            >
              <Input 
                placeholder="VD: CNTT, KTPM" 
                style={{ textTransform: 'uppercase' }}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
            </Form.Item>
          </Col>
        </Row>

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
          label="Mô tả ngành"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả ngành' },
            { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
            { max: 500, message: 'Mô tả không được quá 500 ký tự' }
          ]}
        >
          <TextArea 
            rows={4} 
            placeholder="Nhập mô tả chi tiết về ngành học..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="AdmissionScore" 
              label="Điểm chuẩn"
              rules={[
                { type: 'number', min: 0, max: 30, message: 'Điểm chuẩn từ 0-30' }
              ]}
            >
              <InputNumber 
                placeholder="VD: 24.5"
                style={{ width: '100%' }}
                step={0.1}
                precision={1}
                min={0}
                max={30}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="Year" 
              label="Năm"
              rules={[
                { required: true, message: 'Vui lòng chọn năm' },
                { type: 'number', min: 2020, max: currentYear + 5, message: `Năm phải từ 2020-${currentYear + 5}` }
              ]}
            >
              <Select placeholder="Chọn năm">
                {Array.from({ length: 10 }, (_, i) => currentYear - 2 + i).map(year => (
                  <Option key={year} value={year}>{year}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

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

export default MajorModal; 