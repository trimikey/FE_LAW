import { Link, useLocation } from 'react-router-dom';
import {
    MdDashboard,
    MdPeople,
    MdPayments,
    MdGavel,
    MdAssessment,
    MdSettings,
    MdDescription
} from 'react-icons/md';

const AdminSidebar = ({ activeTab, onTabChange }) => {
    const location = useLocation();

    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: MdDashboard },
        { id: 'users', label: 'Người dùng', icon: MdPeople },
        { id: 'lawyers', label: 'Duyet luật sư', icon: MdGavel },
        { id: 'transactions', label: 'Giao dịch', icon: MdPayments },
        { id: 'quality', label: 'Đánh giá & Issue', icon: MdAssessment },
        { id: 'settings', label: 'Cai dat', icon: MdSettings },
        { id: 'docs', label: 'Docs', icon: MdDescription },
    ];

    return (
        <div className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xs">M</span>
                    Material Admin
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="text-xl" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-50">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-800 uppercase">Admin</p>
                        <p className="text-[10px] text-gray-500">Quản trị viên</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
