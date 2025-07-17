import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';
const AuthActionHandler = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Đang xử lý yêu cầu của bạn...');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const mode = searchParams.get('mode');
        const actionCode = searchParams.get('oobCode');
        const handleAction = async () => {
            if (mode === 'verifyEmail' && actionCode) {
                try {
                    await applyActionCode(auth, actionCode);
                    toast.success("Xác minh email thành công!");
                    setMessage("Thành công! Đang chuyển hướng bạn đến trang đăng nhập...");
                    setTimeout(() => navigate('/dang-nhap'), 3000);
                } catch (error) {
                    toast.error("Liên kết xác minh không hợp lệ hoặc đã hết hạn.");
                    setMessage("Đã xảy ra lỗi. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
                } finally {
                    setIsLoading(false);
                }
            } else if (mode === 'resetPassword' && actionCode) {
                navigate(`/dat-lai-mat-khau?mode=${mode}&oobCode=${actionCode}`);
            } else {
                navigate('/');
            }
        };

        handleAction();
    }, [searchParams, navigate]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 text-center shadow-sm border border-gray-200 mb-20">
                <h1 className="text-xl font-semibold text-gray-800">
                    Xác Minh Tài Khoản
                </h1>
                {isLoading && (
                    <div className="my-6">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600"></div>
                    </div>
                )}
                
                <p className="mt-2 text-gray-600">
                    {message}
                </p>

            </div>
        </main>
    );
};

export default AuthActionHandler;