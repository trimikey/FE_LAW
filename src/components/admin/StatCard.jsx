const StatCard = ({ label, value, trend, trendValue }) => {
    const isPositive = trend === 'up';

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : '-'}{trendValue}%
                </span>
                <span className="text-xs text-gray-400 font-light">from last month</span>
            </div>
            <p className="mt-4 text-sm text-gray-500 font-medium">{label}</p>
        </div>
    );
};

export default StatCard;
