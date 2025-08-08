import { useSession } from '@/context/SessionContext';
import { BACKEND_URL } from '@/constants/Config';
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
      // Use the local backend with conversation history
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));

      const response = await fetch(`${BACKEND_URL}/api/ai-chat/chat-with-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: text.trim(),
          conversationHistory 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from Tara');
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error('Tara didn\'t respond. Please try again.');
      }

      let content = data.response.trim();
      let showGoToRoutes = false;

      // Check if the response mentions routes or planning to show the "Go to Routes" button
      const routeKeywords = ['route', 'planning', 'itinerary', 'plan', 'schedule'];
      if (routeKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
        showGoToRoutes = true;
      }

      const aiReply: ChatMessage = {
        role: 'assistant',
        content,
        ...(showGoToRoutes ? { showGoToRoutes: true } : {}),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.error('AI Chat Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
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
