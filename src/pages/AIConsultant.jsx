import { useState, useRef, useEffect } from 'react';
import { IoSend, IoTrashOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { RiRobot2Line } from 'react-icons/ri';
import aiService from '../services/aiService';
import { toast } from 'react-hot-toast';

const AIConsultant = () => {
    const [messages, setMessages] = useState([
        {
            text: "Xin chào! Tôi là Trợ lý Luật sư AI của EXE_LAW. Tôi có thể hỗ trợ bạn giải đáp các thắc mắc về pháp luật Việt Nam. Bạn cần tư vấn về vấn đề gì hôm nay?",
            isUser: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = {
            text: input,
            isUser: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Call AI Service with history
            const response = await aiService.askAI(input, messages);
            
            const aiMessage = {
                text: response.reply,
                isUser: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            toast.error("Không thể kết nối với máy chủ AI. Vui lòng thử lại sau.");
            const errorMessage = {
                text: "⚠️ Rất tiếc, hệ thống đang gặp sự cố kết nối. Vui lòng đảm bảo AI Server đã được khởi chạy.",
                isUser: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ cuộc hội thoại?")) {
            setMessages([messages[0]]);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-160px)] max-w-5xl mx-auto px-4 py-6">
            {/* Header Section */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <RiRobot2Line size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">Trợ lý Luật sư AI</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Đang trực tuyến</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={clearChat}
                    className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all duration-300 group"
                    title="Xóa cuộc trò chuyện"
                >
                    <IoTrashOutline size={20} className="group-hover:rotate-12 transition-transform" />
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 bg-white/40 backdrop-blur-sm border border-slate-200 rounded-3xl overflow-hidden shadow-xl flex flex-col mb-4">
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div className={`flex gap-3 max-w-[85%] ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${msg.isUser ? 'bg-slate-800 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {msg.isUser ? 'ME' : 'AI'}
                                </div>
                                <div className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                                        ${msg.isUser 
                                            ? 'bg-slate-800 text-white rounded-tr-none' 
                                            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium whitespace-pre-wrap'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 font-medium px-1 uppercase tracking-tighter">
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start animate-pulse">
                            <div className="flex gap-3 max-w-[80%]">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <RiRobot2Line size={16} className="text-indigo-400" />
                                </div>
                                <div className="bg-slate-100/50 px-4 py-2 rounded-2xl rounded-tl-none text-xs font-medium text-slate-500">
                                    Luật sư đang suy nghĩ...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-slate-50/50 border-t border-slate-100">
                    <div className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Mô tả vấn đề pháp lý của bạn tại đây..."
                            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-16 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 placeholder:text-slate-300 font-medium"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-indigo-600 text-white hover:bg-slate-900 transition-all duration-300 shadow-md shadow-indigo-100 disabled:opacity-50 disabled:shadow-none font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:scale-105"
                        >
                            <span className="hidden sm:inline">Gửi</span>
                            <IoSend size={16} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Disclaimer Footer */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <IoShieldCheckmarkOutline size={14} className="text-green-500" />
                Dữ liệu bảo mật bởi EXE_LAW Intelligence • Phiên bản v2.0-Senior
            </div>
        </div>
    );
};

export default AIConsultant;
