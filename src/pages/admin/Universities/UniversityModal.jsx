import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const UniversityModal = ({ visible, onCancel, onSubmit, editingRecord }) => {
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

  const uploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      // Prevent auto upload, handle manually
      return false;
    },
    onChange: (info) => {
      // Handle file upload logic here
      console.log('File uploaded:', info);
    },
  };

  return (
    <Modal
      title={editingRecord ? "Sửa thông tin trường" : "Thêm trường mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'active',
          type: 'Công lập'
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="name" 
              label="Tên trường" 
              rules={[
                { required: true, message: 'Vui lòng nhập tên trường' },
                { min: 5, message: 'Tên trường phải có ít nhất 5 ký tự' }
              ]}
            >
              <Input placeholder="Nhập tên trường đại học" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="code" 
              label="Mã trường" 
              rules={[
                { required: true, message: 'Vui lòng nhập mã trường' },
                { pattern: /^[A-Z0-9]+$/, message: 'Mã trường chỉ chứa chữ hoa và số' }
              ]}
            >
              <Input placeholder="VD: HUST, VNU" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="type" 
              label="Loại hình" 
              rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}
            >
              <Select placeholder="Chọn loại hình trường">
                <Option value="Công lập">Công lập</Option>
                <Option value="Tư thục">Tư thục</Option>
                <Option value="Liên kết quốc tế">Liên kết quốc tế</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="established" 
              label="Năm thành lập"
              rules={[
                { required: true, message: 'Vui lòng nhập năm thành lập' },
                { pattern: /^\d{4}$/, message: 'Năm thành lập phải là 4 chữ số' }
              ]}
            >
              <Input placeholder="VD: 1956" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item 
          name="address" 
          label="Địa chỉ" 
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input placeholder="Nhập địa chỉ trường" />
        </Form.Item>

        <Form.Item 
          name="description" 
          label="Mô tả"
          rules={[{ max: 500, message: 'Mô tả không được quá 500 ký tự' }]}
        >
          <TextArea 
            rows={3} 
            placeholder="Nhập mô tả về trường đại học"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="phone" 
              label="Điện thoại"
              rules={[
                { pattern: /^[0-9\-\+\(\)\s]+$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input placeholder="VD: 024-3868-3008" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="email" 
              label="Email"
              rules={[
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input placeholder="info@university.edu.vn" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="website" 
              label="Website"
              rules={[
                { type: 'url', message: 'URL không hợp lệ' }
              ]}
            >
              <Input placeholder="https://university.edu.vn" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="status" 
              label="Trạng thái" 
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Tạm dừng</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="logo" label="Logo trường">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Tải lên logo</Button>
          </Upload>
          <div className="text-xs text-gray-500 mt-1">
            Định dạng: JPG, PNG. Kích thước tối đa: 2MB
          </div>
        </Form.Item>

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

export default UniversityModal; 