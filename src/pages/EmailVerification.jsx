import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { checkEmailVerificationStatus, completeRegistration, resendVerificationEmail } from '@/services/authService';

const RESEND_COOLDOWN_SECONDS = 60;

const EmailVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [email, setEmail] = useState('');

    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const emailFromState = location.state?.email;
        const shouldResendEmail = location.state?.shouldResendEmail;
        const navigationKey = location.state?.navigationKey;

        let userEmail = '';
        if (emailFromState) {
            userEmail = emailFromState;
        } else {
            navigate('/register');
            return;
        }
        setEmail(userEmail);

        const lastSentTime = localStorage.getItem(`resend_timestamp_${userEmail}`);

        if (lastSentTime) {
            const timePassed = (Date.now() - parseInt(lastSentTime)) / 1000;
            if (timePassed < RESEND_COOLDOWN_SECONDS) {
                setCooldown(Math.round(RESEND_COOLDOWN_SECONDS - timePassed));
            }
        }

        const processedKey = `processed_${navigationKey}`;
        const hasProcessed = localStorage.getItem(processedKey);

        if (shouldResendEmail && userEmail && navigationKey && !hasProcessed) {
            localStorage.setItem(processedKey, 'true');

            setTimeout(() => {
                handleResendEmailAutomatic(userEmail);
            }, 500);
        }
    }, [location.state, navigate]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);


    const handleCheckVerification = async () => {
        setIsChecking(true);
        try {
            const isVerified = await checkEmailVerificationStatus();

            if (isVerified) {
                await handleCompleteRegistration();
            } else {
                toast.warning('Email chưa được xác minh. Vui lòng kiểm tra hộp thư và nhấp vào link xác minh.');
            }
        } catch (error) {
            console.error('Error checking verification:', error);
            toast.error('Có lỗi xảy ra khi kiểm tra xác minh email');
        } finally {
            setIsChecking(false);
        }
    };

    const handleCompleteRegistration = async () => {
        setIsCompleting(true);
        try {
            const result = await completeRegistration();
            if (result.error) {
                toast.error(result.error);
                setIsCompleting(false);
                return;
            }
            toast.success('Đăng ký thành công!', {
                description: 'Vui lòng đăng nhập để tiếp tục!'
            });
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Error completing registration:', error);
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.errors ||
                'Có lỗi xảy ra khi hoàn tất đăng ký';
            if (typeof errorMessage === 'object') {
                const validationErrors = Object.values(errorMessage).flat();
                toast.error('Lỗi xác thực', {
                    description: validationErrors.join(', ')
                });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsCompleting(false);
        }
    };

    const handleResendEmail = async () => {
        if (cooldown > 0 || !email) return;

        toast.info('Đang gửi email...');
        try {
            const result = await resendVerificationEmail();
            if (result.success) {
                toast.success('Đã gửi lại email xác minh!');
                localStorage.setItem(`resend_timestamp_${email}`, Date.now().toString());
                setCooldown(RESEND_COOLDOWN_SECONDS);
            } else {
                toast.error(result.error || 'Gửi lại email thất bại.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra.');
        }
    };

    // Hàm tự động gửi email khi được chuyển hướng từ login
    const handleResendEmailAutomatic = async (userEmail) => {
        console.log('🚀 Tự động gửi lại email verification cho:', userEmail);
        toast.info('Đang gửi lại email xác minh...');
        try {
            const result = await resendVerificationEmail();
            console.log('📧 Kết quả gửi email:', result);

            if (result.success) {
                toast.success('Đã gửi lại email xác minh!', {
                    description: 'Vui lòng kiểm tra hộp thư để xác minh tài khoản.'
                });
                // Cập nhật timestamp và cooldown cho lần gửi tiếp theo
                localStorage.setItem(`resend_timestamp_${userEmail}`, Date.now().toString());
                setCooldown(RESEND_COOLDOWN_SECONDS);
            } else {
                console.error('❌ Gửi email thất bại:', result.error);
                toast.error(result.error || 'Gửi lại email thất bại.');
            }
        } catch (error) {
            console.error('❌ Lỗi khi gửi email:', error);
            toast.error('Có lỗi xảy ra khi gửi email.');
        }
    };

    const handleBackToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">
                        Xác minh Email
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Vui lòng kiểm tra email để hoàn tất đăng ký
                    </p>
                </div>

                {/* Verification Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <div className="flex flex-col text-center text-lg">
                            <span className="text-lg">Chúng tôi đã gửi link xác minh đến email</span>
                            <strong>{email}</strong>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p>• Kiểm tra hộp thư đến (và cả thư mục spam)</p>
                            <p>• Nhấp vào link xác minh trong email</p>
                            <p>• Quay lại trang này và nhấn "Kiểm tra xác minh"</p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handleCheckVerification}
                                disabled={isChecking || isCompleting || cooldown > 0}
                                className="w-full"
                            >
                                {isChecking ? (
                                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Đang kiểm tra...</>
                                ) : isCompleting ? (
                                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Đang hoàn tất đăng ký...</>
                                ) : (
                                    <><CheckCircle className="mr-2 h-4 w-4" /> Kiểm tra xác minh</>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleBackToRegister}
                                disabled={isChecking || isCompleting}
                                className="w-full"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Quay lại đăng ký
                            </Button>
                        </div>

                        {/* CẬP NHẬT: Thay thế khối văn bản tĩnh bằng nút có tương tác */}
                        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                            <p className="mb-1">Không nhận được email?</p>
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold text-primary"
                                onClick={handleResendEmail}
                                disabled={cooldown > 0 || isChecking || isCompleting}
                            >
                                {cooldown > 0
                                    ? `Gửi lại sau ${cooldown} giây`
                                    : 'Gửi lại email xác minh'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmailVerification;