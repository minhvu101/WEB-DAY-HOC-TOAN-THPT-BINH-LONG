import React, { useState } from 'react';
import MathFormula from './MathFormula';
import { X, Sparkles, Lightbulb, BookOpen, Send, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'mathy';
  text: string;
  formulas?: string[];
  type?: 'hint' | 'explain' | 'example' | 'solution';
}

export const AITutorModal: React.FC<AITutorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'mathy',
      text: 'Chào bạn! Mình là Mathy – Trợ lý gia sư Toán học thông minh của bạn. Mình ở đây để giúp bạn hiểu sâu bản chất bài toán chứ không chỉ chép lời giải! Bạn đang gặp khó ở bài nào?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '💡 Cách tìm đỉnh Parabol', prompt: 'Làm sao để tìm tọa độ đỉnh và trục đối xứng của parabol y = ax^2 + bx + c?' },
    { label: '🧠 Ý nghĩa đạo hàm', prompt: 'Giải thích giúp em bản chất hình học của đạo hàm f\'(x_0) là gì?' },
    { label: '🔍 Phân biệt Tổ hợp & Chỉnh hợp', prompt: 'Khi nào dùng tổ hợp C_n^k và khi nào dùng chỉnh hợp A_n^k?' },
  ];

  const handleSendMessage = (textToSend?: string, mode?: 'hint' | 'explain' | 'example' | 'solution') => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      let reply: Message;

      if (query.includes('đỉnh Parabol') || query.includes('parabol')) {
        if (mode === 'hint') {
          reply = {
            id: (Date.now() + 1).toString(),
            sender: 'mathy',
            type: 'hint',
            text: '💡 Gợi ý cho bạn: Bạn hãy nhớ lại công thức hoành độ đỉnh $x_I = -\\frac{b}{2a}$. Sau khi có $x_I$, thay ngược lại vào hàm số ban đầu để tìm $y_I$ nhé!',
          };
        } else {
          reply = {
            id: (Date.now() + 1).toString(),
            sender: 'mathy',
            type: 'explain',
            text: '🧠 Tọa độ đỉnh Parabol $y = ax^2 + bx + c$ ($a \\ne 0$):\n• Tọa độ đỉnh: $I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)$ với $\\Delta = b^2 - 4ac$.\n• Trục đối xứng: Đường thẳng $x = -\\frac{b}{2a}$.\n• Mẹo nhớ: Bề lõm quay lên nếu $a > 0$ (đỉnh là điểm thấp nhất); quay xuống nếu $a < 0$ (đỉnh là điểm cao nhất).',
          };
        }
      } else if (query.includes('đạo hàm')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'mathy',
          type: 'explain',
          text: '🧠 Ý nghĩa hình học của đạo hàm:\nĐạo hàm của hàm số $y = f(x)$ tại điểm $x_0$ chính là HỆ SỐ GÓC của tiếp tuyến của đồ thị hàm số tại điểm $M_0(x_0; f(x_0))$.\nPhương trình tiếp tuyến có dạng:\n$y - y_0 = f\'(x_0)(x - x_0)$ với $y_0 = f(x_0)$.',
        };
      } else if (query.includes('Tổ hợp') || query.includes('Chỉnh hợp')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'mathy',
          type: 'explain',
          text: '🔍 Bí quyết phân biệt nhanh:\n• Tổ hợp $C_n^k$: Chỉ chọn $k$ phần tử từ $n$ phần tử, KHÔNG QUAN TÂM thứ tự (ví dụ: chọn 3 bạn đi trực nhật).\n• Chỉnh hợp $A_n^k$: Chọn $k$ phần tử và CÓ SẮP XẾP thứ tự (ví dụ: chọn 3 bạn làm Lớp trưởng, Lớp phó, Bí thư).',
        };
      } else {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'mathy',
          type: mode || 'hint',
          text: `Mathy đã nhận được câu hỏi của bạn: "${query}".\n💡 Hãy thử phân tích: Đầu tiên xác định bài toán thuộc chủ đề nào? Các dữ kiện đã cho là gì và công thức liên quan trực tiếp là gì? Hãy chia sẻ bước làm hiện tại của bạn để Mathy kiểm tra nhé!`,
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[620px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm tracking-tight">AI Tutor Mathy</h3>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  Socratic Mode
                </span>
              </div>
              <p className="text-[11px] text-indigo-100">
                Gợi ý từng bước · Không làm hộ · Rèn luyện tư duy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-xs rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-bl-xs'
                }`}
              >
                {m.sender === 'mathy' && (
                  <div className="text-[10px] font-bold text-indigo-600 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Mathy Assistant
                  </div>
                )}
                <div className="whitespace-pre-line leading-relaxed">
                  <MathFormula
                    math={m.text}
                    className={m.sender === 'user' ? 'text-white' : 'text-slate-800'}
                  />
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span>Mathy đang suy nghĩ gợi ý sư phạm phù hợp...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Socratic Prompt Bar */}
        <div className="p-2.5 bg-slate-100/70 border-t border-slate-200 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] text-slate-500 font-semibold px-1">Chế độ hỏi:</span>
          <button
            onClick={() => handleSendMessage(inputText, 'hint')}
            disabled={!inputText.trim()}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-amber-700 font-medium disabled:opacity-50"
          >
            <Lightbulb className="w-3 h-3 text-amber-500" /> Cho gợi ý
          </button>
          <button
            onClick={() => handleSendMessage(inputText, 'explain')}
            disabled={!inputText.trim()}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-blue-700 font-medium disabled:opacity-50"
          >
            <BookOpen className="w-3 h-3 text-blue-500" /> Giải thích bản chất
          </button>
          <button
            onClick={() => handleSendMessage(inputText, 'solution')}
            disabled={!inputText.trim()}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-emerald-700 font-medium disabled:opacity-50"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Hướng dẫn từng bước
          </button>
        </div>

        {/* Prompt Suggestions */}
        <div className="px-3 pt-2 bg-white flex items-center gap-1.5 overflow-x-auto pb-1">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp.prompt)}
              className="text-[11px] whitespace-nowrap bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Nhập câu hỏi hoặc bài toán bạn đang băn khoăn (hỗ trợ LaTeX)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isThinking}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-all"
          >
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutorModal;
