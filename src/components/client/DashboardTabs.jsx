const tabs = [
  { key: 'overview', label: 'Tổng Quan' },
  { key: 'cases', label: 'Vụ việc của tôi' },
  { key: 'consultations', label: 'Lịch tư vấn' },
  { key: 'messages', label: 'Tin nhắn' },
  { key: 'video', label: 'Gọi Video' }
];

const DashboardTabs = ({ activeTab, onChange, unreadMessages = 0 }) => (
  <div className="mb-6 border-b">
    {tabs.map(tab => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key)}
        className={`py-4 px-4 border-b-2 text-sm font-medium ${activeTab === tab.key
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-white hover:text-gray-700'
          }`}
      >
        {tab.label}
        {tab.key === 'messages' && unreadMessages > 0 && (
          <span className="ml-2 inline-flex min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] rounded-full items-center justify-center">
            {unreadMessages > 99 ? '99+' : unreadMessages}
          </span>
        )}
      </button>
    ))}
  </div>
);

export default DashboardTabs;
