import { useState, useEffect, useRef } from "react";
import api from "../services/api";

const LegalChatBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Xin chào 👋 Tôi là trợ lý pháp lý AI. Tôi có thể hỗ trợ bạn về pháp luật Việt Nam.",
    },
  ]);

  const endRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: userMsg.content,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Không thể kết nối AI. Vui lòng thử lại.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        ⚖️ AI Pháp lý
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[520px] bg-white rounded-xl shadow-2xl z-50 flex flex-col">
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
            <span className="font-semibold">Trợ lý pháp lý AI</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-3 max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-gray-200 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="Nhập câu hỏi pháp luật..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
            >
              {loading ? "..." : "Gửi"}
            </button>
          </div>

          <div className="text-[11px] text-gray-500 text-center pb-2">
            ⚠️ Chỉ mang tính tham khảo, không thay thế luật sư
          </div>
        </div>
      )}
    </>
  );
};

export default LegalChatBot;
