import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
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
import { useAuth } from '../context/AuthContext';
import { registerWithEmailVerification } from '@/services/authService';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { user } = useAuth();

    const { register, handleSubmit, formState: { errors }, watch, control, setValue, reset } = useForm({
        defaultValues: {
            displayName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false
        }
    });
    const password = watch('password');
    
    const formData = watch();

    const FORM_STORAGE_KEY = 'register_form_data';

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

    useEffect(() => {
        const savedData = localStorage.getItem(FORM_STORAGE_KEY);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData && typeof parsedData === 'object') {
                    Object.keys(parsedData).forEach(key => {
                        if (parsedData[key] !== undefined && parsedData[key] !== '') {
                            setValue(key, parsedData[key]);
                        }
                    });
                }
            } catch (error) {
                localStorage.removeItem(FORM_STORAGE_KEY);
            }
        }
    }, [setValue]);

    useEffect(() => {
        if (formData && Object.keys(formData).length > 0) {
            const hasData = Object.values(formData).some(value => 
                value !== undefined && value !== '' && value !== false
            );
            
            if (hasData) {
                const { password, confirmPassword, terms, ...dataToSave } = formData;
                localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
            }
        }
    }, [formData]);

    const clearSavedData = () => {
        localStorage.removeItem(FORM_STORAGE_KEY);
    };

    const handleRegister = async (values) => {
        setLoading(true);

        try {
            const normalizedValues = {
                ...values,
                username: values.username.toLowerCase(),
                email: values.email.toLowerCase(),
            };

            if (normalizedValues.password !== normalizedValues.confirmPassword) {
                toast.error("Mật khẩu xác nhận không khớp");
                setLoading(false);
                return;
            }

            const registrationData = {
                ...normalizedValues,
                role: 'student'
            };

            const result = await registerWithEmailVerification(registrationData);
            
            if (result.error) {
                if (result.error.includes('username')) {
                    toast.error("Tên đăng nhập đã được sử dụng", {
                        description: "Vui lòng chọn tên đăng nhập khác"
                    });
                } else if (result.error.includes('email')) {
                    toast.error("Email đã được sử dụng.", {
                        description: "Vui lòng sử dụng email khác hoặc đăng nhập"
                    });
                } else {
                    toast.error(result.error);
                }
                return;
            }
            
            if (result.requiresEmailVerification) {
                if (result.isNewAccount) {
                    toast.success("Tài khoản đã được tạo thành công!", {
                        description: "Vui lòng kiểm tra email để xác minh tài khoản.",
                        duration: 10000,
                    });
                }

                navigate('/xac-minh-email', { 
                    state: { 
                        email: result.email,
                        shouldResendEmail: true 
                    } 
                });
            } else {
                toast.success("Đăng ký thành công!");
                navigate('/dang-nhap');
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi đăng ký", {
                description: "Vui lòng thử lại sau."
            });
        } finally {
            setLoading(false);
        }
        clearSavedData();
        reset();     
    };

    const handleGoToLogin = () => {
        clearSavedData();
        navigate('/dang-nhap');
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
                                <Label htmlFor="displayName">Họ và tên</Label>
                                <div className="relative mt-2">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="displayName"
                                        placeholder="Nguyễn Văn A"
                                        className="pl-10"
                                        {...register('displayName', {
                                            required: 'Vui lòng nhập họ và tên!',
                                            pattern: {
                                                value: /^[A-ZÀ-Ỹ][a-zà-ỹ]+( [A-ZÀ-Ỹ][a-zà-ỹ]+)+$/,
                                                message: 'Vui lòng nhập tên hợp lệ'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.displayName && (
                                    <p className="text-sm text-destructive mt-1">{errors.displayName.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="username">Tên đăng nhập</Label>
                                <div className="relative mt-2">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="username"
                                        placeholder="username"
                                        className="pl-10"
                                        {...register('username', {
                                            required: 'Vui lòng nhập tên đăng nhập!',
                                            minLength: {
                                                value: 6,
                                                message: 'Tên đăng nhập phải có ít nhất 6 ký tự'
                                            },
                                            pattern:{
                                                value: /^[a-zA-Z0-9]+$/,
                                                message: 'Tên đăng nhập chỉ được chứa chữ cái và số'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-sm text-destructive mt-1">{errors.username.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <div className="relative mt-2">
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
                                <div className="relative mt-2">
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
                                            },
                                            pattern: {
                                                value: /^\S+$/,
                                                message: 'Mật khẩu không được chứa khoảng trắng'
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
                                <div className="relative mt-2">
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
                                    <Controller
                                      name="terms"
                                      control={control}
                                      rules={{ required: 'Vui lòng đồng ý với điều khoản sử dụng và chính sách bảo mật' }}
                                      className="text-sm"
                                      render={({ field }) => (
                                        <Checkbox
                                          id="terms"
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      )}
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

                        <div className="text-center mt-6 pt-4 border-t">
                            <div className="text-muted-foreground text-sm">
                                Đã có tài khoản?{' '}
                                <button
                                    onClick={handleGoToLogin}
                                    className="text-primary hover:text-primary/80 font-medium cursor-pointer"
                                >
                                    Đăng nhập ngay
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;