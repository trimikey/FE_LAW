import { useAuth } from '../../contexts/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children, activeTab, setActiveTab, unreadMessagesCount = 0, missedCallsCount = 0 }) => {
    const { user } = useAuth();

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(241,177,54,0.12),transparent_26%),radial-gradient(circle_at_right,rgba(59,130,246,0.08),transparent_30%)]" />

            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                role={user?.role_name}
                unreadMessagesCount={unreadMessagesCount}
            />

            <main
                className="relative z-10 flex-1 transition-all duration-300 min-h-screen flex flex-col"
                style={{ paddingLeft: '300px', paddingTop: '140px' }}
            >
                <div className="flex-1 px-8 py-10 sm:px-12 sm:py-16">
                    <div className="space-y-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
