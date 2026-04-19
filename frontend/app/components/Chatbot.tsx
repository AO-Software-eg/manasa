'use client';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  SendHorizontal,
  Bot,
  Paperclip,
  X,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

type Message = {
  id: string;
  text: string;
  role: 'user' | 'bot';
  timestamp: Date;
  error?: boolean;
  reaction?: 'thumbs_up' | 'thumbs_down' | null;
  file?: {
    name: string;
    type: string;
    url: string;
  };
};

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [sessionId] = useState(() => generateSessionId());
  const isDark = true;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [botTyping, setBotTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatbot_messages_${sessionId}`);
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(
        parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      );
    }
  }, [sessionId]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        `chatbot_messages_${sessionId}`,
        JSON.stringify(messages),
      );
    }
  }, [messages, sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botTyping]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/notify.mp3');
  }, []);

  // Keyboard detection
  useEffect(() => {
    if (!window.visualViewport) return;
    const handleResize = () => {
      const viewportHeight = window.visualViewport!.height;
      const windowHeight = window.innerHeight;
      const offset = windowHeight - viewportHeight;
      setKeyboardOffset(offset > 0 ? offset : 0);
    };
    window.visualViewport.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  async function sendMessage(retryMessageId?: string) {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const userMessage = input.trim();
    const fileToSend = selectedFile;

    const messageId = retryMessageId || generateMessageId();
    const newMessage: Message = {
      id: messageId,
      role: 'user',
      text: userMessage || 'تم إرسال ملف',
      timestamp: new Date(),
    };

    if (fileToSend && !retryMessageId) {
      newMessage.file = {
        name: fileToSend.name,
        type: fileToSend.type,
        url: URL.createObjectURL(fileToSend),
      };
    }

    if (!retryMessageId) {
      setMessages((m) => [...m, newMessage]);
    }
    setInput('');
    setSelectedFile(null);
    setIsLoading(true);
    setBotTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      let body;
      let headers: Record<string, string> = {};

      if (fileToSend) {
        const formData = new FormData();
        formData.append('message', userMessage);
        formData.append('sessionId', sessionId);
        formData.append('file', fileToSend);
        body = formData;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
        });
      }

      const res = await fetch('http://localhost:5678/webhook/chat', {
        method: 'POST',
        headers,
        body,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const botMessage: Message = {
        id: generateMessageId(),
        role: 'bot',
        text: data.output,
        timestamp: new Date(),
      };

      setMessages((m) => [...m, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'bot',
        text: 'عذراً، حدث خطأ. حاول مرة أخرى.',
        timestamp: new Date(),
        error: true,
      };

      setMessages((m) => [...m, errorMessage]);
    } finally {
      setIsLoading(false);
      setBotTyping(false);
    }
  }

  function retryMessage(messageId: string) {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const failedMessage = messages[messageIndex];
    setMessages((m) => m.slice(0, messageIndex + 1));
    setInput(failedMessage.text === 'تم إرسال ملف' ? '' : failedMessage.text);

    setTimeout(() => {
      sendMessage(messageId);
    }, 100);
  }

  function handleReaction(
    messageId: string,
    reaction: 'thumbs_up' | 'thumbs_down',
  ) {
    setMessages((m) =>
      m.map((msg) =>
        msg.id === messageId
          ? { ...msg, reaction: msg.reaction === reaction ? null : reaction }
          : msg,
      ),
    );
  }

  function playNotificationSound() {
    audioRef.current?.play().catch((err) => {
      console.log('Audio play failed:', err);
    });
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('حجم الملف يجب أن يكون أقل من 10 ميجابايت');
        return;
      }
      setSelectedFile(file);
    }
  }

  function clearChat() {
    if (confirm('هل أنت متأكد من مسح جميع الرسائل؟')) {
      setMessages([]);
      localStorage.removeItem(`chatbot_messages_${sessionId}`);
    }
  }

  return (
    <>
      <div
        style={{
          bottom: visible ? 40 + keyboardOffset : 40,
        }}
        className={`
          fixed md:left-10 left-2 md:w-96 w-[90vw] h-[70vh] max-h-[600px]
          bg-[#1C1C18] border-[#3b3b34]/50 shadow-2xl shadow-[#e6d3a3]/20 flex flex-col dir="rtl"
          transition-all duration-300 ease-in-out origin-bottom-right
          border rounded-t-3xl rounded-br-3xl overflow-hidden z-50
          ${
            visible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
          }
        `}
      >
        <div className="flex justify-between items-center bg-[#3b3b34] p-4 rounded-t-3xl shadow-sm shadow-[#e6d3a3]/20">
          <div className="flex items-center gap-2">
            <Bot className="text-white w-5 h-5" />
            <h2 className="text-lg text-white font-bold">مساعد الدردشة</h2>
          </div>
          <button
            className="text-white hover:bg-[#525248] p-2 rounded-full transition-colors"
            onClick={() => setVisible(false)}
            aria-label="إغلاق الدردشة"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#1C1C18]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <Bot className="w-16 h-16 text-[#e6d3a3]/50 mb-4" />
              <p className="text-[#e6d3a3]/70 text-sm mb-4">
                لا توجد رسائل بعد. ابدأ المحادثة!
              </p>
              <button
                onClick={clearChat}
                className="text-xs text-[#e6d3a3]/70 hover:text-[#e6d3a3] transition-colors"
              >
                مسح السجل
              </button>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onRetry={retryMessage}
                  onReaction={handleReaction}
                  isDark={isDark}
                />
              ))}
              {botTyping && (
                <div className="mb-2 px-4 py-2 rounded-t-2xl rounded-bl-2xl w-fit ml-auto max-w-[80%] bg-[#2a2a25] text-[#e6d3a3]">
                  <div className="flex items-center gap-1">
                    <span className="animate-bounce">.</span>
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    >
                      .
                    </span>
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    >
                      .
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="p-4 bg-[#1C1C18] border-t border-[#3b3b34]/50 rounded-bl-3xl">
          {selectedFile && (
            <div className="mb-2 flex items-center gap-2 p-2 rounded-lg bg-[#2a2a25]">
              <Paperclip className="w-4 h-4 text-[#e6d3a3]/70" />
              <span className="text-sm flex-1 truncate text-[#e6d3a3]">
                {selectedFile.name}
              </span>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-[#e6d3a3]/70 hover:text-[#e6d3a3]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] hover:bg-[#2a2a25] p-2  rounded-full transition-colors"
              aria-label="إرفاق ملف"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 border rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#e6d3a3]/50 focus:border-transparent bg-[#2a2a25] border-[#3b3b34]/50 text-[#e6d3a3] placeholder-[#e6d3a3]/70"
              placeholder="اكتب رسالتك..."
              style={{ fontSize: '16px' }}
              disabled={isLoading}
              dir="rtl"
            />

            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={isLoading || (!input.trim() && !selectedFile)}
              className=" text-[#e6d3a3] disabled:text-[#e6d3a3]/50 hover:text-[#e6d3a3] transition-colors p-2 rounded-full hover:bg-[#525248] disabled:hover:bg-transparent"
              aria-label="إرسال الرسالة"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </div>

          {messages.length > 0 && (
            <div className="mt-2 text-center">
              <button
                onClick={clearChat}
                className="text-xs text-[#e6d3a3]/70 hover:text-[#e6d3a3] transition-colors"
              >
                مسح سجل المحادثة
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setVisible(true)}
        className={`
      
           z-100 fixed bottom-4 left-4 rounded-full w-16 h-16
          bg-[#3b3b34] hover:bg-[#525248] 
          flex items-center justify-center shadow-lg cursor-pointer shadow-[#e6d3a3]/20
          transition-all duration-300
          ${visible ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
        `}
        aria-label="فتح الدردشة"
      >
        <Bot className="text-white w-7 h-7" />
        <span className="absolute bg-[#e6d3a3] w-4 h-4 top-0 right-0 border-2 border-white rounded-full animate-pulse" />
      </button>
    </>
  );
}

function MessageBubble({
  message,
  onRetry,
  onReaction,
  isDark,
}: {
  message: Message;
  onRetry: (id: string) => void;
  onReaction: (id: string, reaction: 'thumbs_up' | 'thumbs_down') => void;
  isDark: boolean;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`mb-4 ${isUser ? 'mr-auto' : ''} max-w-[80%] w-fit`}>
      <div
        className={`
          px-4 py-2 whitespace-pre-wrap break-words rounded-2xl
          ${
            isUser
              ? 'bg-[#525248] text-white rounded-r-2xl'
              : 'bg-[#2a2a25] text-[#e6d3a3] rounded-l-2xl'
          }
          ${message.error ? 'border-2 border-[#e6d3a3]/50' : ''}
        `}
      >
        <div
          dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
        />

        {message.file && (
          <div className="mt-2 pt-2 border-t border-[#e6d3a3]/20">
            <a
              href={message.file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:underline text-[#e6d3a3]/80"
            >
              <Paperclip className="w-3 h-3" />
              {message.file.name}
            </a>
          </div>
        )}
      </div>

      <div className="text-xs mt-1 text-[#e6d3a3]/70">
        {formatTimestamp(message.timestamp)}
      </div>

      <div
        className={`flex gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {message.error && (
          <button
            onClick={() => onRetry(message.id)}
            className="text-xs text-[#e6d3a3]/70 hover:text-[#e6d3a3] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            إعادة المحاولة
          </button>
        )}

        {!isUser && !message.error && (
          <div className="flex gap-1">
            <button
              onClick={() => onReaction(message.id, 'thumbs_up')}
              className={`p-1 rounded hover:bg-[#525248] transition-colors ${
                message.reaction === 'thumbs_up'
                  ? 'bg-[#525248] text-[#e6d3a3]'
                  : ''
              }`}
              aria-label="إعجاب"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => onReaction(message.id, 'thumbs_down')}
              className={`p-1 rounded hover:bg-[#525248] transition-colors ${
                message.reaction === 'thumbs_down'
                  ? 'bg-[#525248] text-[#e6d3a3]'
                  : ''
              }`}
              aria-label="عدم إعجاب"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Utility Functions
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return 'الآن';
  if (minutes < 60) return `${minutes}د`;
  if (hours < 24) return `${hours}س`;
  return date.toLocaleDateString('ar-EG', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatMessage(text: string): string {
  let formatted = text;

  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');

  formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/_(.+?)_/g, '<em>$1</em>');

  formatted = formatted.replace(
    /`(.+?)`/g,
    "<code class='bg-[#2a2a25] px-1 rounded text-[#e6d3a3]'>$1</code>",
  );

  formatted = formatted.replace(
    /\[(.+?)\]\((.+?)\)/g,
    "<a href='$2' target='_blank' rel='noopener noreferrer' class='underline text-[#e6d3a3]'>$1</a>",
  );

  formatted = formatted.replace(/\n/g, '<br />');

  return formatted;
}

export default Chatbot;
