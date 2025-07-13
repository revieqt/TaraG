import { useSession } from '@/context/SessionContext';
import { useState } from 'react';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  showGoToRoutes?: boolean;
};

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();

  const systemPrompt: ChatMessage = {
    role: 'system',
    content: `
You are Tara, a fun and friendly AI travel assistant. 
You help users with anything related to traveling: destinations, planning, weather, places to visit, safety, packing, budgeting, transportation, and tips.
You do NOT answer questions unrelated to travel. If the user asks something off-topic, do not answer it and kindly remind them that you're only here for travel help.
Make your responses short and concise, with a helpful tone, upbeat, and cheerful like a well-traveled friend!
`.trim(),
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: ChatMessage = {
      role: 'user',
      content: text.trim(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    try {
      // Call your backend endpoint instead of OpenRouter directly
      const response = await fetch('https://tarag-backend.onrender.com/api/aiChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await response.json();

      if (!data.message) {
        throw new Error('Tara didn’t respond. Please try again.');
      }

      let content = data.message.trim();
      let showGoToRoutes = false;

      // Optionally, you can parse for special actions here if needed

      const aiReply: ChatMessage = {
        role: 'assistant',
        content,
        ...(showGoToRoutes ? { showGoToRoutes: true } : {}),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    resetChat,
  };
}
