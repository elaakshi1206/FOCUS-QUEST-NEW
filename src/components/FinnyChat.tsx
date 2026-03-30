

import { useEffect, useState, useRef } from 'react';
import { Client } from '@botpress/chat';

export default function FinnyChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [conversation, setConversation] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Botpress Client
  useEffect(() => {
    const initBotpress = async () => {
      try {
        const bpClient = new Client({
          webhookId: process.env.NEXT_PUBLIC_BOTPRESS_WEBHOOK_ID || "YOUR_WEBHOOK_ID_HERE",
        });

        setClient(bpClient);

        // Create a new conversation
        const conv = await bpClient.createConversation();
        setConversation(conv);

        // Listen to real-time messages (SSE)
        const listener = await bpClient.listenConversation({ id: conv.id });

        listener.on('message_created', (event: any) => {
          // Skip messages sent by the user
          if (event.userId === bpClient.user?.id) return;

          setMessages((prev) => [
            ...prev,
            {
              id: event.id,
              text: event.payload?.text || event.payload?.message,
              isBot: true,
            },
          ]);
          setIsTyping(false);
        });

        listener.on('typing', () => setIsTyping(true));
      } catch (err) {
        console.error("Failed to initialize Botpress chat:", err);
      }
    };

    initBotpress();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !client || !conversation) return;

    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setInput('');

    try {
      await client.sendMessage({
        conversationId: conversation.id,
        payload: { type: 'text', text: input },
      });
    } catch (error) {
      console.error("Send message failed:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-[380px] border border-gray-700 rounded-2xl overflow-hidden bg-zinc-900">
      {/* Header with Finny */}
      <div className="p-4 bg-zinc-800 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-xl">
          ✨
        </div>
        <div>
          <p className="font-semibold">Finny</p>
          <p className="text-xs text-green-400">● Always here to help you focus</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.isBot
                  ? 'bg-zinc-800 text-white'
                  : 'bg-emerald-500 text-black'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="text-zinc-400 text-sm">
            Finny is thinking<span className="animate-pulse">...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-700 bg-zinc-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Finny anything..."
            className="flex-1 bg-zinc-800 text-white rounded-full px-5 py-3 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-emerald-500 hover:bg-emerald-600 px-6 rounded-full font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}