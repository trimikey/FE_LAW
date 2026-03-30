import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiDotsVertical,
  HiOutlineEmojiHappy,
  HiOutlineInformationCircle,
  HiOutlinePaperClip,
  HiOutlinePlusCircle,
  HiOutlineSearch,
  HiOutlineVideoCamera,
  HiDownload,
  HiOutlineArrowRight,
  HiOutlineDocumentText,
  HiChatAlt2,
  HiPaperAirplane,
  HiUserGroup,
  HiChevronRight,
  HiCheckCircle
} from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useVideoCall } from '../../contexts/VideoCallContext';
import api from '../../services/api';
import { resolveAvatarUrl } from '../../utils/avatar';

const getInitials = (name) => {
  const safe = (name || 'User').trim();
  const parts = safe.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return safe.slice(0, 2).toUpperCase();
};

const formatMessageTime = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const formatDayLabel = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return `HÔM NAY, ${date.getDate()} THÁNG ${date.getMonth() + 1}`;
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).toUpperCase();
};

const MessageCenter = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { startCall } = useVideoCall();
  const currentUserId = Number(user?.id || 0);
  const preferredPartnerId = Number(searchParams.get('partner') || 0);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const [conversations, setConversations] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [relatedCase, setRelatedCase] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);

  const socket = useSocket();
  const messagesEndRef = useRef(null);
  const selectedPartnerIdRef = useRef(null);

  const normalizeConversations = useCallback(
    (items = []) =>
      items.map((item) => ({
        ...item,
        partnerAvatar: resolveAvatarUrl(item.partnerAvatar)
      })),
    []
  );

  const selectedConversation = useMemo(
    () => conversations.find((item) => Number(item.partnerId) === Number(selectedPartnerId)) || null,
    [conversations, selectedPartnerId]
  );

  const filteredConversations = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return conversations;
    return conversations.filter((c) =>
      (c.partnerName || '').toLowerCase().includes(keyword) ||
      (c.lastMessage || '').toLowerCase().includes(keyword)
    );
  }, [conversations, searchKeyword]);

  const timelineItems = useMemo(() => {
    const items = [];
    let currentLabel = '';
    messages.forEach((m) => {
      const label = formatDayLabel(m.created_at);
      if (label !== currentLabel) {
        currentLabel = label;
        items.push({ type: 'divider', id: `divider-${label}`, label });
      }
      items.push({ type: 'message', id: m.id || `${m.sender_id}-${m.created_at}`, message: m });
    });
    return items;
  }, [messages]);

  useEffect(() => { selectedPartnerIdRef.current = selectedPartnerId; }, [selectedPartnerId]);

  const refreshConversations = useCallback(async () => {
    try {
      const response = await api.get('/messages/conversations');
      const data = normalizeConversations(response.data?.data || []).map(c =>
        Number(c.partnerId) === Number(selectedPartnerId) ? { ...c, unreadCount: 0 } : c
      );
      setConversations(data);
      if (!selectedPartnerId && data.length > 0) {
        const initial = preferredPartnerId && data.find(c => Number(c.partnerId) === preferredPartnerId) ? preferredPartnerId : data[0].partnerId;
        setSelectedPartnerId(initial);
      }
    } catch (e) { }
  }, [selectedPartnerId, preferredPartnerId, normalizeConversations]);

  const fetchHistory = useCallback(async (partnerId) => {
    if (!partnerId) return;
    try {
      setLoadingMessages(true);
      const response = await api.get(`/messages/history/${partnerId}`);
      setMessages(response.data?.data || []);
    } catch (e) { toast.error('Lỗi tải tin nhắn'); } finally { setLoadingMessages(false); }
  }, []);

  const markAsRead = useCallback(async (partnerId) => {
    if (!partnerId) return;
    try {
      await api.patch(`/messages/read/${partnerId}`);
      setConversations(prev => prev.map(c =>
        Number(c.partnerId) === Number(partnerId) ? { ...c, unreadCount: 0 } : c
      ));
      if (onRefreshRef.current) onRefreshRef.current();
    } catch (e) { console.error('Error marking as read:', e); }
  }, []);

  const loadCaseContext = useCallback(async (partnerId) => {
    if (!partnerId) return;
    try {
      const endpoint = user.role_name === 'lawyer' ? '/lawyer/cases' : '/client/cases';
      const response = await api.get(endpoint);
      const matched = (response.data?.data?.cases || []).find(c => Number(user.role_name === 'lawyer' ? (c.client?.id || c.client_id) : (c.lawyer?.id || c.lawyer_id)) === Number(partnerId));
      if (matched) {
        setRelatedCase({ ...matched, code: `#LAW-2024-${String(matched.id).padStart(5, '0')}`, status: 'Đang xử lý', documents: [] });
        const detail = await api.get(`/cases/${matched.id}`);
        setRelatedCase(prev => ({ ...prev, documents: detail.data?.data?.documents || [] }));
      } else setRelatedCase(null);
    } catch (e) { setRelatedCase(null); }
  }, [user.role_name]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshConversations();
      const interval = setInterval(refreshConversations, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshConversations]);

  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    socket.on('receive_message', (msg) => {
      const pId = Number(msg.sender_id) === currentUserId ? Number(msg.receiver_id) : Number(msg.sender_id);
      if (Number(selectedPartnerIdRef.current) === pId) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === msg.id);
          return exists ? prev : [...prev, msg];
        });
        markAsRead(pId);
      }
      refreshConversations();
    });

    socket.on('typing_update', (data) => {
      if (Number(data.fromUserId) === Number(selectedPartnerIdRef.current)) {
        setIsPartnerTyping(data.isTyping);
      }
    });

    return () => {
      socket.off('receive_message');
      socket.off('typing_update');
    };
  }, [socket, isAuthenticated, currentUserId, refreshConversations]);

  useEffect(() => {
    if (selectedPartnerId) {
      fetchHistory(selectedPartnerId);
      loadCaseContext(selectedPartnerId);
      markAsRead(selectedPartnerId);
      if (window.innerWidth < 768) {
        setIsMobileConversationOpen(true);
      }
    }
  }, [selectedPartnerId, fetchHistory, loadCaseContext, markAsRead]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isPartnerTyping]);

  const handleSendMessage = () => {
    const content = newMessage.trim();
    if (!content || !socket || !selectedPartnerId || sendingMessage) return;
    setSendingMessage(true);
    socket.emit('send_message', { sender_id: currentUserId, receiver_id: selectedPartnerId, content, type: 'text' }, (ack) => {
      setSendingMessage(false);
      if (ack?.success) setNewMessage(''); else toast.error('Gửi thất bại');
    });
  };

  const handleStartVideoCall = () => {
    if (!selectedConversation) return;
    startCall({ id: selectedConversation.partnerId, name: selectedConversation.partnerName, caseCode: relatedCase?.code, caseTitle: relatedCase?.title });
  };

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[820px] overflow-hidden rounded-2xl md:rounded-[40px] border border-slate-100 bg-white shadow-2xl animate-in fade-in duration-700 relative">
      {/* Sidebar List */}
      <aside className={`flex w-full md:w-[340px] flex-col border-r border-slate-50 bg-[#F8FAFC] transition-all duration-300 ${isMobileConversationOpen ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight text-[#041837]">Tin nhắn</h2>
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#041837] shadow-sm">
              <HiChatAlt2 size={20} />
            </div>
          </div>
          <div className="relative group">
            <HiOutlineSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full rounded-[20px] border-2 border-slate-50 bg-white py-4 pl-12 pr-4 text-xs font-bold font-black outline-none transition-all focus:border-amber-500 focus:ring-8 focus:ring-amber-500/5 shadow-inner"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2">
          {filteredConversations.map((conv) => (
            <button
              key={conv.partnerId}
              onClick={() => setSelectedPartnerId(conv.partnerId)}
              className={`group relative flex w-full items-center gap-4 rounded-[28px] p-4 transition-all ${selectedPartnerId === conv.partnerId ? 'bg-white shadow-2xl ring-1 ring-slate-100 scale-[1.02]' : 'hover:bg-slate-200/50'}`}
            >
              {selectedPartnerId === conv.partnerId && <div className="absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-amber-500" />}
              <div className="relative h-14 w-14 shrink-0 rounded-[20px] bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-white shadow-xl transition-transform group-hover:rotate-6">
                {conv.partnerAvatar ? <img src={conv.partnerAvatar} alt="" className="h-full w-full object-cover" /> : <span className="text-lg font-black text-amber-500">{getInitials(conv.partnerName)}</span>}
                <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-[3px] border-slate-900 bg-emerald-500 shadow-sm" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="mb-1 flex items-center justify-between">
                  <span className="truncate text-sm font-black text-[#041837] tracking-tight">{conv.partnerName}</span>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{formatMessageTime(conv.lastMessageTime)}</span>
                </div>
                <p className={`truncate text-[11px] ${conv.unreadCount > 0 ? 'font-black text-amber-600' : 'text-slate-400 font-bold'}`}>{conv.unreadCount > 0 ? `BẠN CÓ ${conv.unreadCount} TIN NHẮN CHƯA ĐỌC` : conv.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={`flex flex-1 flex-col bg-white transition-all duration-300 ${!isMobileConversationOpen ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <>
            <header className="flex h-20 md:h-24 items-center justify-between border-b border-slate-50 px-4 md:px-10 bg-white/50 backdrop-blur-xl">
              <div className="flex items-center gap-3 md:gap-5">
                <button 
                  onClick={() => setIsMobileConversationOpen(false)}
                  className="md:hidden p-2 -ml-2 text-slate-400 hover:text-amber-500"
                >
                  <HiOutlineArrowRight className="rotate-180 h-6 w-6" />
                </button>
                <div className="relative h-10 w-10 md:h-14 md:w-14 rounded-lg md:rounded-[20px] border-2 border-slate-50 bg-slate-900 shadow-xl flex items-center justify-center overflow-hidden">
                  {selectedConversation.partnerAvatar ? <img src={selectedConversation.partnerAvatar} alt="" className="h-full w-full object-cover" /> : <span className="text-xs md:text-base font-black text-amber-500">{getInitials(selectedConversation.partnerName)}</span>}
                  <div className="absolute bottom-1 right-1 h-2 w-2 md:h-3.5 md:w-3.5 rounded-full border-[2px] md:border-[3px] border-slate-900 bg-emerald-500 shadow-sm animate-pulse" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-black text-[#041837] tracking-tight truncate max-w-[120px] md:max-w-none">{selectedConversation.partnerName}</h2>
                  <p className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    Sẵn sàng hỗ trợ
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleStartVideoCall} className="flex items-center gap-3 rounded-[20px] bg-[#041837] px-8 py-4 text-[10px] font-black tracking-[0.2em] text-white shadow-2xl transition hover:bg-black active:scale-95 group">
                  <HiOutlineVideoCamera size={18} className="text-amber-500 group-hover:rotate-12 transition-transform" />
                  GỌI VIDEO
                </button>
                <div className="h-8 w-px bg-slate-100" />
                <button className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-[#041837] transition-colors"><HiDotsVertical size={20} /></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-slate-50/30 p-4 md:p-10">
              <div className="space-y-6 md:space-y-10">
                {timelineItems.map((item) => {
                  if (item.type === 'divider') return <div key={item.id} className="flex justify-center my-6"><span className="rounded-xl bg-white/80 backdrop-blur-md px-4 md:px-6 py-2 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 shadow-sm border border-slate-50">{item.label}</span></div>;
                  const m = item.message; const isOwn = Number(m.sender_id) === currentUserId;
                  return (
                    <div key={item.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                      <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 md:gap-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isOwn && (
                          <div className="mt-1 h-10 w-10 shrink-0 rounded-xl bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center overflow-hidden">
                            {selectedConversation.partnerAvatar ? <img src={selectedConversation.partnerAvatar} alt="" className="h-full w-full object-cover" /> : <span className="text-[10px] font-black text-amber-500">{getInitials(selectedConversation.partnerName)}</span>}
                          </div>
                        )}
                        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                          <div className={`rounded-[32px] px-8 py-5 shadow-sm text-sm ${isOwn ? 'bg-amber-500 text-[#041837] font-bold rounded-tr-lg shadow-amber-500/10' : 'bg-white text-slate-700 font-medium border border-slate-50 rounded-tl-lg shadow-slate-200/50'}`}>
                            {m.content?.endsWith('.pdf') ? (
                              <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-5 rounded-[24px] bg-black/5 p-5 border border-black/5">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><HiOutlineDocumentText size={24} /></div>
                                  <div className="flex-1 min-w-0"><p className="truncate text-sm font-black text-[#041837]">{m.content.split('/').pop()}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Hồ sơ đính kèm</p></div>
                                  <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-amber-600 shadow-sm hover:scale-110 active:scale-95 transition-all"><HiDownload size={20} /></button>
                                </div>
                              </div>
                            ) : <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>}
                          </div>
                          <div className={`mt-2.5 flex items-center gap-3 px-3 text-[9px] font-black uppercase tracking-widest ${isOwn ? 'text-amber-600' : 'text-slate-300'}`}>
                            <span>{formatMessageTime(m.created_at)}</span>
                            {isOwn && <span className="flex items-center gap-1.5"><HiCheckCircle size={10} className={m.is_read ? 'text-emerald-500' : 'text-amber-300'} /> {m.is_read ? 'ĐÃ ĐỌC' : 'ĐÃ GỬI'}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isPartnerTyping && <div className="flex justify-start"><div className="flex space-x-1.5 bg-white border border-slate-50 rounded-full px-6 py-4 shadow-xl shadow-slate-200/50"><div className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" /><div className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" /><div className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-bounce" /></div></div>}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <footer className="p-4 md:p-8 bg-white/50 backdrop-blur-xl border-t border-slate-50">
              <div className="flex items-center gap-2 md:gap-5 rounded-[24px] md:rounded-[32px] bg-slate-50 p-2 md:p-3.5 focus-within:ring-8 focus-within:ring-amber-500/5 focus-within:bg-white focus-within:shadow-[0_20px_60px_-15px_rgba(245,179,1,0.1)] transition-all border-2 border-transparent focus-within:border-amber-500/20">
                <div className="flex items-center gap-0 md:gap-1 pl-1">
                  <button className="p-2 md:p-3 text-slate-300 hover:text-amber-500 transition-colors"><HiOutlinePlusCircle size={24} /></button>
                </div>
                <input
                  type="text"
                  placeholder="Trao đổi nghiệp vụ..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent py-3 md:py-4 text-xs md:text-sm font-bold text-[#041837] outline-none placeholder:text-slate-300"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl md:rounded-[20px] bg-amber-500 text-[#041837] shadow-xl md:shadow-2xl shadow-amber-500/30 transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-50"
                >
                  <HiPaperAirplane size={20} className="rotate-45" />
                </button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Mã hóa đầu cuối TLS 1.3</p>
                <div className="h-3 w-px bg-slate-100" />
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Bảo mật thông tin bởi Hiểu Luật</p>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center p-20 bg-slate-50/50">
            <div className="h-24 w-24 bg-white rounded-[32px] shadow-2xl flex items-center justify-center text-slate-100 mb-8 border border-slate-50">
              <HiChatAlt2 size={48} />
            </div>
            <h3 className="text-2xl font-black text-[#041837] tracking-tight mb-3">Trung tâm Phối hợp & Tư vấn</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-xs leading-loose">Vui lòng chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu trao đổi nghiệp vụ</p>
          </div>
        )}
      </main>

      {/* Info Sidebar */}
      <aside className="w-[360px] shrink-0 border-l border-slate-50 bg-[#F8FAFC] p-10 hidden xl:block overflow-y-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-8 w-1.5 rounded-full bg-amber-500" />
          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[#041837]">Hồ sơ nghiệp vụ</h3>
        </div>

        {relatedCase ? (
          <div className="space-y-12">
            <div className="group rounded-[32px] bg-white border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all">
              <p className="mb-4 text-[9px] font-black uppercase tracking-widest text-slate-300">Tên vụ việc đang xử lý</p>
              <p className="text-[15px] font-black leading-relaxed text-[#041837] group-hover:text-amber-600 transition-colors uppercase tracking-tight">{relatedCase.title}</p>
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Mã tham chiếu</p>
                  <p className="text-sm font-black text-amber-500">{relatedCase.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Trạng thái</p>
                  <span className="inline-block rounded-xl bg-emerald-50 px-4 py-2 text-[8px] font-black uppercase text-emerald-600 border border-emerald-100">{relatedCase.status}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#041837]">Tài liệu trọng yếu</h4>
                <HiUserGroup className="h-4 w-4 text-slate-300" />
              </div>
              <div className="space-y-3">
                {relatedCase.documents?.slice(0, 4).length > 0 ? (
                  relatedCase.documents?.slice(0, 4).map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-white hover:shadow-xl transition-all">
                      <div className="h-10 w-10 flex items-center justify-center bg-slate-50 rounded-[14px] border border-slate-100 text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-500 group-hover:border-rose-100 transition-all">
                        <HiOutlineDocumentText size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-black text-[#041837] tracking-tight">{doc.file_name || doc.name}</span>
                        <span className="block text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">Hồ sơ pháp lý • PDF</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] font-bold text-slate-300 italic py-4">Chưa có tài liệu đính kèm</p>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate(`/cases/${relatedCase.id}`)}
              className="w-full flex items-center justify-center gap-3 rounded-[24px] bg-[#041837] py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl transition hover:bg-black active:scale-95"
            >
              CHI TIẾT VỤ VIỆC
              <HiChevronRight className="h-4 w-4 text-amber-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <HiOutlineInformationCircle size={32} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-300 px-10 uppercase tracking-[0.2em] leading-loose">Khởi tạo hồ sơ vụ việc để bắt đầu lưu trữ tài liệu liên quan</p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default MessageCenter;
