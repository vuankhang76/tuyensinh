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
            } else {
                navigate('/');
            }
        };

        handleAction();
    }, [searchParams, navigate]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 font-sans">
            <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg transition duration-300 hover:shadow-2xl">
                
                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    Xác Minh Tài Khoản
                </h1>

                {isLoading && (
                    <div className="my-7">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                    </div>
                )}
                
                <p className="mt-4 text-base text-slate-600">
                    {message}
                </p>

            </div>
        </main>
    );
};

export default AuthActionHandler;