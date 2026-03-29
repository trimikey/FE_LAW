import React, { useState, useEffect, useRef } from 'react';
import { HiX, HiCheckCircle, HiInformationCircle, HiLightningBolt, HiPencilAlt, HiSave, HiOutlineCash, HiUpload, HiPaperClip, HiDownload, HiTrash } from 'react-icons/hi';
import { CASE_STEP_DETAILS } from '../../constants/caseSteps';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CaseStepDetailModal = ({ step, caseData, onUpdateCase, onClose }) => {
    const { user } = useAuth();
    const isClient = user?.role_name === 'client';
    const fileInputRef = useRef(null);

    const [intakeAnswers, setIntakeAnswers] = useState({
        q1: '',
        q2: '',
        q3: '',
        notif_tax: false,
        notif_invite: false,
        notif_penalty: false
    });
    const [clientResponse, setClientResponse] = useState('');
    const [clientData, setClientData] = useState({});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (caseData?.intake_data) {
            setIntakeAnswers(prev => ({
                ...prev,
                ...caseData.intake_data
            }));
        }
        if (step?.client_response) {
            setClientResponse(step.client_response);
        } else {
            setClientResponse('');
        }
        if (step?.client_data) {
            setClientData(step.client_data);
        } else {
            setClientData({});
        }
    }, [caseData, step]);

    if (!step) return null;

    const stepNameKey = (step.step_name || '').toUpperCase().trim();
    const isIntakeStep = stepNameKey === 'INTAKE';

    // Tìm kiếm details dựa trên key chính xác hoặc alias
    let details = CASE_STEP_DETAILS[stepNameKey];

    if (!details) {
        // Nếu không khớp chính xác, thử tìm kiếm mờ (phòng trường hợp dịch thuật hoặc typo)
        const matchedKey = Object.keys(CASE_STEP_DETAILS).find(k =>
            stepNameKey.includes(k) || k.includes(stepNameKey)
        );
        details = CASE_STEP_DETAILS[matchedKey] || CASE_STEP_DETAILS['INTAKE'];
    }

    const handleSaveIntake = async () => {
        try {
            setSaving(true);
            await api.patch(`/client/cases/${caseData.id}/intake`, {
                intakeData: intakeAnswers
            });
            toast.success('Đã lưu thông tin Intake');
            if (onUpdateCase) onUpdateCase();
            onClose();
        } catch (error) {
            toast.error('Lỗi khi lưu thông tin');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveResponse = async () => {
        try {
            setSaving(true);
            await api.patch(`/cases/${caseData.id}/steps/${step.id}/response`, {
                clientResponse,
                clientData
            });
            toast.success('Đã gửi phản hồi thành công');
            if (onUpdateCase) onUpdateCase();
        } catch (error) {
            toast.error('Lỗi khi gửi phản hồi');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('caseId', caseData.id);
            formData.append('caseStepId', step.id);
            formData.append('category', 'evidence');

            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            await api.post('/documents/upload/multiple', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Đã upload tài liệu thành công');
            if (onUpdateCase) onUpdateCase();
        } catch (error) {
            toast.error('Lỗi khi upload tài liệu');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownload = async (doc) => {
        try {
            const response = await api.get(`/documents/${doc.id}/download`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.file_name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Lỗi khi tải xuống tài liệu');
        }
    };

    const handleDeleteFile = async (documentId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
        try {
            await api.delete(`/documents/${documentId}`);
            toast.success('Đã xóa tài liệu');
            if (onUpdateCase) onUpdateCase();
        } catch (error) {
            toast.error('Lỗi khi xóa tài liệu');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#041837]/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-[50px] shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-slate-50">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Chi tiết giai đoạn</span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Bước {step.step_order}</span>
                        </div>
                        <h2 className="text-3xl font-black text-[#041837] tracking-tight uppercase">{details.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{details.subtitle}</p>
                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${caseData?.payment_mode === 'step_by_step' ? 'bg-indigo-50 text-indigo-500' : 'bg-pink-50 text-pink-500'}`}>
                                {caseData?.payment_mode === 'step_by_step' ? 'Trả theo giai đoạn' : 'Trả trọn gói'}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                        <HiX size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 space-y-12">
                    {/* Objective */}
                    <div className="bg-amber-50 rounded-[32px] p-8 border border-amber-100/50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg">
                                <HiInformationCircle size={24} />
                            </div>
                            <h3 className="text-lg font-black text-[#041837] uppercase tracking-tight">Mục tiêu giai đoạn</h3>
                        </div>
                        <p className="text-amber-900 font-bold text-xl leading-relaxed">{details.objective}</p>
                    </div>

                    {/* Interaction Section (Feedback & Upload) */}
                    {!isIntakeStep && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Feedback Column */}
                            <div className="lg:col-span-3 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="flex items-center gap-3 text-sm font-black text-[#041837] uppercase tracking-widest">
                                        <span className="h-6 w-1.5 rounded-full bg-amber-500" />
                                        Ghi chú / Thắc mắc chung
                                    </h4>
                                    {isClient && (
                                        <button
                                            onClick={handleSaveResponse}
                                            disabled={saving}
                                            className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 hover:text-amber-700 disabled:opacity-50"
                                        >
                                            {saving ? 'Đang lưu...' : 'Lưu tất cả'}
                                            <HiSave className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <textarea
                                        value={clientResponse}
                                        onChange={(e) => setClientResponse(e.target.value)}
                                        readOnly={!isClient}
                                        placeholder={isClient ? "Nhập ý kiến, thắc mắc tổng quát cho giai đoạn này..." : "Khách hàng chưa để lại phản hồi nào."}
                                        className="w-full min-h-[140px] bg-slate-50 p-6 rounded-[32px] border border-slate-100 text-[#041837] font-bold text-sm outline-none focus:border-amber-400 focus:bg-white transition-all shadow-inner resize-none group-hover:bg-white group-hover:border-slate-200"
                                    />
                                    {isClient && (
                                        <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <HiPencilAlt className="h-6 w-6 text-amber-500" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Documents Column */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="flex items-center gap-3 text-sm font-black text-[#041837] uppercase tracking-widest">
                                        <span className="h-6 w-1.5 rounded-full bg-blue-500" />
                                        Tài liệu giai đoạn
                                    </h4>
                                    {isClient && (
                                        <div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                multiple
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                {uploading ? (
                                                    <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <HiUpload className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                    {step.stepDocuments && step.stepDocuments.length > 0 ? (
                                        step.stepDocuments.map((doc, idx) => (
                                            <div key={idx} className="group bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all">
                                                <div className="flex items-center gap-3 truncate">
                                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                        <HiPaperClip className="h-5 w-5" />
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="text-[11px] font-black text-[#041837] truncate uppercase tracking-tight">{doc.file_name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Bởi: {doc.uploader?.full_name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDownload(doc)}
                                                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-all"
                                                    >
                                                        <HiDownload size={18} />
                                                    </button>
                                                    {isClient && doc.uploaded_by === user.id && (
                                                        <button
                                                            onClick={() => handleDeleteFile(doc.id)}
                                                            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                                                        >
                                                            <HiTrash size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 px-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
                                            <HiPaperClip className="h-8 w-8 text-slate-200 mb-2" />
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Chưa có tài liệu đính kèm</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Status Banner */}
                    {step.fee_amount > 0 && (
                        <div className={`p-8 rounded-[32px] border ${step.payment_status === 'paid' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg ${step.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                        <HiOutlineCash size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-black uppercase tracking-tight ${step.payment_status === 'paid' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            Chi phí giai đoạn này: {Number(step.fee_amount).toLocaleString('vi-VN')} đ
                                        </h3>
                                        <p className={`text-xs font-bold uppercase tracking-widest ${step.payment_status === 'paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            Trạng thái: {step.payment_status === 'paid' ? 'ĐÃ QUYẾT TOÁN' : 'CHƯA THANH TOÁN'}
                                        </p>
                                    </div>
                                </div>
                                {isClient && caseData?.payment_mode === 'step_by_step' && step.payment_status === 'unpaid' && (
                                    <button
                                        onClick={() => {
                                            // Gọi hàm thanh toán từ props hoặc cha
                                            if (window.handleGlobalStepPayment) {
                                                window.handleGlobalStepPayment(step);
                                            } else {
                                                toast.error('Vui lòng thực hiện thanh toán tại trang chi tiết vụ việc');
                                            }
                                        }}
                                        className="px-8 py-4 bg-[#041837] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                                    >
                                        Thanh toán ngay
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Main Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(details.actions || details.sections || []).map((section, idx) => {
                            const isIntakeForm = isIntakeStep && isClient;
                            const sectionLabelLower = section.label.toLowerCase();
                            const isInteractiveSection =
                                sectionLabelLower.includes('người dân') ||
                                sectionLabelLower.includes('phối hợp') ||
                                sectionLabelLower.includes('chuẩn bị') ||
                                sectionLabelLower.includes('cần làm') ||
                                sectionLabelLower.includes('thực tế') ||
                                (sectionLabelLower.includes('bước') && !isIntakeStep);

                            return (
                                <div key={idx} className="space-y-6">
                                    <h4 className="flex items-center gap-3 text-sm font-black text-[#041837] uppercase tracking-widest">
                                        <span className="h-6 w-1.5 rounded-full bg-blue-500" />
                                        {section.label}
                                    </h4>

                                    {section.details && (
                                        <div className="space-y-3">
                                            {section.details.map((item, i) => {
                                                if (isIntakeForm) {
                                                    // Mapping logic for Intake form inputs (Old legacy logic for compatibility)
                                                    if (section.label.includes('Bước 1')) {
                                                        const fieldKeys = ['q1', 'q2', 'q3'];
                                                        return (
                                                            <div key={i} className="flex flex-col gap-2">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{item}</label>
                                                                <input
                                                                    type="text"
                                                                    value={intakeAnswers[fieldKeys[i]]}
                                                                    onChange={(e) => setIntakeAnswers(prev => ({ ...prev, [fieldKeys[i]]: e.target.value }))}
                                                                    placeholder={`Nhập thông tin tại đây...`}
                                                                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-bold text-[#041837] outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                    if (section.label.includes('Bước 3')) {
                                                        const fieldKeys = ['notif_tax', 'notif_invite', 'notif_penalty'];
                                                        return (
                                                            <button
                                                                key={i}
                                                                onClick={() => setIntakeAnswers(prev => ({ ...prev, [fieldKeys[i]]: !prev[fieldKeys[i]] }))}
                                                                className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all ${intakeAnswers[fieldKeys[i]] ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                                            >
                                                                <span className="text-sm font-black uppercase tracking-tight">{item}</span>
                                                                {intakeAnswers[fieldKeys[i]] ? <HiCheckCircle className="h-6 w-6" /> : <div className="h-6 w-6 rounded-full border-2 border-slate-200" />}
                                                            </button>
                                                        );
                                                    }
                                                }

                                                // General Interactive Section Logic
                                                if (isClient && isInteractiveSection) {
                                                    const cleanItem = item.replace(/^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?️\s]+/, '').trim();
                                                    return (
                                                        <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 group-within:border-amber-400 group-within:bg-white transition-all">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                                {item}
                                                            </label>
                                                            <textarea
                                                                rows={1}
                                                                value={clientData[cleanItem] || ''}
                                                                onChange={(e) => setClientData(prev => ({ ...prev, [cleanItem]: e.target.value }))}
                                                                placeholder="Nhập nội dung giải trình / thông tin tại đây..."
                                                                className="w-full bg-transparent text-xs font-bold text-[#041837] outline-none resize-none overflow-hidden"
                                                                onInput={(e) => {
                                                                    e.target.style.height = 'auto';
                                                                    e.target.style.height = e.target.scrollHeight + 'px';
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                }

                                                // Static view (or for Lawyer)
                                                const fieldKeys = section.label.includes('Bước 1') ? ['q1', 'q2', 'q3'] : (section.label.includes('Bước 3') ? ['notif_tax', 'notif_invite', 'notif_penalty'] : []);
                                                const intakeVal = isIntakeStep ? intakeAnswers[fieldKeys[i]] : null;

                                                const cleanItem = item.replace(/^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?️\s]+/, '').trim();
                                                const savedVal = clientData[cleanItem];

                                                return (
                                                    <div key={i} className={`flex flex-col gap-2 p-4 rounded-2xl border transition-all ${(intakeVal || savedVal) ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                                        <div className="flex items-start gap-3">
                                                            {(intakeVal || savedVal) ? <HiCheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" /> : <HiCheckCircle className="h-5 w-5 text-slate-200 shrink-0 mt-0.5" />}
                                                            <div className="flex-1">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{item}</span>
                                                                {isIntakeStep && fieldKeys[i]?.startsWith('q') && intakeVal && (
                                                                    <p className="text-sm font-black text-[#041837] animate-in fade-in slide-in-from-left-2">{intakeVal}</p>
                                                                )}
                                                                {isIntakeStep && fieldKeys[i]?.startsWith('notif') && (
                                                                    <p className={`text-[10px] font-black ${intakeVal ? 'text-emerald-600' : 'text-slate-300'}`}>
                                                                        {intakeVal ? 'ĐÃ NHẬN THÔNG BÁO' : 'CHƯA CÓ THÔNG BÁO'}
                                                                    </p>
                                                                )}
                                                                {savedVal && (
                                                                    <p className="text-sm font-black text-[#041837] animate-in fade-in slide-in-from-left-2">{savedVal}</p>
                                                                )}
                                                                {!isIntakeStep && !savedVal && <span className="text-sm font-bold text-slate-600">{item}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {section.table && (
                                        <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-[#041837] text-white">
                                                    <tr>
                                                        {section.table.headers.map((h, i) => (
                                                            <th key={i} className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {section.table.rows.map((row, i) => (
                                                        <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                                                            {row.map((cell, j) => (
                                                                <td key={j} className="px-6 py-4 font-bold text-slate-600">{cell}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Output Section */}
                    {details.output && (
                        <div className="bg-[#041837] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <HiLightningBolt size={120} />
                            </div>
                            <div className="relative z-10 text-center md:text-left">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-8">Kết quả đầu ra dự kiến (Output)</h3>
                                <div className="flex flex-wrap gap-4">
                                    {details.output.map((out, i) => (
                                        <div key={i} className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                                            <HiCheckCircle className="text-amber-500 h-5 w-5" />
                                            <span className="font-black uppercase tracking-tight text-sm">{out}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center px-10">
                    <div className="flex items-center gap-2 text-slate-400">
                        <HiInformationCircle className="h-5 w-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Mọi câu trả lời được bảo mật tuyệt đối</span>
                    </div>
                    {isIntakeStep && isClient ? (
                        <button
                            onClick={handleSaveIntake}
                            disabled={saving}
                            className="flex items-center gap-3 px-10 py-5 bg-amber-500 text-[#041837] rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-white active:scale-95 transition-all shadow-xl shadow-amber-500/10 disabled:opacity-50"
                        >
                            {saving ? 'Đang lưu...' : 'Lưu thông tin và hoàn tất'}
                            <HiSave className="h-5 w-5" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                            {!isIntakeStep && isClient && (
                                <button
                                    onClick={handleSaveResponse}
                                    disabled={saving}
                                    className="px-8 py-5 bg-amber-500 text-[#041837] rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-amber-600 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                                >
                                    {saving ? 'Đang gửi phản hồi' : 'Gửi tất cả phản hồi'}
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-12 py-5 bg-[#041837] text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-black active:scale-95 transition-all shadow-xl"
                            >
                                Tôi đã hiểu
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaseStepDetailModal;
