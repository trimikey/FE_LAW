import axios from 'axios';

const AI_SERVER_URL = 'https://lawai-production.up.railway.app';

const aiService = {
    askAI: async (message, history = []) => {
        try {
            // Format history for the backend (role: 'user' or 'bot', text: string)
            const formattedHistory = history.map(msg => ({
                role: msg.isUser ? 'user' : 'bot',
                text: msg.text
            }));

            const response = await axios.post(`${AI_SERVER_URL}/chat-ai`, {
                message,
                history: formattedHistory
            });

            return response.data;
        } catch (error) {
            console.error("AI Service Error:", error);
            throw error;
        }
    }
};

export default aiService;
