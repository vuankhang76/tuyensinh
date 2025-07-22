import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { resendVerificationEmail } from '@/services/authService';

const RESEND_COOLDOWN_SECONDS = 60;

const EmailVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
            navigate('/dang-ky');
            return;
        }
        setEmail(userEmail);

        const lastSentTime = localStorage.getItem(`resend_timestamp_${userEmail}`);
        const currentTime = Date.now();

        if (lastSentTime) {
            const timePassed = (currentTime - parseInt(lastSentTime)) / 1000;
            if (timePassed < RESEND_COOLDOWN_SECONDS) {
                setCooldown(Math.round(RESEND_COOLDOWN_SECONDS - timePassed));
            } else {
                setCooldown(RESEND_COOLDOWN_SECONDS);
                localStorage.setItem(`resend_timestamp_${userEmail}`, currentTime.toString());
            }
        } else {
            setCooldown(RESEND_COOLDOWN_SECONDS);
            localStorage.setItem(`resend_timestamp_${userEmail}`, currentTime.toString());
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
            const errorMessage = error?.response?.data?.message || error?.message || '';
            if (errorMessage.includes('too-many-requests') || error?.code === 'auth/too-many-requests') {
                toast.error('Quá nhiều yêu cầu. Vui lòng đợi và thử lại sau.');
            } else {
                toast.error('Có lỗi xảy ra.');
            }
        }
    };

    const handleResendEmailAutomatic = async (userEmail) => {
        toast.info('Đang gửi lại email xác minh...');
        try {
            const result = await resendVerificationEmail();
            if (result.success) {
                toast.success('Đã gửi lại email xác minh!', {
                    description: 'Vui lòng kiểm tra hộp thư để xác minh tài khoản.'
                });
                localStorage.setItem(`resend_timestamp_${userEmail}`, Date.now().toString());
                setCooldown(RESEND_COOLDOWN_SECONDS);
            } else {
                if (result.error && result.error.includes('Quá nhiều yêu cầu')) {
                    toast.error('Quá nhiều yêu cầu. Vui lòng đợi và thử lại sau.');
                } else {
                    toast.error(result.error || 'Gửi lại email thất bại.');
                }
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || '';
            if (errorMessage.includes('too-many-requests') || 
                error?.code === 'auth/too-many-requests' || 
                errorMessage.includes('Quá nhiều yêu cầu')) {
                toast.error('Quá nhiều yêu cầu. Vui lòng đợi và thử lại sau.');
            } else {
                toast.error('Có lỗi xảy ra khi gửi email.');
            }
        }
    };

    const handleBackToRegister = () => {
        navigate('/dang-ky');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
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
                            <p>• Sau khi nhấp link, bạn sẽ được chuyển hướng tự động</p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                onClick={handleBackToRegister}
                                className="w-full"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Quay lại đăng ký
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                            <p className="mb-1">Không nhận được email?</p>
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold text-primary"
                                onClick={handleResendEmail}
                                disabled={cooldown > 0}
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