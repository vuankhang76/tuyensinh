import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    Mail
} from 'lucide-react';
import { toast } from 'sonner';
const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch('password');

    // Handle Registration
    const handleRegister = async (values) => {
        setLoading(true);

        try {
            // Validate password confirmation
            if (values.password !== values.confirmPassword) {
                toast.error("Mật khẩu xác nhận không khớp");
                return;
            }

            // In real app, call API to register
            console.log('Registration:', values);

            toast.success("Đăng ký thành công!", {
                description: "Tài khoản đã được tạo. Vui lòng đăng nhập.",
            });

            navigate('/login');

        } catch (error) {
            toast.error("Có lỗi xảy ra khi đăng ký", {
                description: "Vui lòng thử lại sau."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-foreground">
                        Đăng ký tài khoản
                    </h2>
                </div>

                {/* Registration Form */}
                <Card className="shadow-lg">
                    <CardContent>
                        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
                            <div>
                                <Label htmlFor="fullName">Họ và tên</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="fullName"
                                        placeholder="Nguyễn Văn A"
                                        className="pl-10"
                                        {...register('fullName', {
                                            required: 'Vui lòng nhập họ và tên!',
                                            minLength: {
                                                value: 3,
                                                message: 'Họ và tên phải có ít nhất 3 ký tự'
                                            },
                                            pattern: {
                                                value: /^[a-zA-ZÀ-ỹ\s]+$/,
                                                message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        className="pl-10"
                                        {...register('email', {
                                            required: 'Vui lòng nhập email!',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Email không hợp lệ'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password">Mật khẩu</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        className="pl-10 pr-10"
                                        {...register('password', {
                                            required: 'Vui lòng nhập mật khẩu!',
                                            minLength: {
                                                value: 6,
                                                message: 'Mật khẩu phải có ít nhất 6 ký tự'
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
                                    <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Nhập lại mật khẩu"
                                        className="pl-10 pr-10"
                                        {...register('confirmPassword', {
                                            required: 'Vui lòng xác nhận mật khẩu!',
                                            validate: (value) =>
                                                value === password || 'Mật khẩu xác nhận không khớp'
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-1">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="terms"
                                        {...register('terms', {
                                            required: 'Bạn phải đồng ý với điều khoản sử dụng'
                                        })}
                                    />
                                    <div className="text-[13px] space-x-1">
                                        <span>Tôi đồng ý với</span>
                                        <Link to="/terms" className="text-primary hover:text-primary/80">
                                            điều khoản sử dụng
                                        </Link>
                                        <span>và</span>
                                        <Link to="/privacy" className="text-primary hover:text-primary/80">
                                            chính sách bảo mật
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {errors.terms && (
                                <p className="text-sm text-destructive">{errors.terms.message}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 text-base font-medium"
                            >
                                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                            </Button>
                        </form>

                        {/* Login Link */}
                        <div className="text-center mt-6 pt-4 border-t">
                            <div className="text-muted-foreground text-sm">
                                Đã có tài khoản?{' '}
                                <Link
                                    to="/login"
                                    className="text-primary hover:text-primary/80 font-medium"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;