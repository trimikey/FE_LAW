import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const PayOSReturn = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Dang xac nhan thanh toan VietQR...');

  const payload = useMemo(() => {
    return {
      orderCode: searchParams.get('orderCode') || '',
      status: searchParams.get('status') || '',
      code: searchParams.get('code') || '',
      cancel: searchParams.get('cancel') || ''
    };
  }, [searchParams]);

  const isMobileReturn = searchParams.get('mobile') === 'true';
  const paymentType = searchParams.get('type') || '';
  const caseId = searchParams.get('caseId') || '';

  const returnPath = useMemo(() => {
    if (paymentType === 'case' && caseId) return `/cases/${caseId}`;
    const path = localStorage.getItem('payos_return_path');
    if (path && path.startsWith('/')) return path;
    return '/dashboard';
  }, [paymentType, caseId]);

  useEffect(() => {
    const run = async () => {
      if (!payload.orderCode) {
        setStatus('error');
        setMessage('Thieu orderCode tu PayOS.');
        return;
      }

      try {
        let res;
        if (paymentType === 'case' || returnPath.includes('/cases/')) {
          res = await api.get(`/cases/payment/verify/${payload.orderCode}`);
        } else {
          res = await api.post('/messages/video-call/payos/confirm', payload);
        }

        if (res.data?.success) {
          setStatus('success');
          setMessage(paymentType === 'case' || returnPath.includes('/cases/')
            ? 'Thanh toán giai đoạn thành công. Vui lòng quay lại vụ việc.'
            : 'Thanh toán thành công. Gói video đã được cộng thêm 1 giờ.'
          );
          localStorage.removeItem('payos_return_path');
          return;
        }
        setStatus('error');
        setMessage('Xác nhận thanh toán thất bại.');
      } catch (error) {
        setStatus('error');
        setMessage(error?.response?.data?.message || 'Xác nhận thanh toán thất bại.');
      }
    };

    run();
  }, [payload, paymentType, returnPath]);

  const deepLink = useMemo(() => {
    const finalStatus = status === 'success' ? 'success' : 'error';
    return `lawyerplatform://payment-result?status=${finalStatus}&type=${encodeURIComponent(paymentType || 'video')}&caseId=${encodeURIComponent(caseId)}&orderCode=${encodeURIComponent(payload.orderCode || '')}`;
  }, [caseId, payload.orderCode, paymentType, status]);

  useEffect(() => {
    if (!isMobileReturn || status === 'processing') return undefined;
    const timer = window.setTimeout(() => {
      window.location.href = deepLink;
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [deepLink, isMobileReturn, status]);

  const textClass =
    status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-slate-700';

  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <div className="bg-white border rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Kết quả thanh toán VietQR</h1>
        <p className={`mb-6 ${textClass}`}>{message}</p>
        <div className="flex flex-col gap-4">
          <Link to={returnPath} className="inline-block px-4 py-2 bg-blue-600 text-white rounded text-center">
            Quay lai trang luật sư
          </Link>
          {(isMobileReturn || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) && (
            <a
              href={deepLink}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded text-center font-bold"
            >
              QUAY LẠI ỨNG DỤNG
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayOSReturn;

