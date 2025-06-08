import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, DatePicker, Button } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const AdmissionNewsModal = ({ visible, onCancel, onSubmit, editingRecord, universities }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingRecord) {
        form.setFieldsValue({
          ...editingRecord,
          PublishDate: moment(editingRecord.PublishDate)
        });
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
      title={editingRecord ? "Sửa tin tức tuyển sinh" : "Thêm tin tức mới"}
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
          Year: currentYear,
          Status: 'draft',
          PublishDate: moment()
        }}
      >
        <Form.Item 
          name="Title" 
          label="Tiêu đề tin tức" 
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề' },
            { min: 10, message: 'Tiêu đề phải có ít nhất 10 ký tự' },
            { max: 200, message: 'Tiêu đề không được quá 200 ký tự' }
          ]}
        >
          <Input 
            placeholder="Nhập tiêu đề tin tức tuyển sinh..." 
            showCount
            maxLength={200}
          />
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
          name="Content" 
          label="Nội dung tin tức"
          rules={[
            { required: true, message: 'Vui lòng nhập nội dung' },
            { min: 50, message: 'Nội dung phải có ít nhất 50 ký tự' },
            { max: 5000, message: 'Nội dung không được quá 5000 ký tự' }
          ]}
        >
          <TextArea 
            rows={8} 
            placeholder="Nhập nội dung chi tiết tin tức tuyển sinh..."
            showCount
            maxLength={5000}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item 
              name="PublishDate" 
              label="Ngày xuất bản"
              rules={[{ required: true, message: 'Vui lòng chọn ngày xuất bản' }]}
            >
              <DatePicker 
                showTime={{ format: 'HH:mm' }}
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
                placeholder="Chọn ngày và giờ"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              name="Year" 
              label="Năm tuyển sinh"
              rules={[
                { required: true, message: 'Vui lòng chọn năm' },
                { type: 'number', min: 2020, max: currentYear + 5, message: `Năm phải từ 2020-${currentYear + 5}` }
              ]}
            >
              <Select placeholder="Chọn năm tuyển sinh">
                {Array.from({ length: 10 }, (_, i) => currentYear - 2 + i).map(year => (
                  <Option key={year} value={year}>{year}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              name="Status" 
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="draft">Bản nháp</Option>
                <Option value="published">Đã xuất bản</Option>
                <Option value="archived">Lưu trữ</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Gợi ý nội dung:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Thông tin về phương thức tuyển sinh</li>
            <li>• Điểm chuẩn năm trước và dự kiến năm nay</li>
            <li>• Lịch đăng ký và thời gian xét tuyển</li>
            <li>• Thông tin học bổng và hỗ trợ tài chính</li>
            <li>• Hướng dẫn thủ tục nhập học</li>
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

export default AdmissionNewsModal; 