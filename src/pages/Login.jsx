import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  User,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { loginWithCredentials, loginWithGoogle, resendVerificationEmail } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleCredentialsLogin = async (values) => {
    setLoading(true);

    try {
      const result = await loginWithCredentials(
        values.emailOrUsername,
        values.password
      );

      if (result.requiresEmailVerification) {
        toast.error(
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Email chưa được xác minh</div>
            <div className="text-sm text-muted-foreground">
              Tài khoản của bạn chưa được xác minh email.
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const navigationKey = `login_${Date.now()}_${Math.random()}`;
                navigate('/email-verification', { 
                  state: { 
                    email: result.email,
                    shouldResendEmail: true,
                    navigationKey
                  } 
                });
                toast.dismiss();
              }}
              className="mt-1"
            >
              Xác minh ngay
            </Button>
          </div>,
          {
            duration: 5000,
          }
        );
      } else if (result.error) {
        toast.error("Đăng nhập thất bại", {
          description: result.error,
        });
      } else {
        login(result.user);
        toast.success("Đăng nhập thành công", {
          description: `Chào mừng ${result.user.email}!`,
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
        description: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Login
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

        // Redirect admin to admin panel
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Đăng nhập
          </h2>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardContent>
            {/* Google Login First */}
            <Button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              variant="outline"
              className="w-full h-12 text-base font-medium mb-4"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {googleLoading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'}
            </Button>

            <div className="relative">
              <Separator className="my-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-muted-foreground text-sm">
                  Hoặc đăng nhập bằng email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit(handleCredentialsLogin)} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername">Email hoặc Tên đăng nhập</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="emailOrUsername"
                    placeholder="Nhập email hoặc tên đăng nhập"
                    className="pl-10"
                    autoComplete="username"
                    {...register('emailOrUsername', {
                      required: 'Vui lòng nhập email hoặc tên đăng nhập!',
                      minLength: {
                        value: 3,
                        message: 'Email hoặc tên đăng nhập phải có ít nhất 3 ký tự'
                      },
                      pattern: {
                        value: /^[^\s]+$/,
                        message: 'Email hoặc tên đăng nhập không được chứa khoảng trắng'
                      }
                    })}
                  />
                </div>
                {errors.emailOrUsername && (
                  <p className="text-sm text-destructive">{errors.emailOrUsername.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu!',
                      minLength: {
                        value: 3,
                        message: 'Mật khẩu phải có ít nhất 3 ký tự'
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label htmlFor="remember" className="text-sm">Ghi nhớ đăng nhập</Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-primary text-sm"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-medium"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            {/* Register Links */}
            <div className="text-center mt-6 pt-4 border-t space-y-3">
              <div className="flex gap-1 justify-center">
                <div className="text-muted-foreground text-sm">
                  Chưa có tài khoản?
                </div>
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <div className="flex gap-1">
            <span>Bằng việc đăng nhập, bạn đồng ý với</span>
            <Link to="/terms" className="text-primary hover:text-primary/80">
              điều khoản sử dụng
            </Link>
            <span>và</span>
            <Link to="/privacy" className="text-primary hover:text-primary/80">
              chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;