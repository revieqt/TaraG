import { useState } from "react";
import { BACKEND_URL } from "@/constants/Config";

export function useAIChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a sessionId (could be user id or random)
  const sessionId = "default-session"; // Replace with real session/user id if available

  const sendMessage = async (content: string) => {
    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content }]);
    try {
      const response = await fetch(`${BACKEND_URL}/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: content }),
      });
      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setError(err.message || "Failed to get AI response");
    }
    setLoading(false);
  };

  const resetChat = () => setMessages([]);

  return { messages, loading, error, sendMessage, resetChat };
}