import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HiTrendingUp, HiUsers, HiLightningBolt, HiCurrencyDollar, HiBriefcase } from 'react-icons/hi';
import { MdHistory } from 'react-icons/md';

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

const StatCard = ({ label, value, trendValue, icon: Icon, colorClass }) => (
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
        <div className={`absolute top-0 right-0 p-6 opacity-5 transform group-hover:scale-110 transition-transform ${colorClass}`}>
            <Icon className="h-16 w-16" />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{label}</span>
            </div>
            <h3 className="text-2xl font-black text-[#041837] mb-2">{value}</h3>
            <div className="flex items-center gap-1">
                <HiTrendingUp className="text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500">+{trendValue}%</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight ml-1">từ tháng trước</span>
            </div>
        </div>
    </div>
);

const AdminOverviewTab = ({ stats, pendingLawyers, setActiveTab, setSelectedLawyer }) => {
    const chartData = (stats?.chart || []).map(item => ({
        name: item.month,
        revenue: item.revenue,
        adminRevenue: item.adminRevenue,
        users: item.users,
        cases: item.cases,
        consultations: item.consultations
    }));

    // Calculate trends
    const calculateTrend = (data, key) => {
        if (!data || data.length < 2) return 0;
        const current = data[data.length - 1][key] || 0;
        const previous = data[data.length - 2][key] || 0;
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
    };

    const userTrend = calculateTrend(chartData, 'users');
    const caseTrend = calculateTrend(chartData, 'cases');
    const consultationTrend = calculateTrend(chartData, 'consultations');
    const revenueTrend = calculateTrend(chartData, 'revenue');

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-[50px] bg-[#041837] text-white shadow-2xl p-12">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-amber-500/20" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 backdrop-blur-md">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Hệ thống đang hoạt động tốt</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-4 uppercase">Tổng quan <span className="text-amber-500">Hệ thống</span></h1>
                        <p className="text-slate-400 font-medium leading-relaxed max-w-xl">
                            Chào mừng quay lại, Quản trị viên. Dưới đây là các chỉ số vận hành quan trọng của nền tảng Hiểu Luật.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatCard
                    label="Tổng người dùng"
                    value={stats?.users?.total || 0}
                    trendValue={userTrend}
                    icon={HiUsers}
                    colorClass="text-blue-500"
                />
                <StatCard
                    label="Vụ việc hoạt động"
                    value={stats?.cases?.active || 0}
                    trendValue={caseTrend}
                    icon={HiBriefcase}
                    colorClass="text-amber-500"
                />
                <StatCard
                    label="Lịch tư vấn"
                    value={stats?.consultations?.total || 0}
                    trendValue={consultationTrend}
                    icon={HiLightningBolt}
                    colorClass="text-purple-500"
                />
                <StatCard
                    label="Tổng doanh thu"
                    value={formatMoney(stats?.revenue?.total)}
                    trendValue={revenueTrend}
                    icon={HiCurrencyDollar}
                    colorClass="text-emerald-500"
                />
                <StatCard
                    label="Lợi nhuận Admin (15%)"
                    value={formatMoney(stats?.revenue?.adminEarnings)}
                    trendValue={revenueTrend}
                    icon={HiTrendingUp}
                    colorClass="text-emerald-500"
                />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-[#041837] uppercase tracking-tight">Doanh thu 6 tháng</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Xu hướng tăng trưởng tài chính</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-black text-[#041837] uppercase tracking-widest">Tổng</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="text-[10px] font-black text-[#041837] uppercase tracking-widest">Admin (15%)</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', padding: '15px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                                    labelStyle={{ fontSize: '10px', color: '#94a3b8', marginBottom: '5px', fontWeight: 900 }}
                                    formatter={(value, name) => [formatMoney(value), name === 'revenue' ? 'Tổng thu' : 'Lợi nhuận Admin']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="adminRevenue"
                                    stroke="#f59e0b"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorAdmin)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#041837] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 p-10 opacity-5 transform group-hover:scale-110 transition-transform">
                        <HiLightningBolt className="h-64 w-64" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black uppercase tracking-tight">Việc cần xử lý</h2>
                            <span className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-500 shadow-xl">
                                <MdHistory size={20} />
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer" onClick={() => setActiveTab('lawyers')}>
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Cần phê duyệt</p>
                                <h3 className="text-2xl font-black">{pendingLawyers.length} Luật sư mới</h3>
                                <p className="text-[10px] font-medium text-white/40 mt-2 italic leading-relaxed">Hãy kiểm tra hồ sơ và chứng chỉ hành nghề của các luật sư đang chờ.</p>
                            </div>

                            <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer" onClick={() => setActiveTab('quality')}>
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Issue hệ thống</p>
                                <h3 className="text-2xl font-black">{stats?.issues?.total || 0} Phản hồi</h3>
                                <p className="text-[10px] font-medium text-white/40 mt-2 italic leading-relaxed">Các vụ việc bị khiếu nại hoặc cần sự can thiệp từ quản trị viên.</p>
                            </div>
                        </div>

                        <div className="mt-10 p-6 rounded-3xl bg-amber-500 text-[#041837] shadow-xl text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2">Thông báo quan trọng</p>
                            <p className="text-xs font-bold leading-relaxed italic">Hệ thống sẽ bảo trì định kỳ vào 02:00 sáng Chủ Nhật hàng tuần.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverviewTab;
