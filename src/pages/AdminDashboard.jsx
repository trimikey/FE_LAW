import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import LawyerDetailModal from '../components/lawyer/LawyerDetailModal';
import AdminOverviewTab from '../components/admin/AdminOverviewTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminLawyersTab from '../components/admin/AdminLawyersTab';
import AdminTransactionsTab from '../components/admin/AdminTransactionsTab';
import AdminQualityTab from '../components/admin/AdminQualityTab';
import AdminInquiriesTab from '../components/admin/AdminInquiriesTab';
import AdminPayoutTab from '../components/admin/AdminPayoutTab';
import AdminProfileTab from '../components/admin/AdminProfileTab';

const AdminDashboard = () => {
  const { user } = useAuth();
  const {
    stats,
    users,
    userPagination,
    usersLoading,
    lawyers,
    lawyerPagination,
    lawyersLoading,
    pendingLawyers,
    reviews,
    reviewPagination,
    reviewsLoading,
    transactions,
    transactionPagination,
    transactionsLoading,
    inquiries,
    inquiryPagination,
    inquiriesLoading,
    loading,
    handleVerifyLawyer,
    handleToggleUserStatus,
    handleToggleReviewVisibility,
    fetchTransactions,
    fetchReviews,
    fetchUsers,
    fetchLawyers,
    fetchInquiries,
    handleNegotiateLawyer,
    handleUpdateLawyerFee,
    fetchLawyerKPI,
    lawyerKpi,
    kpiLoading,
    fetchPayouts,
    handleGeneratePayouts,
    handleConfirmPayout,
    handleUpdateBonus,
    payouts,
    payoutsLoading,
  } = useAdminDashboard();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabFromUrl = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTabState] = useState(currentTabFromUrl);

  const setActiveTab = (newTab) => {
    setActiveTabState(newTab);
    setSearchParams({ tab: newTab });
  };

  useEffect(() => {
    const tabUrl = searchParams.get('tab') || 'overview';
    if (tabUrl !== activeTab) {
      setActiveTabState(tabUrl);
    }
  }, [searchParams]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 shadow-xl"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <AdminOverviewTab
            stats={stats}
            pendingLawyers={pendingLawyers}
            setActiveTab={setActiveTab}
            setSelectedLawyer={setSelectedLawyer}
          />
        );
      case 'users':
        return (
          <AdminUsersTab
            users={users}
            pagination={userPagination}
            loading={usersLoading}
            onPageChange={fetchUsers}
            handleToggleUserStatus={handleToggleUserStatus}
          />
        );
      case 'lawyers':
        return (
          <AdminLawyersTab
            lawyers={lawyers}
            pagination={lawyerPagination}
            loading={lawyersLoading}
            onPageChange={fetchLawyers}
            handleVerifyLawyer={handleVerifyLawyer}
            setSelectedLawyer={setSelectedLawyer}
          />
        );
      case 'transactions':
        return (
          <AdminTransactionsTab
            transactions={transactions}
            pagination={transactionPagination}
            loading={transactionsLoading}
            onPageChange={fetchTransactions}
            lawyerKpi={lawyerKpi}
            kpiLoading={kpiLoading}
            onFetchKPI={fetchLawyerKPI}
          />
        );
      case 'payouts':
        return (
          <AdminPayoutTab
            payouts={payouts}
            loading={payoutsLoading}
            fetchPayouts={fetchPayouts}
            handleGeneratePayouts={handleGeneratePayouts}
            handleConfirmPayout={handleConfirmPayout}
            handleUpdateBonus={handleUpdateBonus}
          />
        );
      case 'quality':
        return (
          <AdminQualityTab
            stats={stats}
            reviews={reviews}
            pagination={reviewPagination}
            loading={reviewsLoading}
            onPageChange={fetchReviews}
            handleToggleReviewVisibility={handleToggleReviewVisibility}
          />
        );
      case 'inquiries':
        return (
          <AdminInquiriesTab
            inquiries={inquiries}
            pagination={inquiryPagination}
            loading={inquiriesLoading}
            onPageChange={fetchInquiries}
          />
        );
      case 'profile':
        return (
          <AdminProfileTab />
        );
      default:
        return (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-black uppercase tracking-widest italic border-2 border-dashed border-slate-100 rounded-[40px] p-20 bg-white">
              Chức năng đang được cập nhật
            </p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="pb-20">
        {renderContent()}
      </div>

      {selectedLawyer && (
        <LawyerDetailModal
          lawyer={selectedLawyer}
          onClose={() => setSelectedLawyer(null)}
          onVerify={(id) => {
            handleVerifyLawyer(id, 'verified');
            setSelectedLawyer(null);
          }}
          onReject={(id) => {
            handleVerifyLawyer(id, 'rejected');
            setSelectedLawyer(null);
          }}
          onNegotiate={handleNegotiateLawyer}
          onUpdateFee={async (id, fee) => {
            const updated = await handleUpdateLawyerFee(id, fee);
            if (updated) {
              setSelectedLawyer({ ...selectedLawyer, consultation_fee: fee });
            }
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
