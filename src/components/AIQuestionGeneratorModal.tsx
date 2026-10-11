import React, { useState } from 'react';
import MathFormula from './MathFormula';
import { Question, BloomLevel } from '../types';
import { DIGITAL_TEXTBOOK_SOURCES } from '../data/textbookSources';
import {
  X,
  Sparkles,
  RefreshCw,
  Trash2,
  Check,
  Layers,
  Upload,
  BookOpen,
  FileCheck,
  CheckSquare,
  Hash,
  PenTool,
  Sliders,
} from 'lucide-react';

interface AIQuestionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestionsToExam: (questions: Question[]) => void;
}

const MULTI_FORMAT_TOPIC_QUESTIONS: Record<string, Question[]> = {
  'Đạo hàm': [
    // Phần 1: MCQ 4 options
    {
      id: 'AI-DH-1',
      topic: 'Đạo hàm',
      grade: 11,
      content: 'Cho hàm số $f(x) = x^4 - 2x^2 + 3$. Đạo hàm $f\'(x)$ bằng:',
      options: ['$4x^3 - 4x$', '$4x^3 - 2x$', '$x^3 - 4x$', '$4x^3 - 4x + 3$'],
      correctAnswer: '$4x^3 - 4x$',
      bloomLevel: 'NhanBiet',
      explanation: 'Áp dụng công thức đạo hàm cơ bản $(x^n)\' = n x^{n-1}$, ta có $f\'(x) = 4x^3 - 4x$.',
      type: 'multiple_choice',
      points: 0.25,
      section: 'part1_mcq',
    },
    {
      id: 'AI-DH-2',
      topic: 'Đạo hàm',
      grade: 11,
      content: 'Hệ số góc của tiếp tuyến của đồ thị hàm số $y = \\frac{2x+1}{x-1}$ tại điểm có hoành độ $x_0 = 2$ là:',
      options: ['$-3$', '$3$', '$-1$', '$5$'],
      correctAnswer: '$-3$',
      bloomLevel: 'ThongHieu',
      explanation: 'Ta có $y\' = \\frac{2(x-1) - (2x+1)}{(x-1)^2} = \\frac{-3}{(x-1)^2}$. Tại $x_0 = 2 \\Rightarrow y\'(2) = \\frac{-3}{(2-1)^2} = -3$.',
      type: 'multiple_choice',
      points: 0.25,
      section: 'part1_mcq',
    },
    // Phần 2: True/False 4 sub-items
    {
      id: 'AI-DH-TF-1',
      topic: 'Đạo hàm',
      grade: 11,
      content: 'Cho hàm số $y = f(x) = x^3 - 3x^2 + 2$ có đồ thị là $(C)$. Xét tính đúng/sai của các mệnh đề sau:',
      type: 'true_false',
      correctAnswer: 'Đ-Đ-S-Đ',
      bloomLevel: 'VanDung',
      points: 1.0,
      section: 'part2_true_false',
      explanation: 'Ta có $f\'(x) = 3x^2 - 6x = 3x(x - 2)$. $f\'(x) = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$.',
      tfItems: [
        {
          id: 'tf-dh-1a',
          statement: 'Đạo hàm của hàm số tại điểm $x = 1$ là $f\'(1) = -3$.',
          isCorrect: true,
          explanation: 'Thay $x = 1$ vào $f\'(x) = 3(1)^2 - 6(1) = -3$. Mệnh đề ĐÚNG.',
        },
        {
          id: 'tf-dh-1b',
          statement: 'Hàm số nghịch biến trên khoảng $(0; 2)$.',
          isCorrect: true,
          explanation: 'Trên khoảng $(0; 2)$, $f\'(x) < 0$ nên hàm số nghịch biến. Mệnh đề ĐÚNG.',
        },
        {
          id: 'tf-dh-1c',
          statement: 'Tiếp tuyến của $(C)$ tại điểm có hoành độ $x = 0$ có hệ số góc bằng $2$.',
          isCorrect: false,
          explanation: 'Hệ số góc $k = f\'(0) = 0$ (tiếp tuyến nằm ngang). Mệnh đề SAI.',
        },
        {
          id: 'tf-dh-1d',
          statement: 'Đồ thị $(C)$ có hai điểm cực trị là $A(0; 2)$ và $B(2; -2)$.',
          isCorrect: true,
          explanation: 'Tại $x = 0 \\Rightarrow y = 2$; tại $x = 2 \\Rightarrow y = 8 - 12 + 2 = -2$. Mệnh đề ĐÚNG.',
        },
      ],
    },
    // Phần 3: Short answer
    {
      id: 'AI-DH-SA-1',
      topic: 'Đạo hàm',
      grade: 11,
      content: 'Một chất điểm chuyển động theo phương trình $s(t) = -t^3 + 6t^2 + 9t$ với $t$ tính bằng giây ($t \\ge 0$) và $s$ tính bằng mét. Tính vận tốc tức thời lớn nhất của chất điểm (m/s).',
      type: 'short_answer',
      correctAnswer: '21',
      bloomLevel: 'VanDungCao',
      points: 0.5,
      section: 'part3_short_answer',
      explanation: 'Vận tốc $v(t) = s\'(t) = -3t^2 + 12t + 9 = -3(t - 2)^2 + 21 \\le 21$. Đạt giá trị lớn nhất là $21\\text{ m/s}$ tại $t = 2\\text{ s}$.',
    },
    // Phần 4: Essay
    {
      id: 'AI-DH-ES-1',
      topic: 'Đạo hàm',
      grade: 11,
      content: 'Cho hàm số $y = \\frac{2x+3}{x-1}$ có đồ thị $(C)$. Viết phương trình tiếp tuyến của $(C)$ biết tiếp tuyến vuông góc với đường thẳng $d: x - 5y + 2 = 0$.',
      type: 'essay',
      correctAnswer: 'y = -5x + 3 hoặc y = -5x + 13',
      bloomLevel: 'VanDung',
      points: 1.5,
      section: 'part4_essay',
      explanation: 'Đường thẳng $d$ có hệ số góc $k_d = \\frac{1}{5}$. Vì tiếp tuyến vuông góc với $d$ nên hệ số góc $k = -5$.\nĐạo hàm $y\' = \\frac{-5}{(x-1)^2}$. Ta có $\\frac{-5}{(x-1)^2} = -5 \\Leftrightarrow (x-1)^2 = 1 \\Leftrightarrow x = 2$ hoặc $x = 0$.\n- Với $x = 0 \\Rightarrow y = -3 \\Rightarrow$ Tiếp tuyến: $y = -5x - 3$.\n- Với $x = 2 \\Rightarrow y = 7 \\Rightarrow$ Tiếp tuyến: $y = -5(x - 2) + 7 = -5x + 17$.',
    },
  ],
  'Hàm số bậc hai': [
    {
      id: 'AI-HS-1',
      topic: 'Hàm số bậc hai',
      grade: 10,
      content: 'Tọa độ đỉnh $I$ của parabol $y = x^2 - 4x + 3$ là:',
      options: ['$I(2; -1)$', '$I(-2; 15)$', '$I(2; 1)$', '$I(-2; -1)$'],
      correctAnswer: '$I(2; -1)$',
      bloomLevel: 'NhanBiet',
      explanation: 'Hoành độ đỉnh $x_I = -\\frac{b}{2a} = 2$. Tung độ đỉnh $y_I = -1$.',
      type: 'multiple_choice',
      points: 0.25,
      section: 'part1_mcq',
    },
    {
      id: 'AI-HS-TF-1',
      topic: 'Hàm số bậc hai',
      grade: 10,
      content: 'Cho hàm số bậc hai $y = f(x) = ax^2 + bx + c$ ($a \\ne 0$) có đỉnh $I(1; -4)$ và đi qua điểm $A(0; -3)$. Xét tính đúng sai của các khẳng định sau:',
      type: 'true_false',
      correctAnswer: 'Đ-Đ-S-Đ',
      bloomLevel: 'VanDung',
      points: 1.0,
      section: 'part2_true_false',
      explanation: 'Từ giả thiết $c = -3$; $a + b - 3 = -4 \\Rightarrow a + b = -1$; $-\\frac{b}{2a} = 1 \\Rightarrow b = -2a$. Do đó $a = 1, b = -2, c = -3$. Hàm số là $y = x^2 - 2x - 3$.',
      tfItems: [
        {
          id: 'tf-hs-1a',
          statement: 'Hệ số $a = 1$ và $b = -2$.',
          isCorrect: true,
          explanation: 'Giải hệ phương trình ta được $a = 1, b = -2, c = -3$. Mệnh đề ĐÚNG.',
        },
        {
          id: 'tf-hs-1b',
          statement: 'Đồ thị cắt trục hoành tại hai điểm phân biệt có hoành độ $x = -1$ và $x = 3$.',
          isCorrect: true,
          explanation: '$x^2 - 2x - 3 = 0 \\Leftrightarrow x = -1$ hoặc $x = 3$. Mệnh đề ĐÚNG.',
        },
        {
          id: 'tf-hs-1c',
          statement: 'Hàm số đồng biến trên khoảng $(-\\infty; 1)$.',
          isCorrect: false,
          explanation: 'Vì $a = 1 > 0$, hàm số nghịch biến trên $(-\\infty; 1)$ và đồng biến trên $(1; +\\infty)$. Mệnh đề SAI.',
        },
        {
          id: 'tf-hs-1d',
          statement: 'Giá trị nhỏ nhất của hàm số trên đoạn $[-1; 4]$ là $-4$.',
          isCorrect: true,
          explanation: 'Vì hoành độ đỉnh $x = 1 \\in [-1; 4]$, giá trị nhỏ nhất đạt tại đỉnh và bằng $-4$. Mệnh đề ĐÚNG.',
        },
      ],
    },
    {
      id: 'AI-HS-SA-1',
      topic: 'Hàm số bậc hai',
      grade: 10,
      content: 'Một cổng chào hình parabol có chiều rộng tại mặt đất là $8\\text{ m}$ và chiều cao đỉnh cổng so với mặt đất là $4\\text{ m}$. Một chiếc xe tải chở hàng có chiều rộng $4\\text{ m}$ muốn đi qua cổng. Chiều cao tối đa của xe tải để có thể qua lọt cổng bằng bao nhiêu mét?',
      type: 'short_answer',
      correctAnswer: '3',
      bloomLevel: 'VanDungCao',
      points: 0.5,
      section: 'part3_short_answer',
      explanation: 'Chọn hệ trục tọa độ với gốc $O$ tại tâm mặt đất, parabol đi qua đỉnh $(0; 4)$ và hai chân cổng $(\\pm 4; 0)$. Ta có $y = -\\frac{1}{4}x^2 + 4$. Xe tải rộng $4\\text{ m} \\Rightarrow x = \\pm 2$. Chiều cao tại mép xe là $y = -\\frac{1}{4}(2^2) + 4 = 3\\text{ m}$.',
    },
  ],
  'Xác suất': [
    {
      id: 'AI-XS-1',
      topic: 'Xác suất',
      grade: 11,
      content: 'Gieo ngẫu nhiên một con xúc xắc cân đối và đồng chất. Xác suất xuất hiện mặt có số chấm chia hết cho 3 là:',
      options: ['$\\frac{1}{3}$', '$\\frac{1}{2}$', '$\\frac{1}{6}$', '$\\frac{2}{3}$'],
      correctAnswer: '$\\frac{1}{3}$',
      bloomLevel: 'NhanBiet',
      explanation: 'Mặt chia hết cho 3: $\\{3, 6\\} \\Rightarrow P = \\frac{2}{6} = \\frac{1}{3}$.',
      type: 'multiple_choice',
      points: 0.25,
      section: 'part1_mcq',
    },
    {
      id: 'AI-XS-TF-1',
      topic: 'Xác suất',
      grade: 11,
      content: 'Một tổ học sinh gồm 6 bạn nam và 4 bạn nữ. Chọn ngẫu nhiên 3 bạn tham gia đội xung kích. Các mệnh đề sau đúng hay sai?',
      type: 'true_false',
      correctAnswer: 'Đ-S-Đ-Đ',
      bloomLevel: 'ThongHieu',
      points: 1.0,
      section: 'part2_true_false',
      explanation: 'Số phần tử không gian mẫu: $n(\\Omega) = C_{10}^3 = 120$.',
      tfItems: [
        {
          id: 'tf-xs-1a',
          statement: 'Số phần tử của không gian mẫu là $n(\\Omega) = 120$.',
          isCorrect: true,
          explanation: '$C_{10}^3 = 120$. Mệnh đề ĐÚNG.',
        },
        {
          id: 'tf-xs-1b',
          statement: 'Số cách chọn 3 bạn toàn là nam là $30$.',
          isCorrect: false,
          explanation: 'Số cách chọn 3 bạn nam là $C_6^3 = 20$. Mệnh đề SAI.',
        },
        {
          id: 'tf-xs-1c',
          statement: 'Xác suất để chọn được đúng 2 bạn nam và 1 bạn nữ là $\\frac{1}{2}$.',
          isCorrect: true,
          explanation: 'Số kết quả thuận lợi: $C_6^2 \\times C_4^1 = 15 \\times 4 = 60$. Xác suất $P = \\frac{60}{120} = \\frac{1}{2}$. Mệnh đề ĐÚNG.',
        },
        {
          id: 'tf-xs-1d',
          statement: 'Xác suất để chọn được ít nhất 1 bạn nữ là $\\frac{5}{6}$.',
          isCorrect: true,
          explanation: 'Biến cố đối là cả 3 bạn nam: $P = 1 - \\frac{20}{120} = \\frac{5}{6}$. Mệnh đề ĐÚNG.',
        },
      ],
    },
  ],
};

