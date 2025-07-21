import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { verifyResetCode, confirmPasswordResetWithCode } from '../services/authService';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [codeValid, setCodeValid] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const password = watch('password');
  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'university') {
        navigate('/university', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }

    const verifyCode = async () => {
      if (!oobCode || mode !== 'resetPassword') {
        toast.error('Link reset mật khẩu không hợp lệ');
        navigate('/quen-mat-khau');
        return;
      }

      setVerifying(true);
      try {
        const result = await verifyResetCode(oobCode);
        
        if (result.success) {
          setCodeValid(true);
          setEmail(result.email);
        } else {
          toast.error('Link không hợp lệ', {
            description: result.error,
          });
          navigate('/quen-mat-khau');
        }
      } catch (error) {
        toast.error('Lỗi xác thực', {
          description: 'Có lỗi xảy ra khi xác thực link reset.',
        });
        navigate('/quen-mat-khau');
      } finally {
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode, mode, navigate, user]);

  const handlePasswordReset = async (values) => {
    if (!oobCode) {
      toast.error('Mã reset không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const result = await confirmPasswordResetWithCode(oobCode, values.password);

      if (result.success) {
        setResetComplete(true);
        toast.success('Mật khẩu đã được đặt lại thành công', {
          description: 'Bạn có thể đăng nhập với mật khẩu mới.',
        });
      } else {
        toast.error('Đặt lại mật khẩu thất bại', {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error('Lỗi hệ thống', {
        description: 'Đã xảy ra lỗi. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Đang xác thực link reset mật khẩu...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (resetComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              Mật khẩu đã được đặt lại
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Mật khẩu của bạn đã được cập nhật thành công
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Mật khẩu mới đã được lưu. Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.
                </AlertDescription>
              </Alert>

              <div className="mt-6">
                <Button
                  onClick={() => navigate('/dang-nhap')}
                  className="w-full"
                >
                  Đăng nhập ngay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!codeValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              Link không hợp lệ
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Link reset mật khẩu không hợp lệ hoặc đã hết hạn
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Link reset mật khẩu có thể đã hết hạn hoặc đã được sử dụng. 
                  Vui lòng yêu cầu link mới.
                </AlertDescription>
              </Alert>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => navigate('/quen-mat-khau')}
                  className="w-full"
                >
                  Yêu cầu link mới
                </Button>

                <Link to="/dang-nhap">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Đặt mật khẩu mới
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Nhập mật khẩu mới cho tài khoản {email}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Mật khẩu mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handlePasswordReset)} className="space-y-6">
              <div>
                <Label htmlFor="password">Mật khẩu mới</Label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới"
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    {...register('password', {
                      required: 'Mật khẩu là bắt buộc',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự'
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới"
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    {...register('confirmPassword', {
                      required: 'Vui lòng xác nhận mật khẩu',
                      validate: value =>
                        value === password || 'Mật khẩu xác nhận không khớp'
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Mật khẩu mới phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <Link
                  to="/dang-nhap"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="inline mr-1 h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword; 