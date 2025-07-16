import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';

const AuthActionHandler = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Đang xử lý...');

    useEffect(() => {
        const mode = searchParams.get('mode');
        const actionCode = searchParams.get('oobCode');

        const handleAction = async () => {
            if (mode === 'verifyEmail' && actionCode) {
                try {
                    await applyActionCode(auth, actionCode);
                    toast.success("Xác minh email thành công!");
                    setMessage("Thành công! Đang chuyển hướng bạn...");
                    setTimeout(() => navigate('/dang-nhap'), 3000);
                } catch (error) {
                    toast.error("Liên kết xác minh không hợp lệ hoặc đã hết hạn.");
                    setMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
                }
            } else {
                navigate('/');
            }
        };

        handleAction();
    }, [searchParams, navigate]);

    return (
        <div>
            <h1>Xác minh tài khoản</h1>
            <p>{message}</p>
        </div>
    );
};

export default AuthActionHandler;