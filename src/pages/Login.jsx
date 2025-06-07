import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Input, Button, Divider, Alert, Checkbox } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  GoogleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { loginWithCredentials, loginWithGoogle } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  // Email/Password Login
  const handleCredentialsLogin = async (values) => {
    setLoading(true);
    setError('');

    try {
      const result = await loginWithCredentials(
        values.emailOrUsername, 
        values.password
      );
      
      if (result.error) {
        setError(result.error);
      } else {
        login(result.user);
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const result = await loginWithGoogle();
      
      if (result.error) {
        setError(result.error);
      } else {
        login(result.user);
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi đăng nhập bằng Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Đăng nhập
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đăng nhập với tài khoản sinh viên hoặc trường đại học
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0">
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              className="mb-4"
              onClose={() => setError('')}
            />
          )}

          {/* Google Login First */}
          <Button
            onClick={handleGoogleLogin}
            loading={googleLoading}
            icon={<GoogleOutlined />}
            className="w-full h-12 text-base font-medium border-gray-300 hover:border-blue-400 mb-4"
            size="large"
          >
            {googleLoading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'}
          </Button>

          <Divider>
            <span className="text-gray-400 text-sm">Hoặc đăng nhập bằng email</span>
          </Divider>

          {/* Email/Password Form */}
          <Form
            form={form}
            name="login"
            onFinish={handleCredentialsLogin}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="emailOrUsername"
              label="Email hoặc Tên đăng nhập"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email hoặc tên đăng nhập!'
                }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nhập email hoặc tên đăng nhập"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!'
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập mật khẩu"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex items-center justify-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <Link 
                  to="/forgot-password" 
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-base font-medium"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>

          {/* Register Links */}
          <div className="text-center mt-6 pt-4 border-t border-gray-100 space-y-3">
            <div className="text-gray-600 text-sm">
              Chưa có tài khoản?
            </div>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/register/student" 
                className="text-blue-600 hover:text-blue-500 font-medium text-sm"
              >
                Đăng ký Sinh viên
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                to="/register/university" 
                className="text-green-600 hover:text-green-500 font-medium text-sm"
              >
                Đăng ký Trường ĐH
              </Link>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          Bằng việc đăng nhập, bạn đồng ý với{' '}
          <Link to="/terms" className="text-blue-600 hover:text-blue-500">
            Điều khoản sử dụng
          </Link>{' '}
          và{' '}
          <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
            Chính sách bảo mật
          </Link>{' '}
          của chúng tôi.
        </div>
      </div>
    </div>
  );
};

export default Login;