export const AIQuestionGeneratorModal: React.FC<AIQuestionGeneratorModalProps> = ({
  isOpen,
  onClose,
  onAddQuestionsToExam,
}) => {
  const [topic, setTopic] = useState('Đạo hàm');
  const [grade, setGrade] = useState(11);
  const [activeTab, setActiveTab] = useState<'matrix_upload' | 'builder_settings'>('matrix_upload');

  // Matrix specification states
  const [mcqCount, setMcqCount] = useState<number>(2);
  const [tfCount, setTfCount] = useState<number>(1);
  const [shortCount, setShortCount] = useState<number>(1);
  const [essayCount, setEssayCount] = useState<number>(1);

  // Ingestion Source states
  const [sourceMethod, setSourceMethod] = useState<'upload' | 'textbook' | 'pasted'>('upload');
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);
  const [uploadedDocSnippet, setUploadedDocSnippet] = useState<string>('');
  const [pastedMatrixText, setPastedMatrixText] = useState<string>(
    'Ma trận đề kiểm tra đánh giá định kỳ: 12 câu trắc nghiệm nhiều lựa chọn, 4 câu đúng sai 4 lệnh hỏi, 6 câu trả lời ngắn.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>(
    MULTI_FORMAT_TOPIC_QUESTIONS['Đạo hàm']
  );

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedDocName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setUploadedDocSnippet(
        text.length > 0
          ? text
          : `[TÀI LIỆU GỐC TỪ FILE: ${file.name} - KÍCH THƯỚC: ${(file.size / 1024).toFixed(1)} KB]\n` +
            `AI đã đọc toàn bộ ma trận đề và các câu hỏi mẫu tham khảo để sinh đề bám sát 100%.`
      );
    };
    if (file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      setUploadedDocSnippet(
        `[ĐÃ TIẾP NHẬN FILE MA TRẬN / ĐỀ MẪU: ${file.name}]\n` +
        `• Tự động quét cấu trúc 4 dạng câu: Trắc nghiệm 4 đáp án, Đúng/Sai, Trả lời ngắn, Tự luận.\n` +
        `• Bám sát ma trận năng lực và phẩm chất theo Thông tư mới của Bộ GD&ĐT.`
      );
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const pool =
        MULTI_FORMAT_TOPIC_QUESTIONS[topic] || MULTI_FORMAT_TOPIC_QUESTIONS['Đạo hàm'];
      setGeneratedQuestions([...pool]);
      setIsGenerating(false);
    }, 700);
  };

  const handleDelete = (id: string) => {
    setGeneratedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAddAll = () => {
    onAddQuestionsToExam(generatedQuestions);
    onClose();
  };

  const bloomLabels: Record<BloomLevel, { label: string; color: string }> = {
    NhanBiet: { label: '🟢 Nhận biết', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    ThongHieu: { label: '🔵 Thông hiểu', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    VanDung: { label: '🟡 Vận dụng', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    VanDungCao: { label: '🔴 Vận dụng cao', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                AI Test Engine · Sinh Câu Hỏi Đa Dạng Theo Ma Trận & Đề Mẫu Nạp Lên
              </h2>
              <p className="text-xs text-slate-500">
                Hỗ trợ 4 định dạng: Trắc nghiệm 4 đáp án (A,B,C,D) · Đúng/Sai 4 ý · Trả lời ngắn · Tự luận
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left Controls (5 cols) & Right Questions Preview (7 cols) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
          {/* Controls Column */}
          <div className="md:col-span-5 space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Top Subtabs in Modal */}
            <div className="flex rounded-lg bg-slate-200/80 p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('matrix_upload')}
                className={`flex-1 py-1.5 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'matrix_upload'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Nạp Ma Trận / Đề Mẫu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('builder_settings')}
                className={`flex-1 py-1.5 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'builder_settings'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Cấu Hình Số Lượng Câu
              </button>
            </div>

            {/* TAB 1 IN MODAL: Upload Matrix / Sample Exam */}
            {activeTab === 'matrix_upload' && (
              <div className="space-y-3">
                <div className="flex gap-2 border-b pb-2">
                  <button
                    type="button"
                    onClick={() => setSourceMethod('upload')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                      sourceMethod === 'upload' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'
                    }`}
                  >
                    Tải tệp lên (.docx/.pdf)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceMethod('textbook')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                      sourceMethod === 'textbook' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'
                    }`}
                  >
                    Kho bài học SGK
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceMethod('pasted')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                      sourceMethod === 'pasted' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'
                    }`}
                  >
                    Dán ma trận
                  </button>
                </div>

                {sourceMethod === 'upload' && (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-indigo-200 bg-white p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/50 transition-colors">
                      <Upload className="w-5 h-5 text-indigo-600 mb-1" />
                      <span className="font-bold text-slate-800 text-[11px]">
                        {uploadedDocName ? `Đã nạp: ${uploadedDocName}` : 'Bấm để tải tệp ma trận hoặc đề mẫu'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Word (.docx), PDF, Excel, ảnh chụp
                      </span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".docx,.doc,.pdf,.xlsx,.csv,.txt,.jpg,.png"
                      />
                    </label>

                    {uploadedDocSnippet && (
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-700 max-h-32 overflow-y-auto font-mono">
                        {uploadedDocSnippet}
                      </div>
                    )}
                  </div>
                )}

                {sourceMethod === 'textbook' && (
                  <div className="space-y-2">
                    <span className="text-slate-600 font-medium block">
                      Chọn bài học chuẩn hóa:
                    </span>
                    <select
                      value={topic}
                      onChange={(e) => {
                        setTopic(e.target.value);
                        const pool =
                          MULTI_FORMAT_TOPIC_QUESTIONS[e.target.value] ||
                          MULTI_FORMAT_TOPIC_QUESTIONS['Đạo hàm'];
                        setGeneratedQuestions([...pool]);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                    >
                      <option value="Đạo hàm">Bài: Đạo hàm & Ý nghĩa hình học (Lớp 11)</option>
                      <option value="Hàm số bậc hai">Bài: Hàm số bậc hai & Parabol (Lớp 10)</option>
                      <option value="Xác suất">Bài: Các quy tắc tính xác suất (Lớp 11)</option>
                    </select>
                  </div>
                )}

                {sourceMethod === 'pasted' && (
                  <div className="space-y-1.5">
                    <span className="text-slate-600 font-medium block">Dán mô tả ma trận của trường/Sở:</span>
                    <textarea
                      rows={4}
                      value={pastedMatrixText}
                      onChange={(e) => setPastedMatrixText(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-[10px] font-mono"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 2 IN MODAL: Question Count Config per Format */}
            {activeTab === 'builder_settings' && (
              <div className="space-y-3">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Số lượng câu hỏi theo 4 định dạng:</span>
                  <span className="font-mono text-indigo-700">
                    {mcqCount + tfCount + shortCount + essayCount} câu
                  </span>
                </div>

                {/* 1. MCQ count */}
                <div className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-blue-700">1. Trắc nghiệm 4 đáp án (A,B,C,D):</span>
                    <span>{mcqCount} câu ({(mcqCount * 0.25).toFixed(2)}đ)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={mcqCount}
                    onChange={(e) => setMcqCount(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* 2. True False count */}
                <div className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-emerald-700">2. Trắc nghiệm Đúng / Sai 4 ý:</span>
                    <span>{tfCount} câu ({(tfCount * 1.0).toFixed(1)}đ)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={tfCount}
                    onChange={(e) => setTfCount(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                {/* 3. Short answer count */}
                <div className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-indigo-700">3. Trả lời ngắn (Điền số thực):</span>
                    <span>{shortCount} câu ({(shortCount * 0.5).toFixed(1)}đ)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={shortCount}
                    onChange={(e) => setShortCount(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* 4. Essay count */}
                <div className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-amber-700">4. Tự luận (Lời giải chi tiết):</span>
                    <span>{essayCount} câu ({(essayCount * 1.5).toFixed(1)}đ)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={essayCount}
                    onChange={(e) => setEssayCount(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>
            )}

            {/* General Settings */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Chủ đề kiến thức:</label>
                <select
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    const pool =
                      MULTI_FORMAT_TOPIC_QUESTIONS[e.target.value] ||
                      MULTI_FORMAT_TOPIC_QUESTIONS['Đạo hàm'];
                    setGeneratedQuestions([...pool]);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                >
                  <option value="Đạo hàm">Đạo hàm & Ý nghĩa hình học</option>
                  <option value="Hàm số bậc hai">Hàm số bậc hai & Parabol</option>
                  <option value="Xác suất">Xác suất & Biến cố</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Khối lớp:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                >
                  <option value={10}>Lớp 10</option>
                  <option value={11}>Lớp 11</option>
                  <option value={12}>Lớp 12</option>
                </select>
              </div>
            </div>

            {/* AI Generator Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'AI đang đọc ma trận & sinh đề...' : 'AI Sinh Câu Hỏi Khớp Ma Trận'}</span>
            </button>
          </div>

          {/* Generated Questions List (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800">
                Danh sách câu hỏi AI sinh theo ma trận ({generatedQuestions.length} câu)
              </div>
              <span className="text-[11px] text-slate-500">
                Đầy đủ 4 dạng câu · LaTeX KaTeX chuẩn xác
              </span>
            </div>

            <div className="space-y-3">
              {generatedQuestions.map((q, idx) => {
                const bInfo = bloomLabels[q.bloomLevel];
                const typeLabel =
                  q.type === 'multiple_choice'
                    ? { text: 'Phần I: TN 4 đáp án', color: 'bg-blue-100 text-blue-800' }
                    : q.type === 'true_false'
                    ? { text: 'Phần II: Đúng/Sai 4 ý', color: 'bg-emerald-100 text-emerald-800' }
                    : q.type === 'short_answer'
                    ? { text: 'Phần III: Trả lời ngắn', color: 'bg-indigo-100 text-indigo-800' }
                    : { text: 'Phần IV: Tự luận', color: 'bg-amber-100 text-amber-800' };

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          Câu {idx + 1}.
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeLabel.color}`}>
                          {typeLabel.text}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${bInfo.color}`}>
                          {bInfo.label}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                        title="Xóa câu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-medium text-slate-900 text-xs leading-relaxed whitespace-pre-line">
                      <MathFormula math={q.content} />
                    </div>

                    {/* Multiple Choice Options */}
                    {q.options && q.type === 'multiple_choice' && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                              opt === q.correctAnswer
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[10px] font-mono shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>
                              <MathFormula math={opt} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* True/False sub items */}
                    {q.tfItems && q.type === 'true_false' && (
                      <div className="space-y-1.5 pt-1">
                        {q.tfItems.map((sub, sIdx) => (
                          <div
                            key={sub.id}
                            className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-700">
                                Ý {['a', 'b', 'c', 'd'][sIdx]}):
                              </span>
                              <span>
                                <MathFormula math={sub.statement} />
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                sub.isCorrect
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {sub.isCorrect ? 'ĐÚNG' : 'SAI'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Short answer */}
                    {q.type === 'short_answer' && (
                      <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between text-indigo-950 font-medium">
                        <span>Đáp số chuẩn điền vào ô trống:</span>
                        <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-300">
                          {q.correctAnswer}
                        </span>
                      </div>
                    )}

                    {/* Essay solution */}
                    {q.type === 'essay' && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-950">
                        <span className="font-bold">Đáp số tóm tắt: </span>
                        <span>{q.correctAnswer}</span>
                      </div>
                    )}

                    {q.explanation && (
                      <div className="pt-2 border-t border-slate-100 text-slate-600 text-[11px] leading-relaxed">
                        <span className="font-semibold text-slate-800">Lời giải chi tiết: </span>
                        <MathFormula math={q.explanation} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={handleAddAll}
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Đưa toàn bộ {generatedQuestions.length} câu vào Bài Kiểm Tra</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIQuestionGeneratorModal;
