import { useAuth } from '../contexts/AuthContext';
import { useClientDashboard } from '../hooks/useClientDashboard';
import OverviewTab from '../components/client/OverviewTab';
import CasesTab from '../components/client/CasesTab';
import LawyersTab from '../components/client/LawyersTab';
import CreateCaseModal from '../components/client/CreateCaseModal';
import BookConsultationModal from '../components/client/BookConsultationModal';
import ConsultationsTab from '../components/client/ConsultationsTab';
import MessagesTab from '../components/client/MessagesTab';
import VideoChatTab from '../components/client/VideoChatTab';
import ProfileTab from '../components/client/ProfileTab';
import ClientInquiriesTab from '../components/client/ClientInquiriesTab';
import ClientPaymentsTab from '../components/client/ClientPaymentsTab';
import ClientReviewsTab from '../components/client/ClientReviewsTab';
import ChatBox from '../components/chat/ChatBox';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PartnerSection from '../components/home/PartnerSection';
import Footer from '../components/home/Footer';
import CTASection from '../components/home/CTASection';
import MessageCenter from '../components/messages/MessageCenter';
import bannerImg from '../assets/back_gr_luat.png';
import clientHeroImg from '../assets/stat_law.png';
import { HiPlus, HiSearch } from 'react-icons/hi';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dashboard = useClientDashboard();
  const [selectedChatPartner, setSelectedChatPartner] = useState(null);

  const handleMessagesRefresh = useCallback(() => {
    dashboard.refreshDashboard(false);
  }, [dashboard.refreshDashboard]);

  useEffect(() => {
    if (dashboard.activeTab === 'lawyers') {
      dashboard.searchLawyers();
    }
  }, [dashboard.activeTab]);

  return (
    <DashboardLayout
      activeTab={dashboard.activeTab}
      setActiveTab={dashboard.setActiveTab}
      unreadMessagesCount={dashboard.unreadMessages}
      missedCallsCount={dashboard.missedCallsCount}
    >
      {dashboard.loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <>
          {/* Premium Header Banner for Clients */}
          {dashboard.activeTab === 'overview' && (
            <div className="relative mb-10 overflow-hidden rounded-[40px] bg-[#041837] text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="absolute inset-0 opacity-40">
                <img src={bannerImg} alt="Banner" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#041837] via-[#041837]/80 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-between gap-8 px-6 md:px-10 py-10 md:py-12 md:flex-row">
                <div className="max-w-2xl text-center md:text-left">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 backdrop-blur-md">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Trung tâm hỗ trợ pháp lý</span>
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl break-words md:break-normal">
                    Xin chào, <span className="text-amber-500">{user?.full_name?.split(' ').pop()}!</span>
                  </h2>
                  <p className="mt-4 md:mt-6 max-w-lg text-sm md:text-lg text-slate-300">
                    Hiểu Luật luôn đồng hành cùng bạn để giải quyết các vấn đề pháp lý một cách nhanh chóng và tin cậy nhất.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button onClick={() => dashboard.setShowCreateCase(true)} className="group flex items-center justify-center gap-2 rounded-xl md:rounded-2xl bg-amber-500 px-6 md:px-8 py-4 text-xs md:text-sm font-black uppercase tracking-widest text-[#041837] shadow-xl transition hover:bg-white active:scale-95">
                      <HiPlus className="h-4 w-4 md:h-5 md:w-5" />
                      Yêu cầu pháp lý
                    </button>
                    <button onClick={() => navigate('/lawyer')} className="flex items-center justify-center gap-2 rounded-xl md:rounded-2xl border border-white/20 bg-white/5 px-6 md:px-8 py-4 text-xs md:text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition hover:bg-white/10 active:scale-95">
                      <HiSearch className="h-4 w-4 md:h-5 md:w-5" />
                      Tìm luật sư
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <img src={clientHeroImg} alt="Client Support" className="h-56 w-auto drop-shadow-2xl transform transition hover:scale-105 duration-500" />
                </div>
              </div>
            </div>
          )}

          {/* Standard Header Banner for other tabs (improved with image) */}
          {dashboard.activeTab !== 'overview' && dashboard.activeTab !== 'messages' && dashboard.activeTab !== 'profile' && (
            <div className="relative mb-10 overflow-hidden rounded-3xl md:rounded-[40px] bg-gradient-to-br from-[#041837] to-[#072558] text-white p-6 md:p-10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 pointer-events-none">
                <img src={clientHeroImg} alt="" className="h-full w-full object-contain transform translate-x-12 translate-y-6" />
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 md:w-12 bg-amber-500 rounded-full" />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-amber-500">Dành cho khách hàng</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-5xl font-black tracking-tight uppercase">
                    {dashboard.activeTab === 'cases' && 'Quản lý vụ việc'}
                    {dashboard.activeTab === 'inquiries' && 'Yêu cầu tư vấn'}
                    {dashboard.activeTab === 'lawyers' && 'Đội ngũ luật sư'}
                    {dashboard.activeTab === 'consultations' && 'Lịch tư vấn cá nhân'}
                    {dashboard.activeTab === 'video' && 'Phòng họp trực tuyến'}
                    {dashboard.activeTab === 'payments' && 'Lịch sử giao dịch'}
                    {dashboard.activeTab === 'reviews' && 'Đánh giá của bạn'}
                  </h1>
                  <p className="text-blue-100/60 font-medium text-xs md:text-sm mt-1 md:mt-2">Chào mừng {user?.full_name}, hệ thống đã sẵn sàng.</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-10">
            {dashboard.activeTab === 'overview' && (
              <OverviewTab
                stats={dashboard.stats}
                recentCases={dashboard.cases}
                recentConsultations={dashboard.consultations}
              />
            )}

            {dashboard.activeTab === 'cases' && (
              <div className="animate-in fade-in duration-500">
                <CasesTab
                  cases={dashboard.cases}
                  onCreate={() => dashboard.setShowCreateCase(true)}
                  onDelete={dashboard.deleteCase}
                  onArchive={dashboard.archiveCase}
                  onRestore={dashboard.restoreCase}
                />
              </div>
            )}

            {dashboard.activeTab === 'inquiries' && (
              <div className="animate-in fade-in duration-500">
                <ClientInquiriesTab />
              </div>
            )}

            {dashboard.activeTab === 'lawyers' && (
              <div className="animate-in fade-in duration-500">
                <LawyersTab {...dashboard} />
              </div>
            )}

            {dashboard.activeTab === 'consultations' && (
              <div className="animate-in fade-in duration-500">
                <ConsultationsTab
                  consultations={dashboard.consultations}
                  onBookNew={() => { navigate('/lawyer'); }}
                />
              </div>
            )}

            {dashboard.activeTab === 'messages' && (
              <MessageCenter onRefresh={handleMessagesRefresh} />
            )}

            {dashboard.activeTab === 'video' && (
              <VideoChatTab conversations={dashboard.conversations} />
            )}

            {dashboard.activeTab === 'payments' && (
              <div className="animate-in fade-in duration-500">
                <ClientPaymentsTab />
              </div>
            )}

            {dashboard.activeTab === 'reviews' && (
              <div className="animate-in fade-in duration-500">
                <ClientReviewsTab />
              </div>
            )}

            {dashboard.activeTab === 'profile' && (
              <ProfileTab />
            )}

            {dashboard.activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                {dashboard.cases?.length === 0 && (
                  <div className="mt-12 rounded-[40px] overflow-hidden shadow-2xl transition hover:shadow-amber-500/10 border border-slate-100">
                    <CTASection isAuthenticated />
                  </div>
                )}
                <div className="mt-20 space-y-20 border-t border-slate-100 pt-20">
                  <PartnerSection />
                  <Footer />
                </div>
              </div>
            )}
          </div>

          {dashboard.showCreateCase && (
            <CreateCaseModal {...dashboard} />
          )}

          {dashboard.showBookConsultation && (
            <BookConsultationModal {...dashboard} />
          )}

          {selectedChatPartner && (
            <ChatBox
              partnerId={selectedChatPartner.id}
              partnerName={selectedChatPartner.name}
              onClose={async () => {
                setSelectedChatPartner(null);
                await dashboard.refreshDashboard();
              }}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default ClientDashboard;
