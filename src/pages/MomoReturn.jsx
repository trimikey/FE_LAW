import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const MomoReturn = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Dang xac nhan thanh toan MoMo...');

  const payload = useMemo(() => {
    return {
      orderId: searchParams.get('orderId') || '',
      resultCode: searchParams.get('resultCode') || '',
      transId: searchParams.get('transId') || ''
    };
  }, [searchParams]);

  const returnPath = useMemo(() => {
    const path = localStorage.getItem('momo_return_path');
    if (path && path.startsWith('/')) return path;
    return '/dashboard';
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!payload.orderId) {
        setStatus('error');
        setMessage('Thieu orderId tu MoMo.');
        return;
      }

      try {
        const res = await api.post('/messages/video-call/momo/confirm', payload);
        if (res.data?.success) {
          setStatus('success');
          setMessage('Thanh toan thanh cong. Goi video da duoc cong them 1 gio.');
          localStorage.removeItem('momo_return_path');
          return;
        }
        setStatus('error');
        setMessage('Xac nhan thanh toan that bai.');
      } catch (error) {
        setStatus('error');
        setMessage(error?.response?.data?.message || 'Xac nhan thanh toan that bai.');
      }
    };

    run();
  }, [payload]);

  const textClass = status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-slate-700';

  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <div className="bg-white border rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Kết quả thanh toán MoMo</h1>
        <p className={`mb-6 ${textClass}`}>{message}</p>
        <Link to={returnPath} className="inline-block px-4 py-2 bg-blue-600 text-white rounded">
          Quay lai trang luật sư
        </Link>
      </div>
    </div>
  );
};

export default MomoReturn;
