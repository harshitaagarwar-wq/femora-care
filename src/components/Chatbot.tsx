import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, HelpCircle, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome! I am Femora Care's AI Breast Health Assistant. I can help answer questions about breast cancer, early warning signs, self-examination guidelines, or booking consultation appointments. How can I support you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const suggestedQueries = [
    "What are early symptoms?",
    "How to do self-exam?",
    "What is BRCA gene risk?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setChatHistory(prev => [...prev, userMsg]);
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory
        })
      });
      const data = await res.json();
      setLoading(false);

      if (data.response) {
        setChatHistory(prev => [...prev, { role: 'model', text: data.response }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'model', text: "I'm having trouble contacting my AI knowledge base. Please try again." }]);
      }
    } catch (err) {
      setLoading(false);
      setChatHistory(prev => [...prev, { role: 'model', text: "Network connection lost. Please ensure your backend dev server is active." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl border border-[#F8BBD0]/20 shadow-2xl w-[350px] sm:w-[380px] h-[500px] flex flex-col justify-between overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#EC407A] to-[#F06292] text-white p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-sm leading-none">Femora AI Assist</h4>
                  <span className="text-[10px] text-white/80 font-semibold tracking-wide">Live Oncology Advisory</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Log */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? "bg-[#EC407A] text-white rounded-tr-none shadow shadow-[#EC407A]/10" 
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm"
                  }`}>
                    {msg.text.split("\n").map((line, lIdx) => (
                      <p key={lIdx} className={line.startsWith("-") ? "pl-3 -indent-3" : ""}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl text-xs text-slate-400 font-medium flex gap-1 items-center shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EC407A] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EC407A] animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EC407A] animate-bounce delay-200" />
                    <span>Analyzing guidelines...</span>
                  </div>
                </div>
              )}
            </div>

            {/* suggestions */}
            {chatHistory.length === 1 && (
              <div className="px-4 py-2 flex flex-wrap gap-2 bg-slate-50 border-t border-slate-100">
                {suggestedQueries.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSendMessage(q)}
                    className="text-[10px] font-bold text-[#EC407A] bg-white hover:bg-[#FFF5F8] border border-[#F8BBD0]/40 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Disclaimer & Input block */}
            <div className="p-3 border-t border-slate-100 space-y-2 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask Femora AI about warning signs, treatment..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage(message);
                  }}
                  className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EC407A]"
                />
                <button
                  onClick={() => handleSendMessage(message)}
                  className="bg-[#EC407A] hover:bg-[#D81B60] text-white p-2.5 rounded-xl transition shadow shadow-[#EC407A]/25 flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[9px] text-slate-400 leading-tight text-center flex gap-1 items-center justify-center">
                <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Simulated Q&A. Does not substitute formal mammography biopsy.</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-[#EC407A] to-[#F06292] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-300 ring-4 ring-white relative group cursor-pointer"
        title="Toggle AI Medical Assist"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 fill-white" />}
        <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-[9px] font-mono font-bold text-white rounded-full flex items-center justify-center animate-pulse">
          AI
        </span>
      </button>
    </div>
  );
}
