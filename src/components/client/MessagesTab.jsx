const MessagesTab = ({ conversations, onOpenChat }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Tin nhắn</h2>
      </div>

      <div className="p-6">
        {conversations.length === 0 ? (
          <p className="text-gray-500">Chưa có cuộc trò chuyện nào</p>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <button
                key={conv.partnerId}
                onClick={() => onOpenChat(conv)}
                className="w-full text-left border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{conv.partnerName}</p>
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                      {conv.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.lastMessageTime).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="ml-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesTab;

