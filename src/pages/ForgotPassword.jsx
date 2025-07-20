import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { sendPasswordReset, loginWithGoogle } from '../services/authService';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'university') {
        navigate('/university', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  const handlePasswordReset = async (values) => {
    setLoading(true);

    try {
      const result = await sendPasswordReset(values.email);

      if (result.success) {
        setEmailSent(true);
        setSentEmail(values.email);
        toast.success("Email reset mật khẩu đã được gửi", {
          description: `Vui lòng kiểm tra hộp thư của ${values.email}`,
        });
      } else {
        if (result.isGoogleAccount) {
          setIsGoogleAccount(true);
          setSentEmail(values.email);
          toast.info("Tài khoản Google", {
            description: result.error,
          });
        } else {
          toast.error("Gửi email thất bại", {
            description: result.error,
          });
        }
      }
    } catch (error) {
      toast.error("Lỗi hệ thống", {
        description: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!sentEmail) return;
    
    setLoading(true);
    try {
      const result = await sendPasswordReset(sentEmail);
      
      if (result.success) {
        toast.success("Email đã được gửi lại", {
          description: `Vui lòng kiểm tra hộp thư của ${sentEmail}`,
        });
      } else {
        toast.error("Gửi lại email thất bại", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Lỗi hệ thống", {
        description: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const result = await loginWithGoogle();

      if (result.error) {
        toast.error("Đăng nhập Google thất bại", {
          description: result.error,
        });
      } else {
        login(result.user);
        toast.success("Đăng nhập thành công", {
          description: `Chào mừng ${result.user.displayName}!`,
        });

        if (result.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (result.user.role === 'university') {
          navigate('/university', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      toast.error("Lỗi hệ thống", {
        description: "Đã xảy ra lỗi khi đăng nhập bằng Google.",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              Email đã được gửi
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Chúng tôi đã gửi link reset mật khẩu đến
            </p>
            <p className="text-sm font-medium text-foreground">
              {sentEmail}
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Vui lòng kiểm tra hộp thư email của bạn và nhấp vào link để reset mật khẩu. 
                  Link sẽ hết hạn sau 1 giờ.
                </AlertDescription>
              </Alert>

              <div className="mt-6 space-y-4">
                <Button
                  onClick={handleResendEmail}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? 'Đang gửi...' : 'Gửi lại email'}
                </Button>

                <Button
                  onClick={() => navigate('/dang-nhap')}
                  className="w-full"
                >
                  Quay lại đăng nhập
                </Button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Không nhận được email? Kiểm tra thư mục spam hoặc{' '}
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setSentEmail('');
                    }}
                    className="text-primary hover:underline"
                  >
                    thử email khác
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isGoogleAccount) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-blue-500" />
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              Tài khoản Google
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Email này được đăng ký bằng Google
            </p>
            <p className="text-sm font-medium text-foreground">
              {sentEmail}
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Tài khoản này được tạo bằng Google. Bạn không cần mật khẩu để đăng nhập.
                  Vui lòng sử dụng nút "Đăng nhập với Google" thay vì reset mật khẩu.
                </AlertDescription>
              </Alert>

              <div className="mt-6 space-y-4">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {googleLoading ? 'Đang đăng nhập...' : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Đăng nhập với Google
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => navigate('/dang-nhap')}
                  variant="outline"
                  className="w-full"
                >
                  Quay lại đăng nhập
                </Button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Không phải tài khoản của bạn?{' '}
                  <button
                    onClick={() => {
                      setIsGoogleAccount(false);
                      setSentEmail('');
                    }}
                    className="text-primary hover:underline"
                  >
                    thử email khác
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Quên mật khẩu
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Nhập email để reset mật khẩu</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handlePasswordReset)} className="space-y-6">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    {...register('email', {
                      required: 'Email là bắt buộc',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email không hợp lệ'
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Đang gửi...' : 'Gửi email reset mật khẩu'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    Hoặc
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link to="/dang-nhap">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại đăng nhập
                  </Button>
                </Link>

                <div className="text-center mt-4">
                  <span className="text-sm text-muted-foreground">
                    Chưa có tài khoản?{' '}
                    <Link
                      to="/dang-ky"
                      className="font-medium text-primary hover:underline"
                    >
                      Đăng ký ngay
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 