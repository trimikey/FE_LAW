import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children, activeTab, setActiveTab, unreadMessagesCount = 0, missedCallsCount = 0 }) => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-slate-50">
            {/* Top Header for Mobile */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-[70px] bg-[#061f3f] z-50 flex items-center justify-between px-6 border-b border-white/10 shadow-lg">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 bg-white/5 rounded-xl text-white hover:bg-white/15 transition-all active:scale-95"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#f1b136]">Dashboard</span>
                </div>
            </header>

            <div className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(241,177,54,0.12),transparent_26%),radial-gradient(circle_at_right,rgba(59,130,246,0.08),transparent_30%)]" />

            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                role={user?.role_name}
                unreadMessagesCount={unreadMessagesCount}
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main
                className="relative z-10 flex-1 transition-all duration-300 min-h-screen flex flex-col lg:pl-64 pt-[70px] lg:pt-0"
            >
                <div className="flex-1 px-4 py-6 sm:px-12 sm:py-16">
                    <div className="space-y-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
