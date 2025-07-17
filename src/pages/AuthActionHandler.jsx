import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';
import { completeRegistration } from '../services/authService';
const AuthActionHandler = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Đang xử lý yêu cầu của bạn...');
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('loading');    
    const hasProcessed = useRef(false);
    
    useEffect(() => {
        if (hasProcessed.current) return;
        
        const mode = searchParams.get('mode');
        const actionCode = searchParams.get('oobCode');
        const handleAction = async () => {
            hasProcessed.current = true;
            if (mode === 'verifyEmail' && actionCode) {
                let firebaseSuccess = false;
                
                try {
                    
                    try {
                        await applyActionCode(auth, actionCode);
                        firebaseSuccess = true;
                    } catch (firebaseError) {
                        firebaseSuccess = false;
                    }
                    
                    const result = await completeRegistration();
                    
                    if (result.error) {
                        toast.error(result.error);
                        setMessage("Đã xảy ra lỗi khi hoàn tất đăng ký. Vui lòng thử lại.");
                        setStatus('error');
                    } else {
                        toast.success('Xác minh email thành công!');
                        setStatus('success');
                        setMessage("Thành công! Đang chuyển hướng bạn đến trang đăng nhập...");
                        setTimeout(() => navigate('/dang-nhap'), 2000);
                    }
                } catch (error) {
                    setStatus('error');
                    setMessage("Liên kết xác minh không hợp lệ hoặc đã hết hạn. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
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
    }, []);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 text-center shadow-sm border border-gray-200 mb-20">
                <h1 className="text-xl font-semibold text-gray-800">
                    Xác Minh Tài Khoản
                </h1>
                
                {status === 'loading' && (
                    <div className="my-6">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600"></div>
                    </div>
                )}
                
                {status === 'success' && (
                    <div className="my-6">
                        <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="my-6">
                        <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                    </div>
                )}
                
                <p className={`mt-2 ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                    {message}
                </p>
            </div>
        </main>
    );
};

export default AuthActionHandler;